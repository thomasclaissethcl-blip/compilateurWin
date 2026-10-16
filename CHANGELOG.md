# Historique

## 0.3.0, socle intégré Electron, expérimental

- Prévisualisation au sein de l'interface Electron via serveur HTTP sur `127.0.0.1` et iframe isolée.
- Lecteur local inclus automatiquement lors de la construction de l'exécutable ; récupération automatique en mode développement, SHA-512 vérifié.
- Gestion indépendante et versionnée des fichiers du lecteur ; option de récupération depuis un dossier local si besoin.
- Export statique autonome incorporant le lecteur et supprimant les scripts Windows intermédiaires.
- Contrôles de chemins, refus des symlinks au service HTTP et limites sur les archives.
- Tests de génération et de service HTTP ajoutés.
- **Reste à valider :** compilation Windows, interaction H5P réelle dans l'iframe, compatibilité Moodle, intégration de l'éditeur visuel.

## 0.2.1

Correction des chemins Windows des scripts externes (conservés dans l'ancien générateur interne, mais absents des ZIP distribués par Electron 0.3.0).
