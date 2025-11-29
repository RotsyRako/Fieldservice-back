# API d'Estimation d'Intervention avec Gemini Pro

Cette API permet d'estimer le temps nécessaire pour réaliser une intervention en utilisant le modèle Gemini Pro de Google.

## Endpoint

```
POST /api/interventions/:id/estimate
```

## Authentification

Cette route nécessite une authentification via token JWT. Incluez le token dans le header `Authorization` :

```
Authorization: Bearer <votre_token_jwt>
```

## Paramètres

- `id` (dans l'URL) : L'ID de l'intervention à estimer (UUID)

## Exemple de Requête

### cURL

```bash
curl -X POST \
  http://localhost:3000/api/interventions/123e4567-e89b-12d3-a456-426614174000/estimate \
  -H "Authorization: Bearer votre_token_jwt_ici" \
  -H "Content-Type: application/json"
```

### JavaScript (fetch)

```javascript
const interventionId = "123e4567-e89b-12d3-a456-426614174000";
const token = "votre_token_jwt_ici";

const response = await fetch(
  `http://localhost:3000/api/interventions/${interventionId}/estimate`,
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);

const data = await response.json();
console.log(data);
```

### Postman

1. Méthode : `POST`
2. URL : `http://localhost:3000/api/interventions/:id/estimate`
   - Remplacez `:id` par l'ID réel de l'intervention
3. Headers :
   - `Authorization`: `Bearer votre_token_jwt_ici`
   - `Content-Type`: `application/json`

## Réponse Succès (200 OK)

```json
{
  "success": true,
  "message": "Estimation générée avec succès",
  "data": {
    "estimatedTime": "04:30:00",
    "reasoning": "Basé sur l'analyse de l'intervention, cette tâche nécessite environ 4.5 heures de travail. La description indique une réparation de plomberie standard avec remplacement de pièces. Les matériels nécessaires (2 joints, 1 robinet) suggèrent une intervention de complexité moyenne. Le temps déjà alloué (1 heure) indique que le travail a commencé. Compte tenu de la priorité 'haute' et de la distance de 15 km, j'estime qu'il reste environ 3.5 heures de travail effectif, plus 1 heure pour les tests et la vérification finale.",
    "confidence": 0.85
  }
}
```

### Structure de la Réponse

- `success` (boolean) : Indique si la requête a réussi
- `message` (string) : Message descriptif
- `data` (object) : Contient l'estimation
  - `estimatedTime` (string) : Temps estimé au format `hh:mm:ss` (ex: "04:30:00" pour 4 heures et 30 minutes)
  - `reasoning` (string) : Explication détaillée de l'estimation en français
  - `confidence` (number) : Niveau de confiance entre 0 et 1

## Réponses d'Erreur

### 400 Bad Request - ID manquant

```json
{
  "success": false,
  "message": "L'ID de l'intervention est requis"
}
```

### 401 Unauthorized - Token manquant ou invalide

```json
{
  "success": false,
  "message": "Token d'authentification manquant ou invalide"
}
```

### 404 Not Found - Intervention non trouvée

```json
{
  "success": false,
  "message": "Intervention avec l'ID 123e4567-e89b-12d3-a456-426614174000 non trouvée"
}
```

### 500 Internal Server Error - Erreur de configuration Gemini

```json
{
  "success": false,
  "message": "Erreur de configuration Gemini API. Vérifiez que GEMINI_KEY est définie dans votre .env"
}
```

### 502 Bad Gateway - Erreur API Gemini

```json
{
  "success": false,
  "message": "Erreur lors de l'appel à l'API Gemini"
}
```

## Informations Utilisées pour l'Estimation

L'API utilise toutes les informations disponibles de l'intervention pour générer l'estimation :

- **Informations de base** : Titre, description, priorité, client, distance, statut, dates
- **Matériels** : Liste des matériels nécessaires avec quantités
- **Timesheets** : Temps déjà alloué pour cette intervention
- **Images** : Nombre et noms des images associées
- **Documents** : Nombre et noms des documents associés
- **Commentaires** : Tous les commentaires avec dates
- **Signatures** : Présence de signatures

## Configuration

Assurez-vous que la variable d'environnement `GEMINI_KEY` est définie dans votre fichier `.env` :

```env
GEMINI_KEY=votre_cle_api_gemini_ici
```

## Notes

- L'estimation est générée en temps de travail effectif (hors déplacement)
- Le modèle Gemini analyse toutes les informations disponibles pour fournir une estimation réaliste
- Le niveau de confiance indique la fiabilité de l'estimation (0 = très incertain, 1 = très confiant)
- Le temps estimé est retourné au format `hh:mm:ss` (heures:minutes:secondes)

