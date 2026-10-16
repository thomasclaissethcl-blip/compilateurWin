# Appliquer le correctif 0.3.1 dans votre dépôt GitHub

Le ZIP `Correctif-H5P-Studio-0.3.1-GitHub.zip` ne contient que les fichiers modifiés.

1. Dans GitHub, remplacez les fichiers listés ci-dessous à leurs emplacements exacts. Ne les ajoutez pas tous à la racine : les répertoires doivent être conservés.
2. Pour `.github/workflows/windows-portable.yml`, ouvrez le fichier dans GitHub, puis cliquez sur le crayon **Edit this file** et collez le contenu du fichier corrigé. Son nom commençant par un point, cette méthode évite le blocage du téléversement web.
3. Validez les changements sur `main`.
4. Dans **Actions**, sélectionnez **Compiler le portable Windows**, puis **Run workflow** si aucun lancement automatique n'a démarré.
5. Téléchargez d'abord l'artefact **Windows-DOSSIER**, puis le `.exe` à l'intérieur de ce dossier. Ne retirez pas l'exécutable de ce dossier : il dépend des fichiers voisins.

## Fichiers remplacés

- `assets/app.js`
- `assets/h5p-core.js`
- `assets/static-builder.js`
- `electron/main.cjs`
- `electron/preload.cjs`
- `runtime/studio-site.cjs`
- `index.html`
- `package.json`
- `.github/workflows/windows-portable.yml`

## Fichier nouveau

- `tests/mutation-regression.test.cjs`

Le programme n'a pas besoin de Node.js sur votre poste. Seul le service GitHub Actions effectue la compilation.
