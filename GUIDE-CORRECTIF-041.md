# Mise à jour vers H5P Studio Portable 0.4.1 (Windows 11)

Ce correctif part d’un dépôt **0.4.0** fonctionnel. Il n'exige aucune installation de Node.js sur votre ordinateur. La compilation se déroule sur GitHub Actions.

## Opérations sur GitHub

1. Décompressez `Correctif-H5P-Studio-0.4.1-GitHub.zip`.
2. **Remplacez** à la racine de votre dépôt les fichiers suivants, en respectant l'arborescence :
   - `assets/app.js`
   - `assets/style.css`
   - `electron/main.cjs`
   - `electron/preload.cjs`
   - `runtime/library-registry.cjs`
   - `index.html`
   - `package.json`
3. **Ajoutez** les nouveaux fichiers :
   - `runtime/dependency-resolver.cjs`
   - `runtime/core-evidence.cjs`
   - `tests/registry-041.test.cjs`
4. Modifiez `.github/workflows/windows-portable.yml` dans l'éditeur GitHub, pour conserver le dossier caché `.github` et mettre à jour le nom de l'artefact. Ce fichier est inclus dans le correctif.
5. Enregistrez les modifications puis lancez **Actions → Compiler H5P Studio Windows DOSSIER → Run workflow** (ou ouvrez la compilation déclenchée automatiquement).
6. Si les tests et la compilation réussissent, téléchargez l'artefact `H5P-Studio-Portable-0.4.1-Windows-DOSSIER`, puis décompressez-le intégralement.
7. Pour retrouver vos bibliothèques déjà installées, copiez votre dossier **`data/` de l'ancien `win-unpacked` vers le nouveau**, APPLICATION FERMÉE. Faites une copie de sauvegarde de ce dossier avant cette opération. Ne copiez jamais dans `resources/app.asar`.

## Test avec RIS503-Mission3.h5p

1. Ouvrez le Branching Scenario et vérifiez la prévisualisation normale et le plein écran.
2. Cliquez sur **Registre multiversion → Enregistrer les bibliothèques du H5P ouvert**.
3. Ouvrez **Dernier rapport d’importation**. Il détaille chaque manifest : *INSTALLÉE*, *DÉJÀ PRÉSENTE* ou *REJETÉE* (avec le motif). Relevez le nombre de manifests et de rejets ; le total de 64 variantes indiqué précédemment représente le **registre**, pas nécessairement le nombre de manifests dans cet import.
4. Cliquez sur **Analyser les dépendances de l’activité ouverte**. Vérifiez que les bibliothèques nécessaires sont trouvées, et signalez toute variante ambiguë ou conflit.
5. Observez **API cœur NON CERTIFIÉE**. C'est attendu ; `Standalone 3.8.2` n'établit pas à lui seul la version de l'API H5P Core.
6. Fermez puis rouvrez l'application pour vérifier que le registre et votre préférence de version sont conservés.
7. Vérifiez, si nécessaire, l'export HTML vers Moodle. Aucune modification volontaire de la génération HTML n'a été faite.

## Interprétation

Un rapport « non certifié » sans autre problème signifie que le graphe statique a été résolu parmi les bibliothèques du registre, **mais la compatibilité du cœur H5P reste non démontrée**. Il ne valide pas le fonctionnement d'un contenu ni l'éditeur visuel.

Les rapports ne déclenchent aucune mise à jour, substitution de bibliothèque ou migration du contenu. Pour tester le rendu réel, utilisez la prévisualisation intégrée.
