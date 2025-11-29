# 🚀 Rotsy Backend API

API Backend moderne construite avec **Node.js**, **Express**, **TypeScript**, **Prisma** et **PostgreSQL**, suivant les principes de **Clean Architecture**.

## 🚀 Prise en Main du Projet

### Installation et Configuration

1. **Cloner et installer**
```bash
git clone <repository-url>
cd rotsy/backend
npm install
```

2. **Configuration de l'environnement**
```bash
cp env.example .env
```

Éditez le fichier `.env` avec les variables suivantes :
```env
# Configuration du serveur
PORT=3000
NODE_ENV=development

# Base de données PostgreSQL
DATABASE_URL="postgresql://username:password@host:port/database"

# Configuration JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="604800"

# Configuration Gemini API (pour les fonctionnalités IA)
GEMINI_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.0-flash"
```

3. **Configuration de la base de données**
```bash
npm run db:push
npm run db:generate
```

4. **Démarrer le serveur**
```bash
npm run dev  # Mode développement
npm run build && npm start  # Mode production
```

Le serveur sera accessible sur `http://localhost:3000`

### 📚 Documentation API avec Swagger

Une fois le serveur démarré, accédez à la documentation Swagger interactive :

- **Interface Swagger UI** : http://localhost:3000/api-docs
- **JSON de spécification** : http://localhost:3000/api-docs.json

## 🏗️ Architecture du Projet

### Structure du Projet

Le projet suit une architecture en couches (Clean Architecture) :

```
src/
├── controller/        # Contrôleurs (couche présentation)
│   ├── base.controller.ts
│   ├── user.controller.ts
│   ├── intervention.controller.ts
│   └── ...
├── service/           # Services (couche métier)
│   ├── base.service.ts
│   ├── user.service.ts
│   ├── intervention.service.ts
│   └── remote/        # Services pour APIs externes (Gemini)
│       ├── recognizeImageGemini.service.ts
│       └── estimateIntervention.service.ts
├── repository/        # Repositories (couche données)
│   ├── base.repository.ts
│   ├── user.repository.ts
│   ├── intervention.repository.ts
│   └── remote/        # Repositories pour APIs externes
│       ├── recognizeImageGemini.repository.ts
│       └── estimateIntervention.repository.ts
├── model/dto/         # DTOs avec validation Zod
│   ├── user.dto.ts
│   ├── intervention.dto.ts
│   └── ...
├── routes/            # Définition des routes Express
│   ├── user.route.ts
│   ├── intervention.route.ts
│   └── ...
├── middleware/        # Middlewares Express
│   ├── auth.ts        # Authentification JWT
│   ├── validate.ts    # Validation des données
│   └── error_handler.ts
├── utils/             # Utilitaires
│   ├── config.ts      # Configuration centralisée
│   ├── jwt.utils.ts   # Utilitaires JWT
│   ├── prisma.ts      # Client Prisma
│   └── database_connection.ts
├── app_router.ts      # Configuration des routes
├── swagger.ts         # Configuration Swagger
└── index.ts           # Point d'entrée de l'application
```

### Principes de l'Architecture

#### 1. **Séparation des Responsabilités**

- **Controller** : Gère les requêtes HTTP et les réponses
- **Service** : Contient la logique métier
- **Repository** : Gère l'accès aux données (base de données ou APIs externes)
- **DTO** : Définit la structure et la validation des données

#### 2. **Héritage et Réutilisabilité**

- **BaseController** : Fournit les opérations CRUD de base
- **BaseService** : Fournit les opérations métier communes
- **BaseRepository** : Fournit les opérations d'accès aux données communes

#### 3. **Validation des Données**

- Utilisation de **Zod** pour la validation des schémas
- Validation automatique via middleware `validate`
- Messages d'erreur en français

#### 4. **Gestion des Erreurs**

- Middleware global de gestion d'erreurs
- Codes de statut HTTP appropriés
- Messages d'erreur structurés

### Flux de Données

```
Requête HTTP
    ↓
Route (routes/)
    ↓
Middleware (auth, validate)
    ↓
Controller (controller/)
    ↓
Service (service/)
    ↓
Repository (repository/)
    ↓
Base de données (Prisma) ou API externe
```

## 🗄️ Utilisation de Prisma

### Configuration Prisma

Le projet utilise **Prisma** comme ORM pour gérer la base de données PostgreSQL.

#### Fichier de Configuration

Le schéma Prisma se trouve dans `prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### Commandes Prisma Disponibles

```bash
# Synchroniser le schéma avec la base de données (développement)
npm run db:push

# Générer le client Prisma
npm run db:generate

# Créer une migration (production)
npm run db:migrate

# Appliquer les migrations (production)
npm run db:deploy

# Ouvrir Prisma Studio (interface graphique)
npm run db:studio

# Réinitialiser la base de données
npm run db:reset
```

### Modèles de Données

Les modèles sont définis dans `prisma/schema.prisma`. Voici les principaux modèles :

- **User** : Utilisateurs de l'application
- **Intervention** : Interventions techniques
- **Materiel** : Matériels associés aux interventions
- **Timesheet** : Feuilles de temps
- **Image** : Images associées aux interventions
- **Document** : Documents associés aux interventions
- **Comment** : Commentaires sur les interventions
- **Signature** : Signatures électroniques

### Relations Prisma

Les relations entre modèles sont définies dans le schéma :

```prisma
model User {
  id            String         @id @default(uuid())
  interventions Intervention[]
}

model Intervention {
  id          String      @id @default(uuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  materiels   Materiel[]
  timesheets  Timesheet[]
  images      Image[]
  documents   Document[]
  comments    Comment[]
  signatures  Signature[]
}
```

### Utilisation du Client Prisma

Le client Prisma est importé et utilisé dans les repositories :

```typescript
import { prisma } from "../utils/prisma";

// Exemple d'utilisation
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    interventions: true
  }
});
```

### Workflow de Modification du Schéma

1. **Modifier le schéma** dans `prisma/schema.prisma`
2. **Synchroniser** avec `npm run db:push` (développement)
   - Ou créer une migration avec `npm run db:migrate` (production)
3. **Générer le client** avec `npm run db:generate`
4. **Utiliser le nouveau client** dans le code

### Bonnes Pratiques Prisma

- ✅ Toujours utiliser les types générés par Prisma
- ✅ Utiliser `include` ou `select` pour optimiser les requêtes
- ✅ Gérer les transactions pour les opérations complexes
- ✅ Utiliser les relations Prisma plutôt que les jointures manuelles
- ✅ Valider les données avec Zod avant de les envoyer à Prisma

## 📝 Scripts Disponibles

### Scripts de Développement
```bash
npm run dev          # Développement avec rechargement automatique
npm run build        # Compilation TypeScript
npm start            # Démarrage en production
```

### Scripts de Base de Données
```bash
npm run db:push      # Synchroniser le schéma avec la DB (développement)
npm run db:generate  # Générer le client Prisma
npm run db:studio    # Interface Prisma Studio
npm run db:migrate   # Créer une migration (production)
npm run db:reset     # Réinitialiser la base de données
npm run db:deploy    # Appliquer les migrations (production)
```

---

**Développé avec ❤️ par Toavina77**
