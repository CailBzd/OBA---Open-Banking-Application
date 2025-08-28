# OBA - Open Banking Application

Une application moderne de suivi financier construite avec Next.js, TypeScript et shadcn/ui, permettant de se connecter à ses comptes bancaires via l'Open Banking européen avec TrueLayer.

## 🚀 Fonctionnalités

### 🔐 Connexion Bancaire
- **Interface de connexion sécurisée** aux banques européennes
- **Support Open Banking** conforme aux directives PSD2
- **Authentification sécurisée** via TrueLayer OAuth2
- **Banques supportées** : Plus de 2000 banques européennes (UK, IE, DE, FR, ES, IT, NL, BE, AT, PT)

### 📊 Tableau de Bord
- **Vue d'ensemble** de tous vos comptes
- **Suivi des revenus et dépenses** mois par mois
- **Catégorisation automatique** des transactions
- **Graphiques et tendances** de vos finances
- **Métriques clés** : solde total, épargne, flux de trésorerie

### 💳 Gestion des Comptes
- **Multi-comptes** : courants, épargne, joints
- **Synchronisation automatique** des données
- **Historique des transactions** détaillé
- **Statuts en temps réel** des comptes

### 📈 Analyses et Rapports
- **Suivi mensuel** des finances
- **Répartition par catégorie** (alimentation, transport, shopping, etc.)
- **Tendances et projections** financières
- **Export des données** pour analyse externe

## 🛠️ Technologies Utilisées

- **Frontend** : Next.js 14 avec App Router
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **UI Components** : shadcn/ui
- **Gestionnaire de paquets** : Yarn
- **Icônes** : Lucide React
- **API** : TrueLayer Open Banking API
- **Graphiques** : Recharts
- **Dates** : date-fns

## 📁 Structure du Projet

```
src/
├── app/                    # Pages Next.js
│   ├── truelayer/         # Page TrueLayer Open Banking
│   ├── accounts/          # Page de gestion des comptes
│   └── layout.tsx         # Layout principal
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   ├── TrueLayerConnection.tsx # Composant de connexion TrueLayer
│   └── Navigation.tsx    # Navigation latérale
├── types/                 # Types TypeScript
│   └── truelayer-api.ts  # Interfaces TrueLayer API
├── lib/                   # Services et utilitaires
│   └── truelayer-api.ts  # Service TrueLayer API
└── hooks/                 # Hooks React
    └── useTrueLayerApi.ts # Hook pour TrueLayer
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- Yarn

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd openbank-app

# Installer les dépendances
yarn install

# Démarrer le serveur de développement
yarn dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Scripts Disponibles
```bash
yarn dev          # Démarre le serveur de développement
yarn build        # Construit l'application pour la production
yarn start        # Démarre le serveur de production
yarn lint         # Lance ESLint
```

## 🔧 Configuration

### Variables d'Environnement
Créez un fichier `.env.local` à la racine du projet :

```env
# Configuration TrueLayer (à configurer selon vos besoins)
TRUELAYER_CLIENT_ID=votre_client_id
TRUELAYER_CLIENT_SECRET=votre_client_secret
TRUELAYER_REDIRECT_URI=http://localhost:3000/api/truelayer/callback
NEXT_PUBLIC_APP_NAME=OBA
```

### Configuration shadcn/ui
Le projet est pré-configuré avec shadcn/ui. Pour ajouter de nouveaux composants :

```bash
npx shadcn@latest add <component-name>
```

## 🎨 Personnalisation

### Thème et Couleurs
Modifiez les variables CSS dans `src/app/globals.css` pour personnaliser le thème :

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... autres variables */
}
```

### Composants
Tous les composants shadcn/ui sont personnalisables via Tailwind CSS et les variables CSS.

## 🔒 Sécurité

- **Aucun stockage** de mots de passe bancaires
- **Conformité PSD2** et standards Open Banking
- **Authentification sécurisée** via TrueLayer OAuth2
- **Chiffrement** des données sensibles
- **Audit de sécurité** régulier

## 📱 Responsive Design

L'application est entièrement responsive avec :
- **Navigation mobile** avec menu hamburger
- **Layout adaptatif** pour tous les écrans
- **Composants optimisés** pour mobile et desktop

## 🚧 Développement

### Ajout de Nouvelles Fonctionnalités
1. Créez les types TypeScript dans `src/types/`
2. Développez les composants dans `src/components/`
3. Ajoutez les pages dans `src/app/`
4. Mettez à jour la navigation si nécessaire

### Tests
```bash
# Tests unitaires (à implémenter)
yarn test

# Tests d'intégration (à implémenter)
yarn test:integration
```

## 📈 Roadmap

- [x] **Intégration TrueLayer** Open Banking API
- [ ] **Notifications** en temps réel
- [ ] **Mode hors ligne** avec synchronisation
- [ ] **Multi-devises** et conversion automatique
- [ ] **Intelligence artificielle** pour la catégorisation
- [ ] **Objectifs financiers** et suivi des progrès
- [ ] **Application mobile** React Native

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement
- Consultez la documentation technique

---

**OBA** - Votre partenaire financier intelligent 🚀
