# 🚀 Field Service Backend API

API Backend moderne construite avec **Node.js**, **Express**, **TypeScript**, **Prisma** et **Supabase**, suivant les principes de **Clean Architecture**.

## 🚀 Prise en Main du Projet

### Installation et Configuration

1. **Cloner et installer**
```bash
git clone <repository-url>
cd field-service-backend
npm install
```

2. **Configuration de l'environnement**
```bash
cp .env.example .env
```

Éditez le fichier `.env` avec les variables suivantes :
```env
# Configuration du serveur
PORT=3000
NODE_ENV=development

# Base de données Supabase
DATABASE_URL="postgresql://username:password@host:port/database"

# Configuration JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="604800"

# Configuration Supabase (optionnel)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
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

## 📚 Documentation d'Utilisation

### 🔧 Ajouter une Variable d'Environnement

1. **Ajouter dans le fichier `.env`**
```env
MA_NOUVELLE_VARIABLE="valeur"
```

2. **Déclarer dans `src/utils/config.ts`**
```typescript
export const config = {
  // ... autres configurations
  maNouvelleSection: {
    maVariable: process.env.MA_NOUVELLE_VARIABLE || "valeur_par_defaut",
  },
} as const;
```

3. **Utiliser dans le code**
```typescript
import { config } from "./utils/config";

const maValeur = config.maNouvelleSection.maVariable;
```

### 🗄️ Créer un Modèle Prisma (Base de Données)

#### 1. **Définir le Modèle dans le Schéma** (`prisma/schema.prisma`)

```prisma
model MaEntite {
  id          String   @id @default(cuid())
  nom         String
  description String?
  email       String   @unique
  age         Int?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations (optionnel)
  // user       User     @relation(fields: [userId], references: [id])
  // userId     String

  @@map("ma_entite")
}
```

#### 2. **Types de Champs Prisma Courants**

```prisma
model Exemple {
  // Identifiants
  id        String   @id @default(cuid())     // ID unique
  uuid      String   @id @default(uuid())     // UUID
  
  // Texte
  nom       String                            // Texte obligatoire
  email     String   @unique                  // Texte unique
  description String?                         // Texte optionnel
  
  // Numériques
  age       Int?                              // Entier optionnel
  prix      Float                             // Décimal
  quantite  Int      @default(0)              // Entier avec valeur par défaut
  
  // Booléens
  isActive  Boolean  @default(true)           // Booléen avec défaut
  
  // Dates
  createdAt DateTime @default(now())          // Date de création
  updatedAt DateTime @updatedAt               // Date de mise à jour
  
  // Énumérations
  status    Status   @default(PENDING)        // Énumération
  
  // Relations
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  
  // Index et contraintes
  @@unique([email, nom])                      // Contrainte unique composite
  @@index([createdAt])                        // Index sur createdAt
  @@map("exemple")                            // Nom de table personnalisé
}

enum Status {
  PENDING
  APPROVED
  REJECTED
}
```

#### 3. **Appliquer les Changements à la Base de Données**

```bash
# Option 1: Synchronisation directe (développement)
npm run db:push

# Option 2: Migration avec historique (production)
npm run db:migrate

# Générer le client Prisma
npm run db:generate
```

#### 4. **Vérifier les Changements**

```bash
# Ouvrir Prisma Studio pour voir les données
npm run db:studio
```

### 🏗️ Créer une Nouvelle API (Entité Complète)

#### 1. **Créer le Repository** (`src/repository/maEntite.repository.ts`)
```typescript
import { BaseRepository } from "./base.repository";
import { MaEntite, CreateMaEntiteData, UpdateMaEntiteData } from "@prisma/client";

export class MaEntiteRepository extends BaseRepository<MaEntite, CreateMaEntiteData, UpdateMaEntiteData> {
  protected getSelectFields() {
    return {
      id: true,
      nom: true,
      description: true,
      email: true,
      isActive: true,
      createdAt: true,
      // Exclure les champs sensibles
    };
  }
}

