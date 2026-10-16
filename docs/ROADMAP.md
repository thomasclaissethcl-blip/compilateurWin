# Feuille de route H5P Studio Portable

## Jalons validés sur Windows 11

- 0.1.3 : diagnostic H5P et réexport du Branching Scenario réel.
- 0.3.4 : prévisualisation intégrée, plein écran et export HTML multifichier fonctionnels, distribution DOSSIER.
- 0.4.0 : installation de bibliothèques multiversion et persistance du registre.

## 0.4.1 : diagnostic et résolution statique (validation Windows encore nécessaire)

- Journaliser le sort de chaque manifest lors de l'importation (nouveau, déjà présent, rejeté).
- Diagnostiquer les dépendances transitives, les préférences incompatibles et les variantes ambiguës.
- Identifier ce que l'on peut tracer du lecteur embarqué, sans inventer une version d'API cœur non attestée.
- Préserver les fonctions validées, sans appliquer une version choisie au contenu.

## Prochains jalons

1. Attester précisément l'API du H5P Core embarqué dans chaque build de lecteur (source Git et compilation reproductible), avec tests fonctionnels pour les types de contenu récents.
2. Gérer le téléchargement manuel explicite depuis les sources officielles et tierces avec vérification des archives.
3. Créer une intégration complète de l'éditeur visuel et des bibliothèques d'édition correspondantes.
4. Mettre en place une migration de contenus sauvegardée, réversible et validée avant d'appliquer un changement de bibliothèque.
5. Maintenir des profils stable/expérimental, un audit npm/lockfile et un mécanisme de mises à jour testées.
