# Passer de H5P Studio 0.3.3 à 0.3.4

Dans votre dépôt GitHub, remplacez les fichiers fournis par ceux de l'archive de correctif en conservant leurs chemins.
Créez `runtime/fullscreen-permission.cjs` et `tests/fullscreen-034.test.cjs` s'ils n'existent pas.
Dans l'interface GitHub, éditez manuellement le fichier masqué `.github/workflows/windows-portable.yml` (Code > cliquer sur le fichier > crayon), puis validez la modification.
Lancez Actions > Compiler H5P Studio Windows DOSSIER > Run workflow.
Téléchargez le nouvel artefact dossier puis décompressez-le dans un répertoire distinct de la version précédente.

Tests souhaités : Branching Scenario en lecture intégrée, activation et sortie du mode plein écran, nouvelle prévisualisation, export HTML puis consultation HTTP(S) avec plein écran.

Attention : le code n'a pas encore été exécuté sur un poste Windows 11. Si le plein écran échoue, consulter la console d'Electron et les restrictions de l'iframe imbriquée dans H5P Standalone.
