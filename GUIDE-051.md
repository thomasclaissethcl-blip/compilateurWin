# H5P Studio 0.5.1 : guide pour Windows 11 sans Node.js

## A. Mettre à jour votre application depuis GitHub

1. Sauvegardez votre dossier `data/` actuel en fermant H5P Studio.
2. Décompressez **Correctif-H5P-Studio-0.5.1-GitHub.zip** et copiez les fichiers dans votre dépôt GitHub aux mêmes emplacements. Pour `.github/workflows/build-game-map.yml` (nouveau fichier) et `.github/workflows/windows-portable.yml`, utilisez **Code > Add file > Create new file**, ou l'éditeur de fichier de GitHub. Les dossiers commençant par un point peuvent être masqués au téléversement par le navigateur.
3. Validez (commit). Dans **Actions > Compiler H5P Studio Windows DOSSIER**, lancez la compilation et téléchargez l'artefact **H5P-Studio-Portable-0.5.1-Windows-DOSSIER**.
4. Décompressez la distribution et recopiez le dossier `data/` sauvegardé, application fermée.
5. Ouvrez H5P Studio, puis la rubrique **Sources et mises à jour**.

## B. Vérifier une révision de cœur H5P

Dans les sources officielles, cliquez sur **Vérifier** puis **Examiner cette révision** pour le commit de la branche par défaut ou l'un des tags dotés d'un SHA. H5P Studio conserve le ZIP source et un fichier `manifest.json` sous `data/source-snapshots/`. Il ne remplace pas Standalone. Ce téléchargement ne prouve pas la compatibilité avec l'API annoncée par les bibliothèques.

## C. Compiler Game Map et sa bibliothèque d'édition sur GitHub

Le workflow dédié est un **prototype limité à ces deux dépôts connus**. Il déclenche les scripts npm du développeur sur une machine éphémère GitHub Actions, et nécessite donc une confiance raisonnable dans le code choisi.

1. Dans GitHub, ouvrez **Actions > Préparer les bibliothèques Game Map > Run workflow**.
2. Indiquez le tag ou commit Game Map (ex. `1.9.8`). Pour l'éditeur Game Map, indiquez un tag ou un SHA disponible dans son dépôt, ou `master` pour un premier essai. Un SHA explicite est préférable pour la reproductibilité.
3. Si le workflow réussit, téléchargez l'artefact **H5P-GameMap-bibliotheques-compilees** dans la rubrique Artifacts. Décompressez-le.
4. Dans H5P Studio, ouvrez **Registre multiversion > Importer un paquet local .h5p ou .zip** et choisissez `H5P.GameMap.zip`. Répétez pour `H5PEditor.GameMap.zip`.
5. Consultez le rapport de résolution des dépendances. Certaines dépendances de Game Map (par exemple H5P.SoundJS ou H5PEditor.DateTime) peuvent nécessiter une installation distincte. Un paquet de bibliothèque isolée n'est pas forcément suffisant pour prévisualiser ou éditer une activité.

Le format `.zip` produit contient `library.json`, les fichiers JS/CSS compilés et les ressources nécessaires, avec les chemins attendus. **Ce ZIP n'est pas une activité .h5p.** Une application H5P doit toujours disposer de son contenu (`h5p.json`, `content/content.json`) et de toutes ses dépendances.

## D. Limites et prochain jalon

- Ni le cœur H5P récupéré ni les nouvelles bibliothèques ne remplacent automatiquement le moteur de prévisualisation de H5P Studio.
- Une nouvelle API du cœur H5P peut imposer une adaptation ciblée du lecteur et/ou de l'éditeur.
- L'éditeur visuel officiel n'est pas encore disponible dans H5P Studio.
- La compilation Game Map sur GitHub n'a pas été exécutée dans cet environnement. En cas d'échec, fournissez le journal de compilation précis.
- La compatibilité d'un contenu créé avec une version plus ancienne de bibliothèque peut exiger une migration. H5P Studio n'effectue aucune migration automatique.

## E. Sécurité

GitHub Actions exécute du code de développeurs externes pendant `npm ci` et `npm run build`. Le workflow est manuel, limité à deux dépôts fixes et possède des permissions GitHub en lecture seule. Pour la production, mieux vaut pinner les références à des SHA vérifiés. Le registre d'installation n'exécute aucun script au moment de la copie, mais les bibliothèques seront exécutées lors d'une future prévisualisation.