export const maEntiteRepository = new MaEntiteRepository("maEntite");
```

#### 2. **Créer le Service** (`src/service/maEntite.service.ts`)
```typescript
import { BaseService } from "./base.service";
import { MaEntite, CreateMaEntiteData, UpdateMaEntiteData } from "@prisma/client";
import { maEntiteRepository } from "../repository/maEntite.repository";

export class MaEntiteService extends BaseService<MaEntite, CreateMaEntiteData, UpdateMaEntiteData> {
  constructor() {
    super(maEntiteRepository);
  }

  protected async validateCreate(data: CreateMaEntiteData): Promise<void> {
    // Validation métier pour la création
    if (!data.nom || data.nom.length < 2) {
      throw new Error("Le nom doit avoir au moins 2 caractères");
    }
    
    // Vérifier l'unicité de l'email
    const existing = await maEntiteRepository.findByField("email", data.email);
    if (existing) {
      throw new Error("Cet email est déjà utilisé");
    }
  }

  protected async validateUpdate(data: UpdateMaEntiteData): Promise<void> {
    // Validation métier pour la mise à jour
    if (data.nom && data.nom.length < 2) {
      throw new Error("Le nom doit avoir au moins 2 caractères");
    }
    
    if (data.email) {
      const existing = await maEntiteRepository.findByField("email", data.email);
      if (existing && existing.id !== data.id) {
        throw new Error("Cet email est déjà utilisé");
      }
    }
  }

  protected async validateDelete(id: string): Promise<void> {
    // Validation métier pour la suppression
    // Par exemple : vérifier qu'il n'y a pas de dépendances
    const entity = await maEntiteRepository.findById(id);
    if (!entity) {
      throw new Error("Entité non trouvée");
    }
  }
}

export const maEntiteService = new MaEntiteService();
```

#### 3. **Créer le Controller** (`src/controller/maEntite.controller.ts`)
```typescript
import { BaseController } from "./base.controller";
import { MaEntite, CreateMaEntiteData, UpdateMaEntiteData } from "@prisma/client";
import { maEntiteService } from "../service/maEntite.service";

export class MaEntiteController extends BaseController<MaEntite, CreateMaEntiteData, UpdateMaEntiteData> {
  constructor() {
    super(maEntiteService);
  }

  // Le controller hérite automatiquement de tous les CRUD :
  // - create (POST)
  // - getAll (GET)
  // - getById (GET /:id)
  // - update (PUT /:id)
  // - delete (DELETE /:id)
  // - count (GET /count)
  // - findByField (GET /search)
}

export const maEntiteController = new MaEntiteController();
```

#### 4. **Créer les DTOs** (`src/model/dto/maEntite.dto.ts`)
```typescript
import { z } from "zod";

export const CreateMaEntiteSchema = z.object({
  nom: z.string().min(2, "Le nom doit avoir au moins 2 caractères"),
  description: z.string().optional(),
  email: z.string().email("L'email est invalide"),
  age: z.number().min(0, "L'âge doit être positif").optional(),
});

export const UpdateMaEntiteSchema = z.object({
  nom: z.string().min(2, "Le nom doit avoir au moins 2 caractères").optional(),
  description: z.string().optional(),
  email: z.string().email("L'email est invalide").optional(),
  age: z.number().min(0, "L'âge doit être positif").optional(),
  isActive: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Au moins un champ doit être fourni pour la mise à jour",
});

export type CreateMaEntiteDTO = z.infer<typeof CreateMaEntiteSchema>;
export type UpdateMaEntiteDTO = z.infer<typeof UpdateMaEntiteSchema>;
```

#### 5. **Créer les Routes** (`src/routes/maEntite.route.ts`)
```typescript
import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateMaEntiteSchema, UpdateMaEntiteSchema } from "../model/dto/maEntite.dto";
import { maEntiteController } from "../controller/maEntite.controller";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();

// Routes publiques
router.post("/maEntites", validate(CreateMaEntiteSchema), maEntiteController.create);

// Routes protégées (auth optionnelle)
router.get("/maEntites", optionalAuth, maEntiteController.getAll);
router.get("/maEntites/count", optionalAuth, maEntiteController.count);
router.get("/maEntites/search", optionalAuth, maEntiteController.findByField);

