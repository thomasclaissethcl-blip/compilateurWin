# Feuille de route H5P Studio Portable

## Validations réalisées sur Windows 11

- Version 0.1.3 : diagnostic statique et réexport d'un Branching Scenario réel (72 bibliothèques et 22 dépendances).
- Version 0.3.3 : prévisualisation intégrée et export HTML multifichier testés par l'utilisateur dans Moodle.
- Version 0.3.4 : plein écran de Branching Scenario validé par l'utilisateur ; distribution DOSSIER retenue.

## Version 0.4.0 : premier registre local multiversion

- Importer des bibliothèques depuis une archive H5P ouverte ou un fichier H5P/ZIP local.
- Inventorier les versions et variantes avec hash, provenance et exigences API/dépendances.
- Préserver les versions installées et enregistrer une préférence par empreinte de projet.
- Ne pas exécuter le code des bibliothèques pendant leur importation.
- **Non réalisé** : mise à jour du cœur et des bibliothèques depuis les sites officiels / tiers, application de la sélection et migrations, éditeur visuel.

## Prochains jalons

1. Résolution des conflits et des dépendances (directes, dynamiques et transitives) des bibliothèques choisies, avec signalement des écarts de l'API cœur.
2. Choix d'un profil de cœur/lecteur/éditeur testé ou expérimental, installation de versions depuis des sources vérifiables ; aucun remplacement implicite.
3. Intégration de l'éditeur visuel H5P, création et modification de contenus.
4. Migrations explicites avec sauvegarde et restauration, puis activation contrôlée des versions choisies.
5. Tests de sécurité des dépendances npm, compilation reproductible, export HTML multimodule et optimisation des performances.
