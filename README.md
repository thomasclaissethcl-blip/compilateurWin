# H5P Studio Portable 0.4.1 (expérimental)

Application portable pour Windows 11, diffusée sous forme **DOSSIER** (`win-unpacked`) et compilable sur GitHub Actions sans Node.js installé sur le poste utilisateur.

## Fonctions actuellement opérationnelles

- Importation et analyse statique de fichiers `.h5p` ; lecture et édition manuelle des fichiers `h5p.json` / `content.json` ; export `.h5p`.
- Prévisualisation intégrée utilisant H5P Standalone 3.8.2 ; plein écran validé par un utilisateur avec Branching Scenario.
- Export de site HTML multifichier pour Moodle ou un hébergement HTTP(S) statique ; pas d'ouverture directe fiable sous `file://`.
- Registre multiversion local : importation depuis les archives H5P, stockage des bibliothèques, coexistence de versions et d'empreintes distinctes, préférence de version par activité.
- **Nouveau en 0.4.1** : rapport détaillé d'importation manifest par manifest et résolveur statique des dépendances depuis les versions installées, avec détection des variantes ambiguës et des conflits.
- Provenance du paquet Standalone consultable si `runtime-source.json` est fourni ; **version de l'API H5P Core non certifiée**.

## Ce que l'outil ne fait pas encore

- Intégrer l'éditeur visuel H5P, créer un contenu directement dans les formulaires H5P ou convertir les données lors d'un changement de version.
- Télécharger automatiquement les versions récentes du cœur ou des bibliothèques officielles et tierces.
- Activer les bibliothèques sélectionnées dans la prévisualisation ou les exports. Le diagnostic ne modifie rien.
- Garantir qu'une bibliothèque récente soit compatible avec Standalone 3.8.2 : l'API exacte de son cœur embarqué n'est pas attestée.

## Mise à jour depuis 0.4.0

Voir [`GUIDE-CORRECTIF-041.md`](GUIDE-CORRECTIF-041.md). Sauvegarder et recopier **le dossier `data/`** entre anciennes et nouvelles distributions DOSSIER. Ne rien écrire dans `app.asar`.

## Construction

GitHub Actions utilise `npm install`, `npm test` et `npm run build:win` dans son environnement Windows. Node.js n'est pas requis sur le poste qui utilise le programme. La sortie GitHub est `H5P-Studio-Portable-0.4.1-Windows-DOSSIER`.

## Tests

`npm test` : 70 tests passés dans cet environnement, pas encore de test intégré de l'interface Windows 11 avec le Branching Scenario réel dans cette version.

## Références techniques

- https://h5p.org/library-definition
- https://h5p.org/documentation/developers/h5p-specification
- https://github.com/tunapanda/h5p-standalone
