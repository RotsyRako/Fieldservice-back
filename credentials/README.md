# Google Cloud Credentials

Ce dossier contient les fichiers de credentials pour Google Cloud Vision API.

## Configuration

1. Placez votre fichier JSON de credentials Google Cloud dans ce dossier
2. Renommez-le en `google-cloud-credentials.json` (ou définissez `GOOGLE_APPLICATION_CREDENTIALS` dans votre `.env`)

## Fichier par défaut

Le fichier par défaut attendu est : `credentials/google-cloud-credentials.json`

## Configuration personnalisée

Si vous souhaitez utiliser un autre fichier ou un autre emplacement, définissez la variable d'environnement dans votre `.env` :

```env
GOOGLE_APPLICATION_CREDENTIALS=./credentials/votre-fichier.json
```

ou avec un chemin absolu :

```env
GOOGLE_APPLICATION_CREDENTIALS=/chemin/absolu/vers/votre/fichier.json
```

## Sécurité

⚠️ **IMPORTANT** : Ne commitez jamais vos fichiers de credentials dans Git !
Les fichiers `.json` dans ce dossier sont automatiquement ignorés par `.gitignore`.

