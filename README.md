# Système d'Enregistrement des Électeurs

Une application web moderne pour l'enregistrement et la gestion des électeurs avec authentification utilisateur et contrôle d'accès basé sur les rôles.

## Fonctionnalités

- **Authentification sécurisée** avec Supabase Auth
- **Gestion des rôles** : Super Administrateur et Utilisateur Standard
- **Enregistrement des électeurs** avec formulaire complet
- **Tableau de bord** avec statistiques récapitulatives
- **Filtrage avancé** des données
- **Modification** des enregistrements existants
- **Exportation** des données en PDF et Excel
- **Interface moderne** avec design sombre et responsive
- **Logo personnalisé** intégré

## Technologies Utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne
- **Supabase** - Base de données et authentification
- **React Hook Form** - Gestion des formulaires
- **jsPDF & xlsx** - Exportation de données
- **Lucide React** - Icônes modernes

## Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd personal-website
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration Supabase**
   - Créez un projet sur [Supabase](https://supabase.com)
   - Copiez `.env.local.example` vers `.env.local`
   - Ajoutez vos clés Supabase dans `.env.local`

4. **Configurer la base de données**
   - Exécutez le script SQL fourni dans `supabase-schema.sql`

5. **Ajouter le logo**
   - Placez votre logo dans `public/logo.png`

6. **Démarrer l'application**
   ```bash
   npm run dev
   ```

## Structure du Projet

```
├── app/
│   ├── auth/
│   │   ├── login/          # Page de connexion
│   │   └── register/       # Page d'inscription
│   ├── dashboard/          # Tableau de bord principal
│   ├── voters/
│   │   ├── register/       # Enregistrement d'électeurs
│   │   ├── edit/[id]/      # Modification d'électeurs
│   │   ├── export/         # Exportation des données
│   │   └── page.tsx        # Liste des électeurs
│   ├── globals.css         # Styles globaux
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Page d'accueil
├── lib/
│   └── supabase.ts         # Configuration Supabase
└── public/
    └── logo.png            # Logo de l'application
```

## Formulaire d'Enregistrement

Les champs suivants sont inclus dans l'ordre spécifié :

1. **Noms** (texte libre)
2. **Qualité** (sélection) : Candidat, Électeur, Responsable du bureau de vote, Responsable de la commune
3. **Genre** (sélection) : Homme, Femme
4. **Commune** (texte libre)
5. **Adresse** (texte libre)
6. **Téléphone 1** (requis)
7. **Téléphone 2** (optionnel)
8. **Profession** (texte libre)
9. **Bureau de vote** (texte libre)
10. **Leader** (texte libre)
11. **A Voté** (sélection) : Oui, Non
12. **Observations** (optionnel)

## Contrôle d'Accès

- **Super Administrateurs** : Accès complet à toutes les données
- **Utilisateurs Standards** : Accès uniquement à leurs propres données

## Exportation

- **PDF** : Liste formatée pour impression
- **Excel** : Données complètes pour analyse

## Couleurs du Design

- **Gris** : Arrière-plans et textes secondaires
- **Jaune** : Accents et boutons d'action
- **Bleu** : Éléments primaires et liens
- **Violet** : Gradients et éléments décoratifs
- **Blanc** : Textes principaux

## Support

Pour toute question ou problème, contactez l'équipe de développement.
