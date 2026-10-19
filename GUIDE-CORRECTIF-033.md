# Mise à jour GitHub de 0.3.2 vers 0.3.3 (sans Node.js)

1. Téléchargez `Correctif-H5P-Studio-0.3.3-GitHub.zip` et décompressez-le.
2. Dans votre dépôt GitHub, remplacez les fichiers aux mêmes emplacements :
   - `assets/static-builder.js`
   - `runtime/studio-site.cjs`
   - `electron/main.cjs`
   - `package.json`
   - `.github/workflows/windows-portable.yml`
   Les tests sous `tests/` sont recommandés (et inclus dans le correctif).
3. Enregistrez les modifications avec `Commit changes`.
4. Dans Actions, exécutez le workflow **Compiler le portable Windows** sur `main`.
5. Après une exécution verte, téléchargez l’artefact **H5P-Studio-Portable-0.3.3-Windows-DOSSIER**, décompressez entièrement le dossier, puis lancez l’exécutable.
6. Importez le Branching Scenario, testez deux fois **Prévisualiser**, puis exportez un ZIP HTML.
7. Dans ce ZIP, `index.html` ne doit plus montrer le titre ou un message de validation au-dessus de l’activité. Il doit toujours être servi en HTTP(S), notamment depuis Moodle ; un double-clic direct en `file://` ne constitue pas un test valide.

La compilation Windows et l’exécution de votre véritable fichier H5P restent à vérifier chez vous.
