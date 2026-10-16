# Historique

## 0.4.0 : registre local des bibliothèques H5P

- Ajout de l'onglet **Registre multiversion** : visible sans ouvrir de H5P.
- Enregistrement explicite des bibliothèques embarquées dans un H5P ou dans un paquet local H5P/ZIP.
- Inventaire par machineName, version majeure/mineure/corrective, API cœur déclarée, dépendances et provenance d'import.
- Conservation de plusieurs versions et variantes d'une même version (empreintes SHA-256 distinctes) ; aucune substitution silencieuse.
- Préférence de version associée à l'empreinte du projet, stockée hors du H5P.
- Extraction défensive : limites de taille, chemins Windows interdits, collisions de casse, contrôles CRC et copie sans exécution du code des bibliothèques.
- Nouveaux tests automatisés ; **59 tests réussis** dans cet environnement.
- Distribution Windows DOSSIER conservée, lecteur Standalone 3.8.2 et export HTML inchangés.

**Non inclus** : éditeur visuel, récupération automatique des versions récentes du cœur et des bibliothèques, migration automatique, application des versions sélectionnées à la prévisualisation ou aux exports.

## 0.3.4

- Prise en charge ciblée du plein écran dans Electron et les exports HTML.
- Distribution Windows DOSSIER uniquement.
