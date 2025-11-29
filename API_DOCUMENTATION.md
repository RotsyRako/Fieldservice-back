# 📚 Documentation API Rotsy Backend

## 🎯 Vue d'ensemble

L'API Rotsy Backend est une API REST complète développée avec Node.js, TypeScript, Express, et Prisma. Elle gère les utilisateurs, interventions, matériels, timesheets, images, documents, commentaires et signatures avec authentification JWT.

## 🏗️ Architecture

### Stack technique
- **Backend**: Node.js + TypeScript + Express
- **Base de données**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentification**: JWT
- **Validation**: Zod
- **IA**: Google Gemini (reconnaissance d'image et estimation)

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

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| `id` | UUID | Identifiant unique | Clé primaire, généré automatiquement |
| `name` | String | Nom de l'utilisateur | Requis |
| `email` | String | Email de l'utilisateur | Requis, unique |
| `password` | String | Mot de passe hashé | Requis, minimum 6 caractères |
| `token` | String? | Token JWT (optionnel) | Optionnel |
| `createdAt` | DateTime | Date de création | Généré automatiquement |

**Relations** :
- `interventions` : 1-N avec Intervention

### Intervention

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| `id` | UUID | Identifiant unique | Clé primaire, généré automatiquement |
| `titre` | String | Titre de l'intervention | Requis |
| `dateStart` | String | Date de début | Requis |
| `dateEnd` | String | Date de fin | Requis |
| `status` | Int | Statut de l'intervention | Requis, entier positif |
| `priority` | String | Priorité | Requis |
| `customer` | String | Nom du client | Requis |
| `long` | Float | Longitude | Requis, entre -180 et 180 |
| `lat` | Float | Latitude | Requis, entre -90 et 90 |
| `distance` | Float | Distance en km | Requis, positif |
| `description` | String | Description | Requis |
| `userId` | UUID | ID de l'utilisateur | Requis, clé étrangère |
| `createdAt` | DateTime | Date de création | Généré automatiquement |
| `updatedAt` | DateTime | Date de mise à jour | Mis à jour automatiquement |

**Relations** :
- `user` : N-1 avec User
- `materiels` : 1-N avec Materiel
- `timesheets` : 1-N avec Timesheet
- `images` : 1-N avec Image
- `documents` : 1-N avec Document
- `comments` : 1-N avec Comment
- `signatures` : 1-N avec Signature

### Materiel

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| `id` | UUID | Identifiant unique | Clé primaire, généré automatiquement |
| `name` | String | Nom du matériel | Requis |
| `quantity` | Int | Quantité | Requis, entier positif |
| `idIntervention` | UUID | ID de l'intervention | Requis, clé étrangère |
| `createdAt` | DateTime | Date de création | Généré automatiquement |
| `updatedAt` | DateTime | Date de mise à jour | Mis à jour automatiquement |

**Relations** :
- `intervention` : N-1 avec Intervention

### Timesheet

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| `id` | UUID | Identifiant unique | Clé primaire, généré automatiquement |
| `description` | String | Description de la tâche | Requis |
| `timeAllocated` | Float | Temps alloué en heures | Requis, nombre positif |
| `date` | String | Date au format dd/mm/YYYY | Requis, format dd/mm/YYYY |
| `idIntervention` | UUID | ID de l'intervention | Requis, clé étrangère |
| `createdAt` | DateTime | Date de création | Généré automatiquement |
| `updatedAt` | DateTime | Date de mise à jour | Mis à jour automatiquement |

**Relations** :
- `intervention` : N-1 avec Intervention

### Image

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| `id` | UUID | Identifiant unique | Clé primaire, généré automatiquement |
| `filename` | String | Nom du fichier | Requis |
| `data` | String (Text) | Données de l'image en base64 | Requis |
| `idIntervention` | UUID | ID de l'intervention | Requis, clé étrangère |
| `createdAt` | DateTime | Date de création | Généré automatiquement |
| `updatedAt` | DateTime | Date de mise à jour | Mis à jour automatiquement |

**Relations** :
- `intervention` : N-1 avec Intervention

### Document

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| `id` | UUID | Identifiant unique | Clé primaire, généré automatiquement |
| `filename` | String | Nom du fichier | Requis |
| `data` | String (Text) | Données du document en base64 | Requis |
| `idIntervention` | UUID | ID de l'intervention | Requis, clé étrangère |
| `createdAt` | DateTime | Date de création | Généré automatiquement |
| `updatedAt` | DateTime | Date de mise à jour | Mis à jour automatiquement |

**Relations** :
- `intervention` : N-1 avec Intervention

### Comment

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| `id` | UUID | Identifiant unique | Clé primaire, généré automatiquement |
| `message` | String (Text) | Message du commentaire | Requis |
| `date` | String | Date au format dd/mm/YYYY | Requis, format dd/mm/YYYY |
| `attachmentFilename` | String? | Nom du fichier joint | Optionnel |
| `attachmentData` | String? (Text) | Données du fichier joint en base64 | Optionnel |
| `idIntervention` | UUID | ID de l'intervention | Requis, clé étrangère |
| `createdAt` | DateTime | Date de création | Généré automatiquement |
| `updatedAt` | DateTime | Date de mise à jour | Mis à jour automatiquement |

**Relations** :
- `intervention` : N-1 avec Intervention

### Signature

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| `id` | UUID | Identifiant unique | Clé primaire, généré automatiquement |
| `filename` | String | Nom du fichier | Requis |
| `data` | String (Text) | Données de la signature en base64 | Requis |
| `idIntervention` | UUID | ID de l'intervention | Requis, clé étrangère |
| `createdAt` | DateTime | Date de création | Généré automatiquement |
| `updatedAt` | DateTime | Date de mise à jour | Mis à jour automatiquement |

**Relations** :
- `intervention` : N-1 avec Intervention

## 🔗 Relations entre Modèles

```
User (1) ──→ (N) Intervention
                │
                ├──→ (N) Materiel
                ├──→ (N) Timesheet
                ├──→ (N) Image
                ├──→ (N) Document
                ├──→ (N) Comment
                └──→ (N) Signature
```

## 🚀 Endpoints disponibles

### Health Check

#### `GET /health`

Vérification de l'état du serveur.

**Réponse Succès (200)** :
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "service": "Rotsy Backend API"
}
```

---

### Authentication

#### `POST /api/users`

Création d'un nouvel utilisateur.

**Body** :
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Validation** :
- `name` : String, minimum 1 caractère
- `email` : String, format email valide
- `password` : String, minimum 6 caractères

**Réponse Succès (201)** :
```json
{
  "message": "Utilisateur créé avec succès",
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Réponse Erreur (400)** :
```json
{
  "message": "L'email est invalide",
  "success": false
}
```

**Réponse Erreur (409)** :
```json
{
  "message": "Cet email est déjà utilisé",
  "success": false
}
```

#### `POST /api/auth/login`

Authentification d'un utilisateur.

**Body** :
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Validation** :
- `email` : String, format email valide
- `password` : String, minimum 1 caractère

**Réponse Succès (200)** :
```json
{
  "message": "Authentification réussie",
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Réponse Erreur (401)** :
```json
{
  "message": "Email ou mot de passe incorrect",
  "success": false
}
```

---

### Users (Authentification requise)

#### `GET /api/users`

Liste tous les utilisateurs (avec pagination).

**Headers** :
```
Authorization: Bearer <token>
```

**Query Parameters** (optionnels) :
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)

**Réponse Succès (200)** :
```json
{
  "message": "Entités récupérées avec succès",
  "success": true,
  "data": {
    "data": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "email": "john.doe@example.com",
        "name": "John Doe",
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### `GET /api/users/:id`

Récupère un utilisateur par ID.

**Réponse Succès (200)** :
```json
{
  "message": "Entité trouvée",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Réponse Erreur (404)** :
```json
{
  "message": "Entité non trouvée",
  "success": false
}
```

#### `GET /api/users/email/:email`

Récupère un utilisateur par email.

**Réponse Succès (200)** :
```json
{
  "message": "Utilisateur trouvé",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### `PUT /api/users/:id`

Met à jour un utilisateur.

**Body** :
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123"
}
```

**Validation** : Tous les champs sont optionnels, mais au moins un doit être fourni.

**Réponse Succès (200)** :
```json
{
  "message": "Entité mise à jour avec succès",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.updated@example.com",
    "name": "John Updated",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### `DELETE /api/users/:id`

Supprime un utilisateur.

**Réponse Succès (200)** :
```json
{
  "message": "Entité supprimée avec succès",
  "success": true
}
```

#### `GET /api/users/count`

Compte le nombre d'utilisateurs.

**Réponse Succès (200)** :
```json
{
  "message": "Nombre d'entités récupéré",
  "success": true,
  "data": 42
}
```

#### `GET /api/users/search?field=email&value=john@example.com`

Recherche des utilisateurs par champ.

**Query Parameters** :
- `field` : Nom du champ à rechercher (requis)
- `value` : Valeur à rechercher (requis)

**Réponse Succès (200)** :
```json
{
  "message": "Entité trouvée",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Interventions (Authentification requise)

#### `POST /api/interventions`

Crée une intervention.

**Body** :
```json
{
  "titre": "Réparation plomberie",
  "dateStart": "2025-01-15",
  "dateEnd": "2025-01-15",
  "status": 1,
  "priority": "haute",
  "customer": "Client ABC",
  "long": 2.3522,
  "lat": 48.8566,
  "distance": 15.5,
  "description": "Réparation d'une fuite d'eau dans la salle de bain"
}
```

**Validation** :
- `titre` : String, minimum 1 caractère
- `dateStart` : String, minimum 1 caractère
- `dateEnd` : String, minimum 1 caractère
- `status` : Number, entier positif
- `priority` : String, minimum 1 caractère
- `customer` : String, minimum 1 caractère
- `long` : Number, entre -180 et 180
- `lat` : Number, entre -90 et 90
- `distance` : Number, positif
- `description` : String, minimum 1 caractère

**Réponse Succès (201)** :
```json
{
  "message": "Entité créée avec succès",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "titre": "Réparation plomberie",
    "dateStart": "2025-01-15",
    "dateEnd": "2025-01-15",
    "status": 1,
    "priority": "haute",
    "customer": "Client ABC",
    "long": 2.3522,
    "lat": 48.8566,
    "distance": 15.5,
    "description": "Réparation d'une fuite d'eau dans la salle de bain",
    "userId": "user-uuid",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/interventions`

Liste toutes les interventions (avec pagination).

**Query Parameters** (optionnels) :
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)

**Réponse Succès (200)** :
```json
{
  "message": "Entités récupérées avec succès",
  "success": true,
  "data": {
    "data": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "titre": "Réparation plomberie",
        "dateStart": "2025-01-15",
        "dateEnd": "2025-01-15",
        "status": 1,
        "priority": "haute",
        "customer": "Client ABC",
        "long": 2.3522,
        "lat": 48.8566,
        "distance": 15.5,
        "description": "Réparation d'une fuite d'eau",
        "userId": "user-uuid",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### `GET /api/interventions/:id`

Récupère une intervention par ID.

**Réponse Succès (200)** :
```json
{
  "message": "Entité trouvée",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "titre": "Réparation plomberie",
    "dateStart": "2025-01-15",
    "dateEnd": "2025-01-15",
    "status": 1,
    "priority": "haute",
    "customer": "Client ABC",
    "long": 2.3522,
    "lat": 48.8566,
    "distance": 15.5,
    "description": "Réparation d'une fuite d'eau",
    "userId": "user-uuid",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### `PUT /api/interventions/:id`

Met à jour une intervention.

**Body** : Tous les champs sont optionnels, mais au moins un doit être fourni.

```json
{
  "titre": "Réparation plomberie mise à jour",
  "status": 2
}
```

**Réponse Succès (200)** :
```json
{
  "message": "Entité mise à jour avec succès",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "titre": "Réparation plomberie mise à jour",
    "status": 2,
    ...
  }
}
```

#### `DELETE /api/interventions/:id`

Supprime une intervention.

**Réponse Succès (200)** :
```json
{
  "message": "Entité supprimée avec succès",
  "success": true
}
```

#### `GET /api/interventions/users/:userId`

Récupère toutes les interventions d'un utilisateur.

**Réponse Succès (200)** :
```json
{
  "message": "Interventions récupérées avec succès",
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "titre": "Réparation plomberie",
      ...
    }
  ]
}
```

---

### Materiels (Authentification requise)

#### `POST /api/materiels`

Crée un matériel.

**Body** :
```json
{
  "name": "Tournevis",
  "quantity": 2,
  "idIntervention": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Validation** :
- `name` : String, minimum 1 caractère
- `quantity` : Number, entier positif
- `idIntervention` : String, UUID valide

**Réponse Succès (201)** :
```json
{
  "message": "Entité créée avec succès",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Tournevis",
    "quantity": 2,
    "idIntervention": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/materiels`

Liste tous les matériels (avec pagination).

**Réponse Succès (200)** :
```json
{
  "message": "Entités récupérées avec succès",
  "success": true,
  "data": {
    "data": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "name": "Tournevis",
        "quantity": 2,
        "idIntervention": "123e4567-e89b-12d3-a456-426614174000",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### `GET /api/materiels/:id`

Récupère un matériel par ID.

**Réponse Succès (200)** :
```json
{
  "message": "Entité trouvée",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Tournevis",
    "quantity": 2,
    "idIntervention": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/materiels/interventions/:idIntervention`

Récupère tous les matériels d'une intervention.

**Réponse Succès (200)** :
```json
{
  "message": "Matériels récupérés avec succès",
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Tournevis",
      "quantity": 2,
      "idIntervention": "123e4567-e89b-12d3-a456-426614174000",
      ...
    }
  ]
}
```

#### `PUT /api/materiels/:id`

Met à jour un matériel.

**Body** : Tous les champs sont optionnels, mais au moins un doit être fourni.

```json
{
  "quantity": 3
}
```

**Réponse Succès (200)** :
```json
{
  "message": "Entité mise à jour avec succès",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Tournevis",
    "quantity": 3,
    ...
  }
}
```

#### `DELETE /api/materiels/:id`

Supprime un matériel.

**Réponse Succès (200)** :
```json
{
  "message": "Entité supprimée avec succès",
  "success": true
}
```

---

### Timesheets (Authentification requise)

#### `POST /api/timesheets`

Crée un timesheet.

**Body** :
```json
{
  "description": "Réparation de la fuite",
  "timeAllocated": 2.5,
  "date": "15/01/2025",
  "idIntervention": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Validation** :
- `description` : String, minimum 1 caractère
- `timeAllocated` : Number, positif
- `date` : String, format dd/mm/YYYY
- `idIntervention` : String, UUID valide

**Réponse Succès (201)** :
```json
{
  "message": "Entité créée avec succès",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "description": "Réparation de la fuite",
    "timeAllocated": 2.5,
    "date": "15/01/2025",
    "idIntervention": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/timesheets`

Liste tous les timesheets (avec pagination).

**Réponse Succès (200)** :
```json
{
  "message": "Entités récupérées avec succès",
  "success": true,
  "data": {
    "data": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "description": "Réparation de la fuite",
        "timeAllocated": 2.5,
        "date": "15/01/2025",
        "idIntervention": "123e4567-e89b-12d3-a456-426614174000",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### `GET /api/timesheets/:id`

Récupère un timesheet par ID.

**Réponse Succès (200)** :
```json
{
  "message": "Entité trouvée",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "description": "Réparation de la fuite",
    "timeAllocated": 2.5,
    "date": "15/01/2025",
    "idIntervention": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/timesheets/interventions/:idIntervention`

Récupère tous les timesheets d'une intervention.

**Réponse Succès (200)** :
```json
{
  "message": "Timesheets récupérés avec succès",
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "description": "Réparation de la fuite",
      "timeAllocated": 2.5,
      "date": "15/01/2025",
      "idIntervention": "123e4567-e89b-12d3-a456-426614174000",
      ...
    }
  ]
}
```

#### `PUT /api/timesheets/:id`

Met à jour un timesheet.

**Body** : Tous les champs sont optionnels, mais au moins un doit être fourni.

```json
{
  "timeAllocated": 3.0
}
```

**Réponse Succès (200)** :
```json
{
  "message": "Entité mise à jour avec succès",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "description": "Réparation de la fuite",
    "timeAllocated": 3.0,
    ...
  }
}
```

#### `DELETE /api/timesheets/:id`

Supprime un timesheet.

**Réponse Succès (200)** :
```json
{
  "message": "Entité supprimée avec succès",
  "success": true
}
```

---

### Images (Authentification requise)

#### `POST /api/images`

Crée une image.

**Body** :
```json
{
  "filename": "photo.jpg",
  "data": "base64-encoded-image-data",
  "idIntervention": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Validation** :
- `filename` : String, minimum 1 caractère
- `data` : String, minimum 1 caractère (base64)
- `idIntervention` : String, UUID valide

**Réponse Succès (201)** :
```json
{
  "message": "Entité créée avec succès",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "filename": "photo.jpg",
    "data": "base64-encoded-image-data",
    "idIntervention": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Documents (Authentification requise)

#### `POST /api/documents`

Crée un document.

**Body** :
```json
{
  "filename": "document.pdf",
  "data": "base64-encoded-document-data",
  "idIntervention": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Validation** :
- `filename` : String, minimum 1 caractère
- `data` : String, minimum 1 caractère (base64)
- `idIntervention` : String, UUID valide

**Réponse Succès (201)** :
```json
{
  "message": "Entité créée avec succès",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174004",
    "filename": "document.pdf",
    "data": "base64-encoded-document-data",
    "idIntervention": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Comments (Authentification requise)

#### `POST /api/comments`

Crée un commentaire.

**Body** :
```json
{
  "message": "Intervention en cours",
  "date": "15/01/2025",
  "attachmentFilename": "attachment.pdf",
  "attachmentData": "base64-encoded-data",
  "idIntervention": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Validation** :
- `message` : String, minimum 1 caractère
- `date` : String, format dd/mm/YYYY
- `attachmentFilename` : String (optionnel)
- `attachmentData` : String (optionnel, base64)
- `idIntervention` : String, UUID valide

**Réponse Succès (201)** :
```json
{
  "message": "Entité créée avec succès",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174005",
    "message": "Intervention en cours",
    "date": "15/01/2025",
    "attachmentFilename": "attachment.pdf",
    "attachmentData": "base64-encoded-data",
    "idIntervention": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Signatures (Authentification requise)

#### `POST /api/signatures`

Crée une signature.

**Body** :
```json
{
  "filename": "signature.png",
  "data": "base64-encoded-signature-data",
  "idIntervention": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Validation** :
- `filename` : String, minimum 1 caractère
- `data` : String, minimum 1 caractère (base64)
- `idIntervention` : String, UUID valide

**Réponse Succès (201)** :
```json
{
  "message": "Entité créée avec succès",
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174006",
    "filename": "signature.png",
    "data": "base64-encoded-signature-data",
    "idIntervention": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### IA - Reconnaissance d'Image (Authentification requise)

#### `POST /api/recognize-image-gemini`

Reconnaissance d'image avec base64.

**Body** :
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Réponse Succès (200)** :
```json
{
  "message": "Reconnaissance d'image effectuée avec succès (Gemini Pro Vision)",
  "success": true,
  "data": {
    "text": "Texte extrait de l'image",
    "labels": [
      {
        "description": "screwdriver",
        "score": 0.95,
        "descriptionFr": "Tournevis"
      }
    ],
    "detectedObject": "screwdriver",
    "detectedObjectFr": "Tournevis"
  }
}
```

#### `POST /api/recognize-image-gemini-upload`

Reconnaissance d'image avec upload de fichier.

**Form Data** :
- `image` ou `file` : Fichier image (JPEG, PNG, GIF, WebP, max 20MB)

**Réponse Succès (200)** :
```json
{
  "message": "Reconnaissance d'image effectuée avec succès (Gemini Pro Vision)",
  "success": true,
  "data": {
    "text": "Texte extrait de l'image",
    "labels": [
      {
        "description": "screwdriver",
        "score": 0.95,
        "descriptionFr": "Tournevis"
      }
    ],
    "detectedObject": "screwdriver",
    "detectedObjectFr": "Tournevis"
  }
}
```

---

### IA - Estimation d'Intervention (Authentification requise)

#### `POST /api/interventions/:id/estimate`

Estime le temps nécessaire pour une intervention.

**Réponse Succès (200)** :
```json
{
  "message": "Estimation générée avec succès",
  "success": true,
  "data": {
    "estimatedTime": "04:30:00",
    "reasoning": "Basé sur l'analyse de l'intervention, cette tâche nécessite environ 4.5 heures de travail...",
    "confidence": 0.85
  }
}
```

**Réponse Erreur (404)** :
```json
{
  "message": "Intervention avec l'ID 123e4567-e89b-12d3-a456-426614174000 non trouvée",
  "success": false
}
```

---

## 🔐 Authentification

L'API utilise l'authentification JWT. Pour accéder aux endpoints protégés :

1. Créer un utilisateur avec `POST /api/users`
2. Se connecter avec `POST /api/auth/login`
3. Utiliser le token JWT dans l'en-tête : `Authorization: Bearer <token>`

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

## 📝 Validation des données

Tous les endpoints utilisent la validation Zod avec des messages d'erreur en français :

- **Email** : Format email valide
- **UUID** : Format UUID valide
- **Date** : Format dd/mm/YYYY pour les timesheets et commentaires
- **Temps** : Nombre positif pour timeAllocated
- **Quantité** : Entier positif pour les matériels
- **Coordonnées** : Longitude entre -180 et 180, latitude entre -90 et 90

## 📝 Codes de Statut HTTP

| Code | Signification | Exemple |
|------|-------------|---------|
| 200 | Succès | Récupération, mise à jour |
| 201 | Créé | Création d'entité |
| 400 | Mauvaise requête | Validation échouée |
| 401 | Non autorisé | Token manquant/invalide |
| 404 | Non trouvé | Ressource inexistante |
| 409 | Conflit | Email déjà utilisé |
| 413 | Payload trop large | Image trop grande |
| 429 | Trop de requêtes | Quota API dépassé |
| 500 | Erreur serveur | Erreur interne |
| 502 | Bad Gateway | Erreur API externe |
| 503 | Service indisponible | API externe indisponible |

## 🚀 Démarrage rapide

### 1. Installation
```bash
npm install
```

### 2. Configuration de la base de données
```bash
npm run db:push
npm run db:generate
```

### 3. Démarrage du serveur
```bash
npm run dev
```

### 4. Accéder à la documentation Swagger
http://localhost:3000/api-docs

---

**API Rotsy Backend** - Développé avec ❤️ en TypeScript
