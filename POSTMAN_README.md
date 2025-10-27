# Collection Postman - API Rotsy Backend

## 📋 Description

Cette collection Postman contient tous les endpoints disponibles de l'API Rotsy Backend, organisés par modules fonctionnels.

## 🚀 Installation

### 1. Importer la collection
1. Ouvrez Postman
2. Cliquez sur "Import" 
3. Sélectionnez le fichier `Rotsy_API_Collection.postman_collection.json`

### 2. Importer l'environnement
1. Dans Postman, allez dans "Environments"
2. Cliquez sur "Import"
3. Sélectionnez le fichier `Rotsy_Environment.postman_environment.json`
4. Sélectionnez l'environnement "Rotsy Development Environment"

## 🔧 Configuration

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `base_url` | URL de base de l'API | `http://localhost:3000` |
| `auth_token` | Token JWT d'authentification | (vide - à remplir après login) |
| `user_id` | ID de l'utilisateur connecté | (vide - à remplir après création) |
| `user_email` | Email de l'utilisateur de test | `test@example.com` |
| `user_password` | Mot de passe de l'utilisateur | `password123` |
| `intervention_id` | ID d'une intervention | (vide - à remplir après création) |
| `materiel_id` | ID d'un matériel | (vide - à remplir après création) |
| `timesheet_id` | ID d'un timesheet | (vide - à remplir après création) |

## 📚 Structure de la collection

### 1. **Health Check**
- `GET /health` - Vérification de l'état du serveur

### 2. **Authentication**
- `POST /api/users` - Création d'un utilisateur
- `POST /api/auth/login` - Authentification et récupération du token

### 3. **Users** (Authentification requise)
- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/:id` - Récupère un utilisateur par ID
- `GET /api/users/email/:email` - Récupère un utilisateur par email
- `PUT /api/users/:id` - Met à jour un utilisateur
- DELETE /api/users/:id` - Supprime un utilisateur
- `GET /api/users/count` - Compte les utilisateurs
- `GET /api/users/search` - Recherche des utilisateurs

### 4. **Interventions** (Authentification requise)
- `POST /api/interventions` - Crée une intervention
- `GET /api/interventions` - Liste toutes les interventions
- `GET /api/interventions/:id` - Récupère une intervention par ID
- `PUT /api/interventions/:id` - Met à jour une intervention
- `DELETE /api/interventions/:id` - Supprime une intervention
- `GET /api/interventions/count` - Compte les interventions
- `GET /api/interventions/search` - Recherche des interventions

### 5. **Materiels** (Authentification requise)
- `POST /api/materiels` - Crée un matériel
- `GET /api/materiels` - Liste tous les matériels
- `GET /api/materiels/:id` - Récupère un matériel par ID
- `PUT /api/materiels/:id` - Met à jour un matériel
- `DELETE /api/materiels/:id` - Supprime un matériel
- `GET /api/materiels/count` - Compte les matériels
- `GET /api/materiels/search` - Recherche des matériels

### 6. **Timesheets** (Authentification requise)
- `POST /api/timesheets` - Crée un timesheet
- `GET /api/timesheets` - Liste tous les timesheets
- `GET /api/timesheets/:id` - Récupère un timesheet par ID
- `PUT /api/timesheets/:id` - Met à jour un timesheet
- `DELETE /api/timesheets/:id` - Supprime un timesheet
- `GET /api/timesheets/count` - Compte les timesheets
- `GET /api/timesheets/search` - Recherche des timesheets

## 🔄 Workflow de test recommandé

### 1. **Initialisation**
1. Démarrer le serveur backend : `npm start`
2. Tester la santé du serveur : `GET /health` ✅

### 2. **Authentification**
1. Créer un utilisateur : `POST /api/users` 
2. Se connecter : `POST /api/auth/login`
3. Copier le token dans la variable `auth_token`

### 3. **Test des fonctionnalités**
1. Créer une intervention : `POST /api/interventions`
2. Créer un matériel lié à l'intervention : `POST /api/materiels`
3. Créer un timesheet lié à l'intervention : `POST /api/timesheets`
4. Tester les opérations CRUD sur chaque entité

## 📝 Exemples de requêtes

### Création d'un utilisateur
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Création d'une intervention
```json
{
  "titre": "Réparation système",
  "dateStart": "25/10/2025",
  "dateEnd": "26/10/2025",
  "status": 1,
  "priority": "high",
  "customer": "Client ABC",
  "long": 45.123,
  "lat": 2.456,
  "distance": 10.5,
  "description": "Réparation du système de ventilation",
  "userId": "{{user_id}}"
}
```

### Création d'un matériel
```json
{
  "name": "Vis M6x20",
  "quantity": 50,
  "idIntervention": "{{intervention_id}}"
}
```

### Création d'un timesheet
```json
{
  "description": "Travail sur la réparation du système",
  "timeAllocated": 2.5,
  "date": "25/10/2025",
  "idIntervention": "{{intervention_id}}"
}
```

## 🔐 Authentification

Tous les endpoints (sauf `/health`, `/api/users`, et `/api/auth/login`) nécessitent un token JWT dans l'en-tête :

```
Authorization: Bearer {{auth_token}}
```

## 📊 Codes de réponse

- `200` - Succès
- `201` - Création réussie
- `400` - Erreur de validation
- `401` - Non authentifié
- `404` - Ressource non trouvée
- `500` - Erreur serveur

## 🛠️ Dépannage

### Problèmes courants

1. **Token expiré** : Se reconnecter avec `POST /api/auth/login`
2. **Erreur 401** : Vérifier que le token est présent dans l'en-tête
3. **Erreur 400** : Vérifier le format des données envoyées
4. **Serveur non accessible** : Vérifier que le serveur backend est démarré

### Logs utiles

Les logs du serveur backend affichent :
- Les requêtes entrantes
- Les erreurs de validation
- Les erreurs de base de données

## 📞 Support

Pour toute question ou problème, consultez les logs du serveur backend ou vérifiez la configuration de la base de données.
