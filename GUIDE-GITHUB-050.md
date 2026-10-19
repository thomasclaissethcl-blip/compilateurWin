# Installer H5P Studio Portable 0.5.0 par GitHub (Windows 11)

1. Sauvegarder **tout le dossier `data/`** de H5P Studio Portable 0.4.2, l'application étant fermée.
2. Dans votre dépôt GitHub, remplacer les fichiers présents dans `Correctif-H5P-Studio-0.5.0-GitHub.zip`, en conservant exactement leur chemin. **Créer** les nouveaux fichiers `runtime/update-sources.cjs`, `runtime/github-catalog.cjs` et `tests/catalog-050.test.cjs`.
3. Actualiser `.github/workflows/windows-portable.yml` directement dans GitHub si votre navigateur masque le dossier `.github`.
4. Faire **Commit changes**, puis dans **Actions**, lancer le workflow `Compiler H5P Studio Windows DOSSIER` sur la branche contenant les mises à jour.
5. Après réussite, récupérer l'artefact `H5P-Studio-Portable-0.5.0-Windows-DOSSIER` et le décompresser dans **un nouveau dossier**.
6. Application fermée, recopier `data/` de la version précédente à côté du nouvel exécutable. Ne pas écraser les fichiers d'exécution d'une version par ceux d'une autre.
7. Ouvrir **Sources et mises à jour**, vérifier le suivi des trois composants H5P officiels. Ajouter ensuite un dépôt tiers connu, cliquer sur **Vérifier**, puis, si une release contient un paquet H5P/ZIP, sélectionner une installation après avoir vérifié la provenance.

## Validation

- La version Windows-DOSSIER démarre ; importation, aperçu plein écran et export HTML restent opérationnels.
- Les bibliothèques précédemment installées sont toujours présentes.
- Les trois sources officielles sont visibles.
- Les releases/tags/commits d'un dépôt public connu sont affichés après action de vérification.
- Une pièce jointe `.h5p` ou `.zip` d'une release peut être ajoutée au registre sans remplacement des variantes antérieures.
- Un dépôt sans release ou sans paquet installable est identifié sans donner l'impression qu'il est compatible.

Le suivi des versions du cœur n'implique pas encore leur activation. En cas de limitation de l'API GitHub (HTTP 403) ou d'absence de réseau, recommencer ultérieurement ; ne pas contourner les limites ni installer des fichiers non fiables.
