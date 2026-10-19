# H5P Studio Portable 0.5.2 : mise à jour Windows 11 sans Node.js

## Ce que cette version apporte

- Un **résultat juste sous le bouton** « Examiner cette révision » : téléchargement en cours, succès ou erreur, avec SHA-256.
- Un historique persistant, dans **Sources et mises à jour > Historique des opérations**, avec bouton pour révéler le fichier source dans l'Explorateur Windows.
- Un inventaire des **sources du cœur H5P sauvegardées**, toutes explicitement classées « non activées ». L'API du cœur n'est pas certifiée par leur simple présence.
- Un workflow de compilation **générique à recettes relues**. Game Map est la première recette ; le moteur et le workflow ne sont plus spécifiques à cette bibliothèque.

## Installation dans le dépôt GitHub

1. Fermer H5P Studio et sauvegarder entièrement le dossier `data/` de l'ancienne distribution.
2. À la racine du dépôt, remplacer et ajouter les fichiers présents dans le correctif 0.5.2. Respecter exactement l'arborescence.
3. **Supprimer** l'ancien fichier `.github/workflows/build-game-map.yml` dans GitHub : onglet Code, ouvrir le fichier, menu « … » > Delete file > Commit changes. Il est remplacé par `.github/workflows/build-h5p-libraries.yml`.
4. Déposer le nouveau workflow `.github/workflows/build-h5p-libraries.yml`. Si `.github` est masqué lors d'un upload depuis le navigateur, utiliser « Add file > Create new file » en donnant ce chemin complet.
5. Modifier le workflow `.github/workflows/windows-portable.yml` avec celui du correctif.
6. Ouvrir **Actions > Compiler H5P Studio Windows DOSSIER**, puis « Run workflow ».
7. Récupérer l'artefact `H5P-Studio-Portable-0.5.2-Windows-DOSSIER`, l'extraire complètement et copier **votre ancien dossier `data/`** auprès de l'exécutable, application fermée. Ne pas effacer les bibliothèques précédentes.

## Validation proposée

1. Dans « Sources et mises à jour », vérifier une source et récupérer sa dernière révision. Contrôler l'information directement sous le bouton.
2. Examiner l'Historique des opérations ; fermer puis rouvrir H5P Studio pour vérifier sa persistance.
3. Cliquer sur « Afficher les sources sur le disque ». Le dossier contenant `source.zip` et `manifest.json` doit s'ouvrir dans l'Explorateur.
4. Examiner « Révisions du cœur conservées » : chaque entrée doit être identifiée comme **non activée**, même si elle est récente.
5. Dans GitHub, ouvrir **Actions > Construire des bibliothèques H5P (recettes)**, choisir la recette `game-map` et lancer le workflow (références par défaut : 1.9.8 et master). Les ZIP sont disponibles dans l'artefact `H5P-bibliotheques-compilees`.
6. Dans H5P Studio, onglet Registre, importer les ZIP obtenus. Vérifier que la source et les versions sont enregistrées sans écraser l'existant.

## Périmètre et réserves

- Le workflow sait exécuter une **recette approuvée**, pas compiler automatiquement n'importe quel dépôt H5P. Pour étendre le système, ajouter une recette relue dans `recipes/` et son identifiant à la liste de choix dans le workflow.
- La compilation exécute des scripts tiers `npm ci` et `npm run build` **sur un runner GitHub**. Vérifier l'auteur, la référence et le code utilisé. Les workflows n'ont que la permission `contents: read`, n'envoient pas de secrets et utilisent `persist-credentials: false`, mais il s'agit toujours d'une exécution de code non fiable sur un runner. Éviter d'exécuter des versions inconnues sur un runner qui aurait accès à des données sensibles.
- Le cœur H5P téléchargé reste conservé comme source. **Il n'est pas activé dans l'éditeur ou le lecteur**. Standalone 3.8.2 reste le moteur actif. La prochaine étape doit construire et tester un adaptateur avant toute activation.
- Il n'existe pas encore d'éditeur visuel H5P intégré. Les préférences de versions ne sont pas appliquées automatiquement aux contenus.
- Le workflow de compilation et l'interface Electron demandent une validation réelle sur votre poste Windows 11. Les tests automatisés ne garantissent pas cette compatibilité.
