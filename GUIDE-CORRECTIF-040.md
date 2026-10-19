# Mise à jour du dépôt GitHub : H5P Studio 0.4.0

Vous partez du dépôt contenant H5P Studio 0.3.4. Aucun Node.js n'est nécessaire sur votre ordinateur Windows 11.

## Mise à jour

1. Ouvrez le ZIP `Correctif-H5P-Studio-0.4.0-GitHub.zip` et décompressez-le.
2. Dans votre dépôt GitHub, **remplacez** à l'identique les fichiers :
   - `assets/app.js`
   - `assets/style.css`
   - `electron/main.cjs`
   - `electron/preload.cjs`
   - `index.html`
   - `package.json`
3. **Ajoutez** les nouveaux fichiers :
   - `runtime/library-registry.cjs`
   - `tests/registry-040.test.cjs`
4. Modifiez `.github/workflows/windows-portable.yml` directement via l'éditeur GitHub pour remplacer le nom de l'artefact par la version 0.4.0. Si vous déposez les fichiers par le navigateur, les dossiers commençant par un point peuvent être masqués : la création/édition directe du fichier YAML évite cette difficulté.
5. Validez les modifications dans votre dépôt.
6. Depuis **Actions → Compiler H5P Studio Windows DOSSIER**, lancez le workflow.
7. Dans l'exécution réussie, téléchargez l'artefact `H5P-Studio-Portable-0.4.0-Windows-DOSSIER` puis décompressez **tout** son contenu. Lancez `H5P Studio Portable.exe` dans `win-unpacked`.

Ne fusionnez pas les anciens dossiers `resources` et `data` à l'intérieur de `app.asar`. L'application utilise un répertoire de données séparé voisin de l'exécutable, lorsqu'il est inscriptible. Pour préserver votre registre entre deux versions DOSSIER, conservez une copie de `data/` et recopiez-la dans le nouveau dossier `win-unpacked` après extraction, application fermée.

## Essais prioritaires

1. Vérifier qu'une activité H5P déjà reconnue s'ouvre et se prévisualise, y compris en plein écran.
2. Dans **Registre multiversion**, importer les bibliothèques de l'activité.
3. Vérifier la liste, les numéros de version, les sources et les API déclarées.
4. Réimporter le même paquet : il doit être signalé comme déjà présent, sans écraser les données.
5. Importer un autre paquet contenant une version différente ou une variante et vérifier leur coexistence.
6. Sélectionner une version pour l'activité et relancer l'application afin de vérifier la persistance du choix.
7. Vérifier l'export HTML multifichier et son fonctionnement sur un serveur HTTP(S), dont Moodle.

**Important :** le choix de version n'est pas encore appliqué au lecteur et aux exports. Il s'agit du premier sous-jalon du gestionnaire de versions.
