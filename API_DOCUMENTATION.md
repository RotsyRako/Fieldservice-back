# 📚 Documentation API Rotsy Backend

## 🎯 Vue d'ensemble

L'API Rotsy Backend est une API REST complète développée avec Node.js, TypeScript, Express, et Prisma. Elle gère les utilisateurs, interventions, matériels et timesheets avec authentification JWT.

## 🏗️ Architecture

### Stack technique
- **Backend**: Node.js + TypeScript + Express
- **Base de données**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentification**: JWT
- **Validation**: Zod
- **Tests**: Collection Postman + Script automatisé

### Structure du projet
```
src/
├── controller/     # Contrôleurs pour chaque entité
├── middleware/      # Middleware d'authentification et validation
├── model/dto/       # DTOs avec validation Zod
├── repository/     # Couche d'accès aux données
├── routes/          # Définition des routes
├── service/         # Logique métier
└── utils/           # Utilitaires (JWT, base de données, etc.)
```

## 📊 Modèles de données

### User
- `id`: UUID (clé primaire)
- `name`: String
- `email`: String (unique)
- `password`: String (hashé)
- `token`: String (optionnel)
- `createdAt`: DateTime

### Intervention
- `id`: UUID (clé primaire)
- `titre`: String
- `dateStart`: String
- `dateEnd`: String
- `status`: Int
- `priority`: String
- `customer`: String
- `long`: Float
- `lat`: Float
- `distance`: Float
- `description`: String
- `userId`: UUID (clé étrangère vers User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Materiel
- `id`: UUID (clé primaire)
- `name`: String
- `quantity`: Int
- `idIntervention`: UUID (clé étrangère vers Intervention)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Timesheet
- `id`: UUID (clé primaire)
- `description`: String
- `timeAllocated`: Float
- `date`: String (format dd/mm/YYYY)
- `idIntervention`: UUID (clé étrangère vers Intervention)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## 🔗 Relations

- **User** → **Intervention** (1:N) : Un utilisateur peut avoir plusieurs interventions
- **Intervention** → **Materiel** (1:N) : Une intervention peut avoir plusieurs matériels
- **Intervention** → **Timesheet** (1:N) : Une intervention peut avoir plusieurs timesheets

## 🚀 Endpoints disponibles

### Health Check
- `GET /health` - Vérification de l'état du serveur

### Authentication
- `POST /api/users` - Création d'un utilisateur
- `POST /api/auth/login` - Authentification

### Users (Authentification requise)
- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/:id` - Récupère un utilisateur par ID
- `GET /api/users/email/:email` - Récupère un utilisateur par email
- `PUT /api/users/:id` - Met à jour un utilisateur
- `DELETE /api/users/:id` - Supprime un utilisateur
- `GET /api/users/count` - Compte les utilisateurs
- `GET /api/users/search` - Recherche des utilisateurs

### Interventions (Authentification requise)
- `POST /api/interventions` - Crée une intervention
- `GET /api/interventions` - Liste toutes les interventions
- `GET /api/interventions/:id` - Récupère une intervention par ID
- `PUT /api/interventions/:id` - Met à jour une intervention
- `DELETE /api/interventions/:id` - Supprime une intervention
- `GET /api/interventions/count` - Compte les interventions
- `GET /api/interventions/search` - Recherche des interventions

### Materiels (Authentification requise)
- `POST /api/materiels` - Crée un matériel
- `GET /api/materiels` - Liste tous les matériels
- `GET /api/materiels/:id` - Récupère un matériel par ID
- `PUT /api/materiels/:id` - Met à jour un matériel
- `DELETE /api/materiels/:id` - Supprime un matériel
- `GET /api/materiels/count` - Compte les matériels
- `GET /api/materiels/search` - Recherche des matériels

### Timesheets (Authentification requise)
- `POST /api/timesheets` - Crée un timesheet
- `GET /api/timesheets` - Liste tous les timesheets
- `GET /api/timesheets/:id` - Récupère un timesheet par ID
- `PUT /api/timesheets/:id` - Met à jour un timesheet
- `DELETE /api/timesheets/:id` - Supprime un timesheet
- `GET /api/timesheets/count` - Compte les timesheets
- `GET /api/timesheets/search` - Recherche des timesheets

## 🔐 Authentification

L'API utilise l'authentification JWT. Pour accéder aux endpoints protégés :

1. Créer un utilisateur avec `POST /api/users`
2. Se connecter avec `POST /api/auth/login`
3. Utiliser le token JWT dans l'en-tête : `Authorization: Bearer <token>`

## 📝 Validation des données

Tous les endpoints utilisent la validation Zod avec des messages d'erreur en français :

### Exemples de validation
- **Email** : Format email valide
- **UUID** : Format UUID valide
- **Date** : Format dd/mm/YYYY pour les timesheets
- **Temps** : Nombre positif pour timeAllocated
- **Quantité** : Entier positif pour les matériels

## 🧪 Tests

### Collection Postman
- **Fichier** : `Rotsy_API_Collection.postman_collection.json`
- **Environnement** : `Rotsy_Environment.postman_environment.json`
- **Documentation** : `POSTMAN_README.md`

### Script de test automatisé
- **Fichier** : `test_api.sh`
- **Fonctionnalités** : Test complet de tous les endpoints
- **Résultat** : ✅ Tous les tests passent

## 🚀 Démarrage rapide

### 1. Installation
```bash
npm install
```

### 2. Configuration de la base de données
```bash
npx prisma migrate dev
npx prisma generate
```

### 3. Démarrage du serveur
```bash
npm start
```

### 4. Test de l'API
```bash
./test_api.sh
```

## 📁 Fichiers créés

### Collection Postman
- `Rotsy_API_Collection.postman_collection.json` - Collection complète
- `Rotsy_Environment.postman_environment.json` - Variables d'environnement
- `POSTMAN_README.md` - Guide d'utilisation Postman

### Tests
- `test_api.sh` - Script de test automatisé
- `API_DOCUMENTATION.md` - Cette documentation

### Code source
- `src/model/dto/timesheet.dto.ts` - DTO Timesheet
- `src/repository/timesheet.repository.ts` - Repository Timesheet
- `src/service/timesheet.service.ts` - Service Timesheet
- `src/controller/timesheet.controller.ts` - Controller Timesheet
- `src/routes/timesheet.route.ts` - Routes Timesheet
- `src/app_router.ts` - Intégration des routes
- `prisma/schema.prisma` - Modèle Timesheet ajouté

## 🎉 Résultats

### ✅ Fonctionnalités implémentées
- [x] Modèle Timesheet avec relation vers Intervention
- [x] CRUD complet pour Timesheet
- [x] Validation des données avec Zod
- [x] Authentification JWT
- [x] Collection Postman complète
- [x] Tests automatisés
- [x] Documentation complète

### ✅ Tests validés
- [x] Création d'utilisateur
- [x] Authentification
- [x] Création d'intervention
- [x] Création de matériel
- [x] Création de timesheet
- [x] Récupération de toutes les entités
- [x] Comptage des entités
- [x] Mise à jour des entités
- [x] Suppression des entités

## 🔧 Maintenance

### Mise à jour de la base de données
```bash
npx prisma migrate dev
npx prisma generate
```

### Redémarrage du serveur
```bash
npm run build
npm start
```

### Tests de régression
```bash
./test_api.sh
```

---

**API Rotsy Backend** - Développé avec ❤️ en TypeScript
