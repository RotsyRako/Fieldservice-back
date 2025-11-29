import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerDefinition } from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rotsy API Documentation",
      version: "1.0.0",
      description: "API REST complète pour la gestion des interventions terrain. Cette API permet de gérer les utilisateurs, interventions, matériels, timesheets, images, documents, commentaires et signatures.",
      contact: {
        name: "API Support",
      },
      license: {
        name: "MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur de développement",
      },
    ],
    tags: [
      { name: "Health Check", description: "Vérification de l'état du serveur" },
      { name: "Authentication", description: "Authentification utilisateur" },
      { name: "Users", description: "Gestion des utilisateurs" },
      { name: "Interventions", description: "Gestion des interventions" },
      { name: "Materiels", description: "Gestion du matériel" },
      { name: "Timesheets", description: "Gestion des feuilles de temps" },
      { name: "Images", description: "Gestion des images" },
      { name: "Documents", description: "Gestion des documents" },
      { name: "Comments", description: "Gestion des commentaires" },
      { name: "Signatures", description: "Gestion des signatures" },
    ],
    paths: {
      "/health": {
        get: {
          tags: ["Health Check"],
          summary: "Vérification de l'état du serveur",
          description: "Retourne l'état de santé de l'API",
          responses: {
            200: {
              description: "Serveur opérationnel",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      timestamp: { type: "string", format: "date-time" },
                      service: { type: "string", example: "Rotsy Backend API" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/users": {
        post: {
          tags: ["Users"],
          summary: "Créer un nouvel utilisateur",
          description: "Enregistre un nouvel utilisateur dans le système",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string", example: "John Doe" },
                    email: { type: "string", format: "email", example: "john@example.com" },
                    password: { type: "string", format: "password", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Utilisateur créé avec succès",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
            400: {
              description: "Erreur de validation",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        get: {
          tags: ["Users"],
          summary: "Récupérer tous les utilisateurs",
          description: "Retourne la liste de tous les utilisateurs avec pagination",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Numéro de page" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Nombre d'éléments par page" },
          ],
          responses: {
            200: {
              description: "Liste des utilisateurs",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/users/count": {
        get: {
          tags: ["Users"],
          summary: "Compter les utilisateurs",
          description: "Retourne le nombre total d'utilisateurs",
          responses: {
            200: {
              description: "Nombre d'utilisateurs",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/users/search": {
        get: {
          tags: ["Users"],
          summary: "Rechercher des utilisateurs",
          description: "Recherche des utilisateurs par critères",
          parameters: [
            { name: "field", in: "query", required: true, schema: { type: "string" }, description: "Champ de recherche" },
            { name: "value", in: "query", required: true, schema: { type: "string" }, description: "Valeur à rechercher" },
          ],
          responses: {
            200: {
              description: "Résultats de la recherche",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/users/:id": {
        get: {
          tags: ["Users"],
          summary: "Récupérer un utilisateur par ID",
          description: "Retourne les détails d'un utilisateur spécifique",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID de l'utilisateur" },
          ],
          responses: {
            200: {
              description: "Détails de l'utilisateur",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Mettre à jour un utilisateur",
          description: "Met à jour les informations d'un utilisateur",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    password: { type: "string", format: "password" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Utilisateur mis à jour",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Supprimer un utilisateur",
          description: "Supprime un utilisateur du système",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Utilisateur supprimé",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/users/email/:email": {
        get: {
          tags: ["Users"],
          summary: "Récupérer un utilisateur par email",
          description: "Retourne les détails d'un utilisateur par son email",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "email", in: "path", required: true, schema: { type: "string", format: "email" }, description: "Email de l'utilisateur" },
          ],
          responses: {
            200: {
              description: "Détails de l'utilisateur",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Authentifier un utilisateur",
          description: "Connecte un utilisateur et retourne un token JWT",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email", example: "john@example.com" },
                    password: { type: "string", format: "password", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Authentification réussie",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
            401: {
              description: "Identifiants invalides",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/interventions": {
        get: {
          tags: ["Interventions"],
          summary: "Récupérer toutes les interventions",
          description: "Retourne la liste de toutes les interventions avec pagination",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          ],
          responses: {
            200: {
              description: "Liste des interventions",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Interventions"],
          summary: "Créer une nouvelle intervention",
          description: "Crée une nouvelle intervention",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Intervention" },
              },
            },
          },
          responses: {
            201: {
              description: "Intervention créée avec succès",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/interventions/{id}": {
        get: {
          tags: ["Interventions"],
          summary: "Récupérer une intervention par ID",
          description: "Retourne les détails d'une intervention spécifique",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID de l'intervention" },
          ],
          responses: {
            200: {
              description: "Détails de l'intervention",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Interventions"],
          summary: "Mettre à jour une intervention",
          description: "Met à jour les informations d'une intervention",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Intervention" },
              },
            },
          },
          responses: {
            200: {
              description: "Intervention mise à jour",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Interventions"],
          summary: "Supprimer une intervention",
          description: "Supprime une intervention du système",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Intervention supprimée",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/materiels": {
        get: {
          tags: ["Materiels"],
          summary: "Récupérer tous les matériels",
          description: "Retourne la liste de tous les matériels avec pagination",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Numéro de page" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Nombre d'éléments par page" },
          ],
          responses: {
            200: {
              description: "Liste des matériels",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Materiels"],
          summary: "Créer un nouveau matériel",
          description: "Crée un nouveau matériel",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Materiel" },
              },
            },
          },
          responses: {
            201: {
              description: "Matériel créé avec succès",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/materiels/count": {
        get: {
          tags: ["Materiels"],
          summary: "Compter les matériels",
          description: "Retourne le nombre total de matériels",
          responses: {
            200: {
              description: "Nombre de matériels",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/materiels/search": {
        get: {
          tags: ["Materiels"],
          summary: "Rechercher des matériels",
          description: "Recherche des matériels par critères",
          parameters: [
            { name: "field", in: "query", required: true, schema: { type: "string" }, description: "Champ de recherche" },
            { name: "value", in: "query", required: true, schema: { type: "string" }, description: "Valeur à rechercher" },
          ],
          responses: {
            200: {
              description: "Résultats de la recherche",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/materiels/:id": {
        get: {
          tags: ["Materiels"],
          summary: "Récupérer un matériel par ID",
          description: "Retourne les détails d'un matériel spécifique",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID du matériel" },
          ],
          responses: {
            200: {
              description: "Détails du matériel",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Materiels"],
          summary: "Mettre à jour un matériel",
          description: "Met à jour les informations d'un matériel",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Materiel" },
              },
            },
          },
          responses: {
            200: {
              description: "Matériel mis à jour",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Materiels"],
          summary: "Supprimer un matériel",
          description: "Supprime un matériel du système",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Matériel supprimé",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/timesheets": {
        get: {
          tags: ["Timesheets"],
          summary: "Récupérer toutes les feuilles de temps",
          description: "Retourne la liste de toutes les feuilles de temps avec pagination",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Numéro de page" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Nombre d'éléments par page" },
          ],
          responses: {
            200: {
              description: "Liste des feuilles de temps",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Timesheets"],
          summary: "Créer une nouvelle feuille de temps",
          description: "Crée une nouvelle feuille de temps",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Timesheet" },
              },
            },
          },
          responses: {
            201: {
              description: "Feuille de temps créée avec succès",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/timesheets/count": {
        get: {
          tags: ["Timesheets"],
          summary: "Compter les feuilles de temps",
          description: "Retourne le nombre total de feuilles de temps",
          responses: {
            200: {
              description: "Nombre de feuilles de temps",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/timesheets/search": {
        get: {
          tags: ["Timesheets"],
          summary: "Rechercher des feuilles de temps",
          description: "Recherche des feuilles de temps par critères",
          parameters: [
            { name: "field", in: "query", required: true, schema: { type: "string" }, description: "Champ de recherche" },
            { name: "value", in: "query", required: true, schema: { type: "string" }, description: "Valeur à rechercher" },
          ],
          responses: {
            200: {
              description: "Résultats de la recherche",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/timesheets/:id": {
        get: {
          tags: ["Timesheets"],
          summary: "Récupérer une feuille de temps par ID",
          description: "Retourne les détails d'une feuille de temps spécifique",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID de la feuille de temps" },
          ],
          responses: {
            200: {
              description: "Détails de la feuille de temps",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Timesheets"],
          summary: "Mettre à jour une feuille de temps",
          description: "Met à jour les informations d'une feuille de temps",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Timesheet" },
              },
            },
          },
          responses: {
            200: {
              description: "Feuille de temps mise à jour",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Timesheets"],
          summary: "Supprimer une feuille de temps",
          description: "Supprime une feuille de temps du système",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Feuille de temps supprimée",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/images": {
        get: {
          tags: ["Images"],
          summary: "Récupérer toutes les images",
          description: "Retourne la liste de toutes les images avec pagination",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Numéro de page" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Nombre d'éléments par page" },
          ],
          responses: {
            200: {
              description: "Liste des images",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Images"],
          summary: "Créer une nouvelle image",
          description: "Crée une nouvelle image",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Image" },
              },
            },
          },
          responses: {
            201: {
              description: "Image créée avec succès",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/images/count": {
        get: {
          tags: ["Images"],
          summary: "Compter les images",
          description: "Retourne le nombre total d'images",
          responses: {
            200: {
              description: "Nombre d'images",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/images/search": {
        get: {
          tags: ["Images"],
          summary: "Rechercher des images",
          description: "Recherche des images par critères",
          parameters: [
            { name: "field", in: "query", required: true, schema: { type: "string" }, description: "Champ de recherche" },
            { name: "value", in: "query", required: true, schema: { type: "string" }, description: "Valeur à rechercher" },
          ],
          responses: {
            200: {
              description: "Résultats de la recherche",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/images/:id": {
        get: {
          tags: ["Images"],
          summary: "Récupérer une image par ID",
          description: "Retourne les détails d'une image spécifique",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID de l'image" },
          ],
          responses: {
            200: {
              description: "Détails de l'image",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Images"],
          summary: "Mettre à jour une image",
          description: "Met à jour les informations d'une image",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Image" },
              },
            },
          },
          responses: {
            200: {
              description: "Image mise à jour",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Images"],
          summary: "Supprimer une image",
          description: "Supprime une image du système",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Image supprimée",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/documents": {
        get: {
          tags: ["Documents"],
          summary: "Récupérer tous les documents",
          description: "Retourne la liste de tous les documents avec pagination",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Numéro de page" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Nombre d'éléments par page" },
          ],
          responses: {
            200: {
              description: "Liste des documents",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Documents"],
          summary: "Créer un nouveau document",
          description: "Crée un nouveau document",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Document" },
              },
            },
          },
          responses: {
            201: {
              description: "Document créé avec succès",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/documents/count": {
        get: {
          tags: ["Documents"],
          summary: "Compter les documents",
          description: "Retourne le nombre total de documents",
          responses: {
            200: {
              description: "Nombre de documents",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/documents/search": {
        get: {
          tags: ["Documents"],
          summary: "Rechercher des documents",
          description: "Recherche des documents par critères",
          parameters: [
            { name: "field", in: "query", required: true, schema: { type: "string" }, description: "Champ de recherche" },
            { name: "value", in: "query", required: true, schema: { type: "string" }, description: "Valeur à rechercher" },
          ],
          responses: {
            200: {
              description: "Résultats de la recherche",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/documents/:id": {
        get: {
          tags: ["Documents"],
          summary: "Récupérer un document par ID",
          description: "Retourne les détails d'un document spécifique",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID du document" },
          ],
          responses: {
            200: {
              description: "Détails du document",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Documents"],
          summary: "Mettre à jour un document",
          description: "Met à jour les informations d'un document",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Document" },
              },
            },
          },
          responses: {
            200: {
              description: "Document mis à jour",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Documents"],
          summary: "Supprimer un document",
          description: "Supprime un document du système",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Document supprimé",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/comments": {
        get: {
          tags: ["Comments"],
          summary: "Récupérer tous les commentaires",
          description: "Retourne la liste de tous les commentaires avec pagination",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Numéro de page" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Nombre d'éléments par page" },
          ],
          responses: {
            200: {
              description: "Liste des commentaires",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Comments"],
          summary: "Créer un nouveau commentaire",
          description: "Crée un nouveau commentaire",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
          responses: {
            201: {
              description: "Commentaire créé avec succès",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/comments/count": {
        get: {
          tags: ["Comments"],
          summary: "Compter les commentaires",
          description: "Retourne le nombre total de commentaires",
          responses: {
            200: {
              description: "Nombre de commentaires",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/comments/search": {
        get: {
          tags: ["Comments"],
          summary: "Rechercher des commentaires",
          description: "Recherche des commentaires par critères",
          parameters: [
            { name: "field", in: "query", required: true, schema: { type: "string" }, description: "Champ de recherche" },
            { name: "value", in: "query", required: true, schema: { type: "string" }, description: "Valeur à rechercher" },
          ],
          responses: {
            200: {
              description: "Résultats de la recherche",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/comments/:id": {
        get: {
          tags: ["Comments"],
          summary: "Récupérer un commentaire par ID",
          description: "Retourne les détails d'un commentaire spécifique",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID du commentaire" },
          ],
          responses: {
            200: {
              description: "Détails du commentaire",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Comments"],
          summary: "Mettre à jour un commentaire",
          description: "Met à jour les informations d'un commentaire",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
          responses: {
            200: {
              description: "Commentaire mis à jour",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Comments"],
          summary: "Supprimer un commentaire",
          description: "Supprime un commentaire du système",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Commentaire supprimé",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/signatures": {
        get: {
          tags: ["Signatures"],
          summary: "Récupérer toutes les signatures",
          description: "Retourne la liste de toutes les signatures avec pagination",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Numéro de page" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Nombre d'éléments par page" },
          ],
          responses: {
            200: {
              description: "Liste des signatures",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Signatures"],
          summary: "Créer une nouvelle signature",
          description: "Crée une nouvelle signature",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Signature" },
              },
            },
          },
          responses: {
            201: {
              description: "Signature créée avec succès",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/signatures/count": {
        get: {
          tags: ["Signatures"],
          summary: "Compter les signatures",
          description: "Retourne le nombre total de signatures",
          responses: {
            200: {
              description: "Nombre de signatures",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/signatures/search": {
        get: {
          tags: ["Signatures"],
          summary: "Rechercher des signatures",
          description: "Recherche des signatures par critères",
          parameters: [
            { name: "field", in: "query", required: true, schema: { type: "string" }, description: "Champ de recherche" },
            { name: "value", in: "query", required: true, schema: { type: "string" }, description: "Valeur à rechercher" },
          ],
          responses: {
            200: {
              description: "Résultats de la recherche",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
      "/api/signatures/:id": {
        get: {
          tags: ["Signatures"],
          summary: "Récupérer une signature par ID",
          description: "Retourne les détails d'une signature spécifique",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID de la signature" },
          ],
          responses: {
            200: {
              description: "Détails de la signature",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Signatures"],
          summary: "Mettre à jour une signature",
          description: "Met à jour les informations d'une signature",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Signature" },
              },
            },
          },
          responses: {
            200: {
              description: "Signature mise à jour",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Signatures"],
          summary: "Supprimer une signature",
          description: "Supprime une signature du système",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Signature supprimée",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", writeOnly: true },
            token: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Intervention: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            titre: { type: "string" },
            dateStart: { type: "string" },
            dateEnd: { type: "string" },
            status: { type: "integer" },
            priority: { type: "string" },
            customer: { type: "string" },
            long: { type: "number", format: "float" },
            lat: { type: "number", format: "float" },
            distance: { type: "number", format: "float" },
            description: { type: "string" },
            userId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Materiel: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            quantity: { type: "integer" },
            idIntervention: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Timesheet: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            description: { type: "string" },
            timeAllocated: { type: "number", format: "float" },
            date: { type: "string" },
            idIntervention: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Image: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            filename: { type: "string" },
            data: { type: "string" },
            idIntervention: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Document: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            filename: { type: "string" },
            data: { type: "string" },
            idIntervention: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Comment: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            message: { type: "string" },
            dateCreated: { type: "string", format: "date-time" },
            attachmentFilename: { type: "string", nullable: true },
            attachmentData: { type: "string", nullable: true },
            idIntervention: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Signature: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            filename: { type: "string" },
            data: { type: "string" },
            idIntervention: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: {},
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
      apis: [], // Pas besoin des annotations pour l'instant
  };
  
  // Générer la spécification Swagger
  const swaggerSpec = swaggerJsdoc(options);
  
  export { swaggerSpec };
