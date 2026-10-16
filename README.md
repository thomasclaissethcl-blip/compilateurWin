# H5P Studio Portable 0.3.4 | Windows 11

## Portée
Prototype expérimental : import/diagnostic/réexport `.h5p`, prévisualisation H5P locale et export HTML multifichier.
L'éditeur visuel et le gestionnaire de versions restent à développer.

## Correctifs 0.3.4
- Mode plein écran : l'iframe de prévisualisation possède `allow="fullscreen"` et `allowfullscreen`.
- Electron : seule la permission `fullscreen` provenant de la prévisualisation active sur `127.0.0.1` peut être accordée. Toutes les autres restent refusées, dont `automatic-fullscreen`.
- H5P Standalone : option `fullScreen: true`, sans réintroduire le bandeau supérieur (`frame: false`).
- Seul le format Windows DOSSIER est désormais compilé et publié dans GitHub Actions.

## Construction via GitHub Actions (aucun Node.js sur le poste utilisateur)
Transférer les fichiers modifiés dans le dépôt, y compris `.github/workflows/windows-portable.yml`, puis lancer **Actions → Compiler H5P Studio Windows DOSSIER → Run workflow**.
Télécharger l'artefact `H5P-Studio-Portable-0.3.4-Windows-DOSSIER`.
Après décompression, conserver le dossier complet et lancer `H5P Studio Portable.exe`.

## Publication des exports HTML
Le ZIP exporté est un mini-site multifichier : décompresser et mettre les fichiers sur un serveur HTTP(S), par exemple Moodle (ressource Fichier), GitHub Pages ou hébergement web institutionnel.
Ne pas double-cliquer sur `index.html` depuis l'Explorateur Windows : l'URL `file://` n'est pas une origine HTTP(S) adéquate pour `fetch()`.
Si la page est insérée dans une iframe, utiliser `allow="fullscreen"` sur cette iframe et vérifier les en-têtes de l'hébergeur.

## Tests et limites
Les tests Node exécutables par GitHub sont unitaires et structurels : ils ne prouvent pas que Branching Scenario fonctionne en plein écran sous Windows.
Il faut tester la prévisualisation et un export avec votre activité réelle, puis valider la fermeture du plein écran (touche Échap).
La bibliothèque H5P utilisée reste Standalone 3.8.2. Les nouvelles versions doivent être intégrées et testées explicitement.
