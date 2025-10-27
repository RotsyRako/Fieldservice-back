# 📚 Intégration Swagger - Documentation API

## 🎯 Vue d'ensemble

Swagger a été intégré au projet pour fournir une documentation API interactive et complète. Cette intégration permet de :

- 📖 Documenter toutes les routes API
- 🧪 Tester les endpoints directement depuis l'interface
- 🔐 Gérer l'authentification JWT
- 📊 Visualiser les schémas de données
- 📝 Exporter la spécification OpenAPI

## 🚀 Accès à la Documentation

Une fois le serveur démarré (`npm run dev`), accédez à :

- **Interface Swagger UI** : http://localhost:3000/api-docs
- **Spécification JSON** : http://localhost:3000/api-docs.json

## 📦 Packages Installés

```json
{
  "swagger-ui-express": "^5.0.0",
  "swagger-jsdoc": "^6.2.8",
  "@types/swagger-ui-express": "^4.1.6",
  "@types/swagger-jsdoc": "^6.0.4"
}
```

## 🏗️ Structure de l'Intégration

### 1. Configuration Swagger (`src/swagger.ts`)

Ce fichier configure :
- Les métadonnées de l'API (titre, version, description)
- Les serveurs disponibles
- Les schémas de données (User, Intervention, Materiel, etc.)
- L'authentification JWT (Bearer Token)
- Les définitions des composants

### 2. Intégration dans le Serveur (`src/index.ts`)

```typescript
// Configuration Swagger
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Rotsy API Documentation",
}));
```

### 3. Annotations dans les Routes

Les routes peuvent être annotées avec des commentaires JSDoc Swagger :

```typescript
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 */
router.post("/users", validate(CreateUserSchema), userController.createUser);
```

## 🎨 Schémas Définis

Tous les modèles principaux ont été définis dans Swagger :

- `User` - Utilisateur
- `Intervention` - Intervention
- `Materiel` - Matériel
- `Timesheet` - Feuille de temps
- `Image` - Image
- `Document` - Document
- `Comment` - Commentaire
- `Signature` - Signature
- `Error` - Réponse d'erreur
- `Success` - Réponse de succès

## 🔐 Authentification

L'API utilise l'authentification JWT Bearer Token :

1. Connectez-vous via `/api/auth/login` pour obtenir un token
2. Dans Swagger UI, cliquez sur le bouton **"Authorize"** en haut à droite
3. Entrez `Bearer <votre-token>` dans le champ
4. Toutes les requêtes utiliseront automatiquement ce token

## 📝 Exemple d'Utilisation

### 1. Authentification

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Réponse :
```json
{
  "success": true,
  "message": "Authentification réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

### 2. Utilisation du Token

Copiez le token et utilisez-le dans l'en-tête `Authorization` :

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛠️ Personnalisation

### Modifier la Configuration

Éditez `src/swagger.ts` pour personnaliser :
- Le titre et la description
- Les serveurs (dev, staging, prod)
- Les schémas de données
- Les options de sécurité

### Ajouter des Annotations

Ajoutez des annotations JSDoc directement dans vos fichiers de routes :
- `src/routes/*.route.ts`

Les annotations sont ensuite automatiquement compilées par swagger-jsdoc.

## 📊 Avantages

✅ **Documentation Vivante** : Toujours à jour avec le code
✅ **Tests Intégrés** : Tester les endpoints directement
✅ **Spécification Standard** : Compatible OpenAPI 3.0
✅ **Exportable** : Générer des clients API automatiquement
✅ **Accessible** : Interface graphique intuitive

## 🔄 Maintenance

Pour ajouter de nouvelles routes :
1. Créez la route dans `src/routes/*.route.ts`
2. Ajoutez les annotations Swagger si nécessaire
3. Redémarrez le serveur
4. La documentation sera automatiquement mise à jour

## 📚 Ressources

- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [OpenAPI Specification](https://swagger.io/specification/)
