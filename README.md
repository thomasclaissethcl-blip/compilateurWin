# H5P Studio Portable 0.5.2 (expérimental)

Application Electron Windows 11, distribuée sous forme de dossier portable, pour analyser, importer, prévisualiser et exporter des contenus H5P vers un site HTML statique.

## Nouveautés 0.5.2

- Historique persistant des téléchargements de sources et des installations de paquets avec statut visible sous l'action.
- Ouverture du fichier source dans l'Explorateur Windows et liste des révisions du cœur sauvegardées.
- Compilation à distance via un **workflow générique et des recettes validées**. Le cas Game Map est fourni comme première recette.
- Les sources du cœur téléchargées restent en attente d'adaptateur, non activées dans Standalone.

Consulter [GUIDE-052.md](GUIDE-052.md) pour la mise à jour Windows et les tests.

## Compiler sous GitHub Actions (sans Node.js sur le poste)

Déposer les sources à la racine du dépôt GitHub. Lancer `.github/workflows/windows-portable.yml`, puis télécharger `H5P-Studio-Portable-0.5.2-Windows-DOSSIER`. Le dossier `data/` doit être conservé entre les mises à jour.

Le workflow `.github/workflows/build-h5p-libraries.yml` construit des bibliothèques **seulement depuis des recettes approuvées**. Le catalogue des recettes est situé dans `recipes/`. L'installation d'une nouvelle bibliothèque est explicite ; l'activité ouverte ne change pas automatiquement de version.

## Tests

Avec Node.js 22 dans l'environnement de compilation : `npm test`.

## Limites et sécurité

Le moteur actuellement actif est H5P Standalone 3.8.2. Le cœur officiel H5P peut être téléchargé à un commit exact mais pas activé sans adaptateur, et l'API embarquée n'est pas certifiée. L'éditeur visuel reste à intégrer. Les exports HTML multifichiers doivent être servis par HTTP(S) et testés dans Moodle ou sur hébergement statique avant leur diffusion.

Les recettes peuvent lancer du code de développeurs tiers dans GitHub Actions : ne valider que des dépôts et des références de confiance ; ne pas fournir de secrets au job.