// Routes protégées (auth obligatoire)
router.get("/maEntites/:id", authenticateToken, maEntiteController.getById);
router.put("/maEntites/:id", authenticateToken, validate(UpdateMaEntiteSchema), maEntiteController.update);
router.delete("/maEntites/:id", authenticateToken, maEntiteController.delete);

export default router;
```

#### 6. **Enregistrer les Routes** (`src/app_router.ts`)
```typescript
// Ajouter l'import
import maEntiteRoutes from "./routes/maEntite.route";

// Dans la fonction configureRoutes, ajouter :
app.use("/api", maEntiteRoutes);
```

### 🔐 Gestion de l'Authentification

#### **Types de Routes**

```typescript
// Routes publiques - Aucune authentification
router.post("/endpoint", controller.method);

// Routes avec auth optionnelle - Utilisateur peut être connecté ou non
router.get("/endpoint", optionalAuth, controller.method);

// Routes avec auth obligatoire - Utilisateur doit être connecté
router.get("/endpoint", authenticateToken, controller.method);
```

#### **Accéder aux Données Utilisateur**
```typescript
// Dans un controller
export class MonController {
  async maMethode(req: Request, res: Response) {
    const user = req.user; // Données utilisateur du JWT
    // user.id, user.email, user.name
  }
}
```

### 📝 Validation des Données

#### **Créer un Schéma Zod**
```typescript
export const MonSchema = z.object({
  champ: z.string().min(1, "Le champ est requis"),
  email: z.string().email("Email invalide"),
  age: z.number().min(18, "Age minimum 18 ans"),
  date: z.string().datetime("Date invalide"),
  enum: z.enum(["VALEUR1", "VALEUR2"], "Valeur invalide"),
});
```

#### **Utiliser dans les Routes**
```typescript
router.post("/endpoint", validate(MonSchema), controller.method);
```

### 🎯 Gestion des Erreurs

#### **Erreurs Métier dans le Service**
```typescript
protected async validateCreate(data: CreateData): Promise<void> {
  if (condition) {
    throw new Error("Message d'erreur en français");
  }
}
```

#### **Codes de Statut HTTP Automatiques**
- `200` : Succès (GET, PUT)
- `201` : Créé (POST)
- `400` : Erreur de validation
- `401` : Non autorisé
- `404` : Non trouvé
- `409` : Conflit (email dupliqué, etc.)
- `500` : Erreur serveur

### 🔄 Workflow de Développement Complet

1. **Définir l'entité** dans `prisma/schema.prisma`
2. **Appliquer les changements** : `npm run db:push` + `npm run db:generate`
3. **Créer le Repository** avec les champs à exposer
4. **Créer le Service** avec la logique métier
5. **Créer le Controller** (hérite automatiquement des CRUD)
6. **Créer les DTOs** pour la validation
7. **Créer les Routes** avec les middlewares appropriés
8. **Enregistrer les routes** dans `app_router.ts`
9. **Tester** avec les endpoints

## ⚙️ Configuration Centralisée

Toutes les variables d'environnement sont gérées de manière centralisée dans `src/utils/config.ts`. Ce fichier :

- ✅ **Valide** les variables critiques au démarrage
- ✅ **Affiche** la configuration actuelle (sans secrets)
- ✅ **Fournit** des valeurs par défaut
- ✅ **Centralise** toute la configuration du projet

### Variables Obligatoires
- `DATABASE_URL` : URL de connexion à la base de données
- `JWT_SECRET` : Clé secrète pour signer les tokens JWT

### Variables Optionnelles
- `PORT` : Port du serveur (défaut: 3000)
- `NODE_ENV` : Environnement (défaut: development)
- `JWT_EXPIRES_IN` : Durée des tokens en secondes (défaut: 604800 = 7 jours)
- `SUPABASE_URL` et `SUPABASE_ANON_KEY` : Configuration Supabase

## 🛠️ Scripts Disponibles

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
npm run db:seed      # Peupler la base de données
```

## 📊 Format des Réponses

### ✅ Réponse de Succès
```json
{
  "message": "Opération réussie",
  "success": true,
  "data": {
    // Données retournées
  }
}
```

### ❌ Réponse d'Erreur
```json
{
  "message": "Message d'erreur descriptif",
  "success": false
}
```

