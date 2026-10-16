# Compiler H5P Studio Portable 0.3.0 sans installer Node.js

Ce dossier est prêt à être déposé **à la racine** d'un dépôt GitHub. La compilation est effectuée sur un ordinateur Windows distant fourni par GitHub Actions. Votre ordinateur Windows 11 n'a besoin que d'un navigateur et d'un accès à GitHub.

## Étapes (interface Web uniquement)

1. Connectez-vous à https://github.com et créez un nouveau dépôt à https://github.com/new. Nommez-le par exemple `h5p-studio-portable` et sélectionnez **Private**. Vous pouvez laisser le dépôt vide, sans README initial.
2. Décompressez le fichier ZIP fourni. Ouvrez le dossier décompressé **H5P-Studio-0.3.0-GitHub-sans-Node**. **Déposez dans le dépôt le CONTENU du dossier, pas le ZIP lui-même ni le dossier parent** : depuis la page du dépôt GitHub, utilisez « uploading an existing file » (dépôt vide), ou `Add file > Upload files`, puis glissez les fichiers et sous-dossiers. Validez avec `Commit changes`.
3. Vérifiez que `package.json` et `index.html` figurent **à la racine du dépôt**, et que `.github/workflows/windows-portable.yml` est bien présent.
4. Dans l'onglet **Actions**, ouvrez **Compiler le portable Windows**. Le workflow peut démarrer automatiquement après le dépôt des sources. Sinon, cliquez sur **Run workflow**, sélectionnez `main`, puis confirmez. Si GitHub vous invite à activer Actions, faites-le pour ce dépôt.
5. Lorsqu'une exécution est terminée avec succès (indicateur vert), cliquez dessus. Dans la rubrique **Artifacts**, téléchargez `H5P-Studio-Portable-0.3.0-Windows`.
6. Décompressez l'artefact téléchargé : il doit contenir `H5P-Studio-Portable-0.3.0-x64.exe`. Déplacez l'exécutable dans un dossier sur lequel vous avez le droit d'écrire, puis lancez-le. Sous Windows, les règles de sécurité de votre établissement peuvent encore empêcher l'exécution d'un programme inconnu ou non signé.

## Ce que fait la compilation distante

- `actions/setup-node` prépare Node.js sur le serveur GitHub, **pas sur votre ordinateur**.
- `npm install` télécharge les outils Electron **sur le serveur GitHub**.
- `npm test` lance les tests automatiques du code source.
- `npm run build:win` télécharge et vérifie H5P Standalone 3.8.2 puis tente de compiler l'exécutable portable.
- L'exécutable est disponible dans les artefacts **uniquement si les opérations réussissent**.

## Limites actuelles

- **Le fichier .exe n'a pas encore été compilé ni testé sur une véritable machine Windows 11.** Il peut y avoir des erreurs de compilation et elles devront être corrigées à partir des journaux GitHub Actions.
- L'application 0.3.0 reste un prototype. L'éditeur H5P visuel complet et le gestionnaire de versions ne sont pas encore intégrés.
- La version du lecteur embarqué est épinglée à H5P Standalone 3.8.2. Les dernières bibliothèques H5P n'ont pas toutes été testées.
- GitHub Actions dispose de quotas de minutes et d'espace de stockage. Vérifiez les limites et coûts applicables à votre compte (notamment pour les dépôts privés).
- Ne déposez **pas** vos activités H5P pédagogiques dans le dépôt. Seul le code source du logiciel est nécessaire à la compilation.

## En cas d'erreur

Ouvrez `Actions > Compiler le portable Windows > [exécution en échec]`, puis copiez la section des logs du premier pas en erreur. Elle permettra d'établir précisément le correctif.

Documentation officielle :
- Création d'un dépôt : https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
- Ajout de fichiers : https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- Lancement manuel d'une Action : https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow
- Téléchargement d'artefacts : https://docs.github.com/fr/actions/how-tos/manage-workflow-runs/download-workflow-artifacts
