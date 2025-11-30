# 🛠️ Guide de Gestion des Données (Prometheus)

Ce document recense les commandes essentielles pour gérer l'état de la base de données (Nettoyage, Remplissage, Debug) durant le développement.

## 🔄 1. Réinitialiser la Progression (Soft Reset)

Cette commande est celle que vous utiliserez le plus souvent.
Elle efface **toutes les données de progression utilisateur** :
*   Réponses au Diagnostic
*   Quêtes validées
*   Badges obtenus
*   Timeline (Parcours de vie)
*   XP et Niveau (remis à 1)

**Important :** Elle **conserve votre compte utilisateur** (Clerk) et votre profil de base. Vous n'avez pas besoin de vous reconnecter.

```bash
npx tsx prisma/scripts/reset-data.ts
```

---

## 🌱 2. Peupler la Base de Données (Seed)

Cette commande lit les fichiers de configuration dans `prisma/data/` (`quests.ts`, `badges.ts`, `journeys.ts`) et les injecte dans la base de données.

À exécuter si :
*   Vous avez modifié le texte d'une quête ou d'un badge dans le code.
*   Vous venez de faire un *Hard Reset*.
*   Vous voulez vous assurer que les définitions sont à jour.

```bash
npx prisma db seed
```

*Note : Le Seed nettoie d'abord les tables de définitions (Quests, Badges...) avant de les réinsérer.*

---

## 💥 3. Reset Total (Hard Reset)

⚠️ **Zone Danger**

Cette commande supprime physiquement la base de données, recrée toutes les tables à partir du schéma `schema.prisma`, et lance automatiquement le seed.
Elle est utile si vous avez modifié la structure de la base de données (ajout de colonnes, etc.).

```bash
npx prisma migrate reset
```

---

## 🕵️ 4. Visualiser les Données

Pour voir l'état brut de la base de données dans une interface graphique :

```bash
npx prisma studio
```

---

## ⚡ Workflow de Test Recommandé

Pour tester le parcours utilisateur "comme un nouveau venu" :

1.  **Nettoyer la progression :**
    ```bash
    npx tsx prisma/scripts/reset-data.ts
    ```

2.  **Mettre à jour les quêtes (optionnel) :**
    ```bash
    npx prisma db seed
    ```

3.  **Rafraîchir l'application :**
    Rechargez la page dans votre navigateur. Vous serez redirigé vers le début du parcours.