## 📋 API Disponibles

### 🏥 Health Check

| Méthode | Endpoint | Description | Exemple de Retour |
|---------|----------|-------------|-------------------|
| `GET` | `/health` | Statut de l'API | `{"status":"ok","timestamp":"2025-01-01T00:00:00.000Z","service":"Rotsy Backend API"}` |

### 👤 API Users

#### Routes Publiques

| Méthode | Endpoint | Description | Exemple de Retour |
|---------|----------|-------------|-------------------|
| `POST` | `/api/users` | Créer un utilisateur | ```json<br/>{"message":"Utilisateur créé avec succès","success":true,"data":{"user":{"id":"uuid","email":"user@example.com","name":"User Name","createdAt":"2025-01-01T00:00:00.000Z"},"token":"jwt-token"}}<br/>``` |
| `POST` | `/api/auth/login` | Authentification | ```json<br/>{"message":"Authentification réussie","success":true,"data":{"user":{"id":"uuid","email":"user@example.com","name":"User Name","createdAt":"2025-01-01T00:00:00.000Z"},"token":"jwt-token"}}<br/>``` |

#### Routes Protégées (Auth Optionnelle)

| Méthode | Endpoint | Description | Exemple de Retour |
|---------|----------|-------------|-------------------|
| `GET` | `/api/users` | Liste des utilisateurs | ```json<br/>{"message":"Entités récupérées avec succès","success":true,"data":{"data":[{"id":"uuid","email":"user@example.com","name":"User Name","createdAt":"2025-01-01T00:00:00.000Z"}],"pagination":{"page":1,"limit":10,"total":1,"totalPages":1}}}<br/>``` |
| `GET` | `/api/users/count` | Compter les utilisateurs | ```json<br/>{"message":"Nombre d'entités récupéré","success":true,"data":4}<br/>``` |
| `GET` | `/api/users/search?field=email&value=user@example.com` | Recherche par champ | ```json<br/>{"message":"Entité trouvée","success":true,"data":{"id":"uuid","email":"user@example.com","name":"User Name","createdAt":"2025-01-01T00:00:00.000Z"}}<br/>``` |

#### Routes Protégées (Auth Obligatoire)

| Méthode | Endpoint | Description | Exemple de Retour |
|---------|----------|-------------|-------------------|
| `GET` | `/api/users/:id` | Détails utilisateur | ```json<br/>{"message":"Entité trouvée","success":true,"data":{"id":"uuid","email":"user@example.com","name":"User Name","createdAt":"2025-01-01T00:00:00.000Z"}}<br/>``` |
| `GET` | `/api/users/email/:email` | Utilisateur par email | ```json<br/>{"message":"Utilisateur trouvé","success":true,"data":{"id":"uuid","email":"user@example.com","name":"User Name","createdAt":"2025-01-01T00:00:00.000Z"}}<br/>``` |
| `PUT` | `/api/users/:id` | Mettre à jour utilisateur | ```json<br/>{"message":"Entité mise à jour avec succès","success":true,"data":{"id":"uuid","email":"user@example.com","name":"User Name Updated","createdAt":"2025-01-01T00:00:00.000Z"}}<br/>``` |
| `DELETE` | `/api/users/:id` | Supprimer utilisateur | ```json<br/>{"message":"Entité supprimée avec succès","success":true}<br/>``` |

## 🔐 Authentification

L'API utilise des **tokens JWT**. Incluez le token dans l'en-tête `Authorization: Bearer <token>` pour les routes protégées.

### Format du Token JWT
```json
{
  "id": "user-uuid",
  "email": "user@example.com", 
  "name": "User Name",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 📝 Codes de Statut HTTP

| Code | Signification | Exemple |
|------|---------------|---------|
| 200 | Succès | Récupération, mise à jour |
| 201 | Créé | Création d'utilisateur |
| 400 | Mauvaise requête | Validation échouée |
| 401 | Non autorisé | Token manquant/invalide |
| 404 | Non trouvé | Ressource inexistante |
| 409 | Conflit | Email déjà utilisé |
| 500 | Erreur serveur | Erreur interne |

---

**Développé avec ❤️ par Toavina77**