import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Démarrage du reset des données utilisateur...");

  // 1. Supprimer les réponses aux formulaires (Le Diagnostic)
  await prisma.userFormAnswers.deleteMany({});
  console.log("✅ Réponses formulaire supprimées.");

  // 2. Supprimer les quêtes utilisateur
  await prisma.userQuest.deleteMany({});
  console.log("✅ Quêtes utilisateur supprimées.");

  // 3. Supprimer les parcours utilisateur
  await prisma.userJourney.deleteMany({});
  console.log("✅ Parcours utilisateur supprimés.");

  // 4. Supprimer les badges débloqués
  await prisma.userBadge.deleteMany({}); 
  console.log("✅ Badges utilisateur supprimés.");
  
  // 4.1 Supprimer aussi les LifeEvents si stockés
  await prisma.lifeEvent.deleteMany({});
  console.log("✅ LifeEvents supprimés.");

  // 4.2 Supprimer aussi les XPEvents
  await prisma.xPEvent.deleteMany({});
  console.log("✅ XPEvents supprimés.");

  // 5. Reset de l'XP et du Niveau des utilisateurs
  await prisma.userProfile.updateMany({
    data: {
      level: 1,
      totalXP: 0,
    }
  });
  console.log("✅ Profils utilisateurs réinitialisés (Lvl 1, 0 XP).");

  console.log("🚀 Reset terminé avec succès ! Vous pouvez recharger la page.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
