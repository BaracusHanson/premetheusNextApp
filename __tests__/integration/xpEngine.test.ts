// On mock le module de base de données AVANT les imports
jest.mock('@/lib/db', () => {
  return {
    prisma: {
      userProfile: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      xPEvent: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    },
  };
});

import { addXP, calculateStreak } from '@/lib/xpEngine';
import { prisma } from '@/lib/db';
import { subDays } from 'date-fns';

// Test d'intégration du Moteur d'XP
describe('Moteur XP (Intégration)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addXP', () => {
    it('devrait ajouter de l\'XP et faire monter de niveau l\'utilisateur', async () => {
      // 1. Préparation (Arrange)
      const userId = 'user-123';
      const initialXP = 0;
      const xpToAdd = 600; // Assez pour passer au niveau 2 (seuil à 500)
  
      // On simule un utilisateur existant dans la base de données
      (prisma.userProfile.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        totalXP: initialXP,
        level: 1,
      });
  
      // 2. Exécution (Act)
      const result = await addXP(userId, xpToAdd, 'QUEST_COMPLETION');
  
      // 3. Vérification (Assert)
      
      // Vérifie que le calcul retourné est correct
      expect(result.newTotalXP).toBe(600);
      expect(result.newLevel).toBe(2); // Car 600 > 500
  
      // Vérifie que la mise à jour en base de données a bien été demandée avec les bonnes valeurs
      expect(prisma.userProfile.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          totalXP: 600,
          level: 2
        }
      });
  
      // Vérifie que l'événement d'XP a bien été enregistré pour l'historique
      expect(prisma.xPEvent.create).toHaveBeenCalledWith({
        data: {
          userId,
          type: 'QUEST_COMPLETION',
          amount: xpToAdd
        }
      });
    });
  
    it('devrait lancer une erreur si l\'utilisateur n\'existe pas', async () => {
      // Simulation : l'utilisateur n'est pas trouvé (retourne null)
      (prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(null);
  
      // On s'attend à ce que l'appel de la fonction échoue
      await expect(addXP('fake-id', 100, 'TEST'))
        .rejects
        .toThrow("User not found");
    });
  });

  describe('calculateStreak', () => {
    const userId = 'streak-user';

    it('retourne 0 si aucun événement', async () => {
      (prisma.xPEvent.findMany as jest.Mock).mockResolvedValue([]);
      const streak = await calculateStreak(userId);
      expect(streak).toBe(0);
    });

    it('retourne 1 si activité aujourd\'hui seulement', async () => {
      (prisma.xPEvent.findMany as jest.Mock).mockResolvedValue([
        { createdAt: new Date() }
      ]);
      const streak = await calculateStreak(userId);
      expect(streak).toBe(1);
    });

    it('retourne 1 si activité hier seulement (série maintenue)', async () => {
      (prisma.xPEvent.findMany as jest.Mock).mockResolvedValue([
        { createdAt: subDays(new Date(), 1) }
      ]);
      const streak = await calculateStreak(userId);
      expect(streak).toBe(1);
    });

    it('retourne 0 si dernière activité avant hier (série brisée)', async () => {
      (prisma.xPEvent.findMany as jest.Mock).mockResolvedValue([
        { createdAt: subDays(new Date(), 2) }
      ]);
      const streak = await calculateStreak(userId);
      expect(streak).toBe(0);
    });

    it('calcule correctement une série de 3 jours', async () => {
      // Aujourd'hui, Hier, Avant-hier
      const today = new Date();
      (prisma.xPEvent.findMany as jest.Mock).mockResolvedValue([
        { createdAt: today },
        { createdAt: subDays(today, 1) },
        { createdAt: subDays(today, 2) }
      ]);
      const streak = await calculateStreak(userId);
      expect(streak).toBe(3);
    });

    it('gère plusieurs événements le même jour', async () => {
      // Plusieurs activités aujourd'hui ne devraient compter que pour 1 jour
      const today = new Date();
      (prisma.xPEvent.findMany as jest.Mock).mockResolvedValue([
        { createdAt: today },
        { createdAt: new Date(today.getTime() - 1000) }, // 1 seconde avant
        { createdAt: subDays(today, 1) }
      ]);
      const streak = await calculateStreak(userId);
      expect(streak).toBe(2);
    });

    it('s\'arrête s\'il y a un trou dans la série', async () => {
      // Aujourd'hui, Hier, (Trou), 4 jours avant
      const today = new Date();
      (prisma.xPEvent.findMany as jest.Mock).mockResolvedValue([
        { createdAt: today },
        { createdAt: subDays(today, 1) },
        // Pas d'activité à J-2
        { createdAt: subDays(today, 3) }
      ]);
      const streak = await calculateStreak(userId);
      expect(streak).toBe(2);
    });
  });
});
