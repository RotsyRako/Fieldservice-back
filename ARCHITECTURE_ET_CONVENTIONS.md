# Architecture et Conventions du Projet Rotsy Backend

## Table des matières

1. [Structuration en unités de code](#structuration-en-unités-de-code)
2. [Structuration en tables](#structuration-en-tables)
3. [Bonnes pratiques de conception](#bonnes-pratiques-de-conception)
4. [Règles de nommage](#règles-de-nommage)

---

## Structuration en unités de code

### Architecture en couches (Clean Architecture)

Le projet Rotsy Backend suit une **architecture en couches** (également appelée Clean Architecture ou Architecture en onion), qui sépare clairement les responsabilités en différentes couches :

```
src/
├── controller/        # Couche présentation (HTTP)
├── service/           # Couche métier (logique applicative)
├── repository/        # Couche données (accès base de données)
├── model/             # Modèles et DTOs (transfert de données)
├── routes/            # Définition des routes HTTP
├── middleware/        # Middlewares Express (auth, validation, erreurs)
└── utils/             # Utilitaires partagés
```

### Détail des couches

#### 1. Couche Contrôleur (`controller/`)

**Responsabilité** : Gérer les requêtes HTTP et les réponses.

**Pattern appliqué** : 
- **Base Controller Pattern** : Classe abstraite `BaseController` fournissant les opérations CRUD génériques
- **Héritage** : Chaque contrôleur spécifique étend `BaseController` et peut surcharger les méthodes

**Structure** :
```typescript
BaseController<T, CreateInput, UpdateInput>
  ├── UserController
  ├── InterventionController
  ├── MaterielController
  └── ...
```

**Avantages** :
- Réduction de la duplication de code
- Cohérence dans la gestion des erreurs HTTP
- Standardisation des réponses API

#### 2. Couche Service (`service/`)

**Responsabilité** : Implémenter la logique métier et orchestrer les opérations.

**Pattern appliqué** :
- **Service Layer Pattern** : Séparation de la logique métier de la logique de présentation
- **Base Service Pattern** : Classe abstraite `BaseService` avec validation métier

**Structure** :
```typescript
BaseService<T, CreateInput, UpdateInput>
  ├── UserService (logique métier utilisateur)
  ├── InterventionService
  ├── MaterielService
  └── remote/ (services pour APIs externes)
      ├── RecognizeImageGeminiService
      └── EstimateInterventionService
```

**Caractéristiques** :
- Validation métier centralisée (`validateCreate`, `validateUpdate`, `validateDelete`)
- Gestion d'erreurs standardisée
- Transformation des données entre DTOs et entités

#### 3. Couche Repository (`repository/`)

**Responsabilité** : Accès aux données et abstraction de la base de données.

**Pattern appliqué** :
- **Repository Pattern** : Abstraction de l'accès aux données
- **Base Repository Pattern** : Classe abstraite `BaseRepository` avec opérations CRUD génériques

**Structure** :
```typescript
BaseRepository<T, CreateInput, UpdateInput>
  ├── UserRepository
  ├── InterventionRepository
  ├── MaterielRepository
  └── remote/ (repositories pour APIs externes)
      ├── RecognizeImageGeminiRepository
      └── EstimateInterventionRepository
```

**Avantages** :
- Découplage de la logique métier de la base de données
- Facilite les tests unitaires (mocking)
- Réutilisabilité des opérations CRUD

#### 4. Couche Modèle (`model/dto/`)

**Responsabilité** : Définir les structures de données pour le transfert (DTOs) et la validation.

**Pattern appliqué** :
- **DTO Pattern** : Data Transfer Objects pour le transfert de données
- **Schema Validation** : Utilisation de Zod pour la validation

**Structure** :
```
model/dto/
  ├── user.dto.ts
  ├── intervention.dto.ts
  ├── materiel.dto.ts
  └── ...
```

**Caractéristiques** :
- Validation avec Zod schemas
- Types TypeScript générés automatiquement
- Séparation entre données d'entrée et données de sortie

#### 5. Couche Routes (`routes/`)

**Responsabilité** : Définir les endpoints HTTP et associer les middlewares.

**Pattern appliqué** :
- **Router Pattern** : Séparation des routes par domaine fonctionnel
- **Middleware Chain** : Chaînage de middlewares (validation, authentification)

**Structure** :
```
routes/
  ├── user.route.ts
  ├── intervention.route.ts
  ├── materiel.route.ts
  └── ...
```

**Caractéristiques** :
- Documentation Swagger intégrée
- Middlewares de validation (Zod)
- Middlewares d'authentification (JWT)

#### 6. Couche Middleware (`middleware/`)

**Responsabilité** : Traitement transversal des requêtes (auth, validation, erreurs).

**Middlewares disponibles** :
- `auth.ts` : Authentification JWT
- `validate.ts` : Validation des données avec Zod
- `error_handler.ts` : Gestion centralisée des erreurs

### Flux de données

Le flux de données suit cette séquence :

```
Requête HTTP
  ↓
Route (routes/)
  ↓
Middleware (auth, validation)
  ↓
Controller (controller/)
  ↓
Service (service/) [logique métier]
  ↓
Repository (repository/) [accès données]
  ↓
Base de données (Prisma)
```

### Principes de conception appliqués

1. **Séparation des responsabilités (SoC)** : Chaque couche a une responsabilité unique
2. **Inversion de dépendances (DIP)** : Les couches supérieures dépendent d'abstractions
3. **DRY (Don't Repeat Yourself)** : Code générique dans les classes de base
4. **Single Responsibility Principle (SRP)** : Chaque classe a une seule raison de changer
5. **Open/Closed Principle** : Extension via héritage, modification minimale

---

## Structuration en tables

### Modèle de données (Prisma Schema)

Le projet utilise **Prisma** comme ORM (Object-Relational Mapping) avec **PostgreSQL** comme base de données.

### Architecture relationnelle

Le schéma de base de données suit une **architecture relationnelle** avec des relations clairement définies :

#### Modèle principal : `Intervention`

L'entité `Intervention` est au centre du modèle de données et entretient des relations avec plusieurs autres entités :

```
Intervention (entité centrale)
  ├── User (propriétaire)
  ├── Materiel[] (matériels utilisés)
  ├── Timesheet[] (feuilles de temps)
  ├── Image[] (images associées)
  ├── Document[] (documents associés)
  ├── Comment[] (commentaires)
  └── Signature[] (signatures)
```

#### Modèles de données

**1. User (Utilisateur)**
- Identifiant unique : `id` (UUID)
- Email unique : `email`
- Informations : `name`, `password`, `token`
- Timestamps : `createdAt`
- Relations : `interventions[]` (une intervention appartient à un utilisateur)

**2. Intervention (Intervention)**
- Identifiant unique : `id` (UUID)
- Informations métier : `titre`, `description`, `status`, `priority`, `customer`
- Géolocalisation : `long`, `lat`, `distance`
- Dates : `dateStart`, `dateEnd`
- Timestamps : `createdAt`, `updatedAt`
- Relations :
  - `user` (propriétaire)
  - `materiels[]`, `timesheets[]`, `images[]`, `documents[]`, `comments[]`, `signatures[]`

**3. Materiel (Matériel)**
- Identifiant unique : `id` (UUID)
- Informations : `name`, `quantity`
- Relation : `intervention` (cascade delete)

**4. Timesheet (Feuille de temps)**
- Identifiant unique : `id` (UUID)
- Informations : `description`, `timeAllocated`, `date`
- Relation : `intervention` (cascade delete)

**5. Image, Document, Comment, Signature**
- Structure similaire : `id`, `filename`, `data` (base64), `idIntervention`
- Relation : `intervention` (cascade delete)

### Bonnes pratiques de modélisation appliquées

#### 1. Normalisation
- **3NF (Troisième forme normale)** : Élimination de la redondance
- Séparation des entités en tables distinctes
- Relations clairement définies

#### 2. Intégrité référentielle
- **Cascade Delete** : Suppression en cascade des entités dépendantes
  ```prisma
  onDelete: Cascade
  ```
- **Contraintes d'unicité** : Email unique pour User
- **Clés étrangères** : Relations explicites avec `@relation`

#### 3. Identifiants
- **UUID** : Utilisation d'UUID pour tous les identifiants
  ```prisma
  @id @default(uuid())
  ```
- Avantages :
  - Unicité globale
  - Sécurité (non séquentiel)
  - Pas de collision en cas de réplication

#### 4. Timestamps automatiques
- `createdAt` : Date de création automatique
- `updatedAt` : Date de mise à jour automatique
  ```prisma
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ```

#### 5. Types de données appropriés
- `String` pour les textes
- `String @db.Text` pour les textes longs (base64)
- `Int` pour les entiers
- `Float` pour les décimaux
- `DateTime` pour les dates/timestamps
- `Boolean` pour les booléens

#### 6. Relations bien définies
- **One-to-Many** : User → Interventions
- **One-to-Many** : Intervention → Materiels, Timesheets, etc.
- Relations bidirectionnelles avec Prisma

### Migration et versioning

Le projet utilise **Prisma Migrations** pour gérer l'évolution du schéma :

```
prisma/migrations/
  ├── 20250825171618_init/
  ├── 20251025163310_add_timesheet_model/
  └── 20251129011452_remove_ic_from_image/
```

**Avantages** :
- Historique des changements
- Versioning du schéma
- Déploiement contrôlé

---

## Bonnes pratiques de conception

### 1. Clean Architecture

Le projet applique les principes de **Clean Architecture** :

- **Indépendance des frameworks** : Logique métier indépendante d'Express/Prisma
- **Testabilité** : Chaque couche peut être testée indépendamment
- **Indépendance de l'UI** : La logique métier ne dépend pas de la couche HTTP
- **Indépendance de la base de données** : Abstraction via Repository Pattern

### 2. Design Patterns

#### Repository Pattern
- Abstraction de l'accès aux données
- Facilite le changement de source de données
- Permet le mocking pour les tests

#### Service Layer Pattern
- Logique métier centralisée
- Réutilisabilité
- Validation métier

#### Base Class Pattern
- `BaseController`, `BaseService`, `BaseRepository`
- Réduction de la duplication
- Cohérence du code

#### Dependency Injection
- Injection via constructeurs
- Découplage des dépendances
- Facilite les tests

### 3. SOLID Principles

#### Single Responsibility Principle (SRP)
- Chaque classe a une seule responsabilité
- Controller : HTTP
- Service : Logique métier
- Repository : Accès données

#### Open/Closed Principle (OCP)
- Extension via héritage
- Modification minimale des classes de base

#### Liskov Substitution Principle (LSP)
- Les classes dérivées peuvent remplacer les classes de base

#### Interface Segregation Principle (ISP)
- Interfaces spécifiques (DTOs, ServiceResponse)
- Pas d'interfaces "god objects"

#### Dependency Inversion Principle (DIP)
- Dépendances vers des abstractions
- Injection de dépendances

### 4. Gestion des erreurs

#### Centralisation
- `error_handler.ts` : Middleware global de gestion d'erreurs
- `handleError` dans `BaseService` : Gestion standardisée

#### Codes d'erreur standardisés
```typescript
"ENTITY_NOT_FOUND"
"UNIQUE_CONSTRAINT_VIOLATION"
"VALIDATION_ERROR"
"DATABASE_CONNECTION_ERROR"
```

#### Mapping HTTP
- 400 : Erreur de validation
- 401 : Non authentifié
- 403 : Non autorisé
- 404 : Non trouvé
- 409 : Conflit (unicité)
- 500 : Erreur serveur
- 503 : Service indisponible

### 5. Validation des données

#### Validation avec Zod
- Validation au niveau des routes
- Types TypeScript générés automatiquement
- Messages d'erreur personnalisés

#### Validation métier
- Validation dans la couche Service
- Règles métier centralisées

### 6. Sécurité

#### Authentification JWT
- Tokens JWT pour l'authentification
- Middleware `authenticateToken`
- Middleware `optionalAuth` pour les routes publiques

#### Protection des données sensibles
- Exclusion du mot de passe dans les réponses
- `getSelectFields()` dans les repositories

#### Validation des entrées
- Validation stricte avec Zod
- Protection contre l'injection SQL (Prisma)

### 7. Documentation

#### Swagger/OpenAPI
- Documentation automatique des endpoints
- Spécification OpenAPI
- Interface interactive

#### Commentaires JSDoc
- Documentation des méthodes publiques
- Types et paramètres documentés

### 8. Configuration

#### Variables d'environnement
- Configuration centralisée dans `config.ts`
- Validation de la configuration au démarrage
- Séparation des environnements (dev/prod)

### 9. Réponses standardisées

#### Format de réponse uniforme
```typescript
{
  success: boolean,
  message: string,
  data?: T,
  error?: string
}
```

#### Utilitaires de réponse
- `ok()` : Réponse de succès
- `fail()` : Réponse d'erreur

---

## Règles de nommage

### Fichiers et dossiers

#### Structure des dossiers
- **camelCase** pour les dossiers : `controller/`, `service/`, `repository/`
- **Pluriel** pour les dossiers de collections : `controllers/` (mais le projet utilise le singulier)
- **Singulier** pour les fichiers : `user.controller.ts`, `user.service.ts`

#### Convention de nommage des fichiers
```
{entité}.{couche}.ts

Exemples :
- user.controller.ts
- user.service.ts
- user.repository.ts
- user.route.ts
- user.dto.ts
```

**Pattern** : `{nomEntité}.{type}.ts`

### Classes et interfaces

#### Classes
- **PascalCase** : `UserController`, `UserService`, `UserRepository`
- **Suffixe descriptif** : `Controller`, `Service`, `Repository`, `DTO`

**Exemples** :
```typescript
class UserController extends BaseController
class UserService extends BaseService
class UserRepository extends BaseRepository
```

#### Interfaces
- **PascalCase** : `BaseEntity`, `ServiceResponse`, `CreateUserData`
- **Préfixe descriptif** : `Create`, `Update`, `DTO`

**Exemples** :
```typescript
interface CreateUserData
interface UpdateUserData
interface ServiceResponse<T>
```

### Variables et fonctions

#### Variables
- **camelCase** : `userRepository`, `userService`, `userController`
- **Noms descriptifs** : Éviter les abréviations

**Exemples** :
```typescript
const userRepository = new UserRepository();
const authHeader = req.headers.authorization;
```

#### Fonctions
- **camelCase** : `createUser`, `getById`, `findByEmail`
- **Verbes d'action** : `create`, `get`, `find`, `update`, `delete`

**Exemples** :
```typescript
async createUser(data: CreateUserData)
async getById(id: string)
async findByEmail(email: string)
```

#### Méthodes HTTP
- **camelCase** : `create`, `getById`, `getAll`, `update`, `delete`
- **Correspondance REST** : POST → `create`, GET → `getById`/`getAll`, PUT → `update`, DELETE → `delete`

### Base de données

#### Tables (Prisma Models)
- **PascalCase** : `User`, `Intervention`, `Materiel`, `Timesheet`
- **Singulier** : Nom de table au singulier (convention Prisma)

**Exemples** :
```prisma
model User
model Intervention
model Materiel
model Timesheet
```

#### Colonnes
- **camelCase** : `id`, `email`, `createdAt`, `updatedAt`, `idIntervention`
- **Préfixes pour clés étrangères** : `idIntervention`, `userId`

**Conventions spécifiques** :
- `id` : Identifiant unique (UUID)
- `createdAt` : Date de création
- `updatedAt` : Date de mise à jour
- `id{Entité}` : Clé étrangère (ex: `idIntervention`, `userId`)

#### Relations Prisma
- **camelCase** : `user`, `intervention`, `materiels`, `timesheets`
- **Pluriel pour collections** : `interventions[]`, `materiels[]`
- **Singulier pour relations 1-1 ou Many-1** : `user`, `intervention`

### Routes et endpoints

#### Routes
- **camelCase** pour les variables : `/users/:id`
- **kebab-case** pour les chemins multi-mots : `/api/users` (mais le projet utilise camelCase)

**Pattern** :
```
/api/{ressource}
/api/{ressource}/:id
/api/{ressource}/{action}
```

**Exemples** :
```
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/search
POST   /api/auth/login
```

### Constantes

#### Constantes
- **UPPER_SNAKE_CASE** : `JWT_SECRET`, `DATABASE_URL`

**Exemples** :
```typescript
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;
```

### Types et génériques

#### Types TypeScript
- **PascalCase** : `CreateUserDTO`, `UpdateUserDTO`, `ServiceResponse<T>`
- **Suffixe descriptif** : `DTO`, `Schema`, `Response`

**Exemples** :
```typescript
type CreateUserDTO = z.infer<typeof CreateUserSchema>;
type ServiceResponse<T> = { success: boolean; data?: T; message: string; };
```

#### Génériques
- **PascalCase, une lettre** : `T`, `CreateInput`, `UpdateInput`

**Exemples** :
```typescript
class BaseService<T extends BaseEntity, CreateInput, UpdateInput>
class BaseRepository<T extends BaseEntity, CreateInput, UpdateInput>
```

### Middlewares

#### Middlewares
- **camelCase** : `authenticateToken`, `optionalAuth`, `validate`
- **Verbes d'action** : `authenticate`, `validate`

**Exemples** :
```typescript
export const authenticateToken = async (req, res, next) => {}
export const optionalAuth = async (req, res, next) => {}
export const validate = (schema: z.ZodSchema) => {}
```

### Utilitaires

#### Utilitaires
- **camelCase** : `ok`, `fail`, `getSelectFields`
- **Noms courts et descriptifs**

**Exemples** :
```typescript
export const ok = (message: string, data?: any) => {}
export const fail = (message: string) => {}
```

### Résumé des conventions

| Élément | Convention | Exemple |
|---------|-----------|---------|
| **Fichiers** | `{entité}.{type}.ts` | `user.controller.ts` |
| **Dossiers** | camelCase | `controller/`, `service/` |
| **Classes** | PascalCase | `UserController` |
| **Interfaces** | PascalCase | `CreateUserData` |
| **Variables** | camelCase | `userRepository` |
| **Fonctions** | camelCase | `createUser` |
| **Constantes** | UPPER_SNAKE_CASE | `JWT_SECRET` |
| **Types** | PascalCase | `CreateUserDTO` |
| **Tables (Prisma)** | PascalCase, singulier | `User`, `Intervention` |
| **Colonnes** | camelCase | `createdAt`, `idIntervention` |
| **Routes** | `/api/{ressource}` | `/api/users` |

### Bonnes pratiques de nommage

1. **Descriptivité** : Les noms doivent être clairs et explicites
2. **Cohérence** : Respecter les conventions dans tout le projet
3. **Éviter les abréviations** : Préférer `userRepository` à `userRepo`
4. **Verbes d'action** : Utiliser des verbes pour les fonctions (`create`, `get`, `find`)
5. **Noms de domaine** : Utiliser le vocabulaire métier (`Intervention`, `Materiel`, `Timesheet`)

---

## Conclusion

Le projet Rotsy Backend applique une architecture moderne et bien structurée qui respecte les principes de Clean Architecture et les bonnes pratiques de développement. La séparation en couches, l'utilisation de patterns de conception éprouvés, et des conventions de nommage cohérentes contribuent à la maintenabilité, la testabilité et l'évolutivité du code.

La structuration en tables suit les principes de normalisation et d'intégrité référentielle, garantissant la cohérence et la fiabilité des données.

Ces choix architecturaux facilitent :
- La compréhension du code par les nouveaux développeurs
- La maintenance et l'évolution du système
- Les tests unitaires et d'intégration
- La collaboration en équipe
- La scalabilité de l'application

