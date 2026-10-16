# H5P Studio Portable 0.3.0 (Windows 11)

**Statut : code source de développement, pas un `.exe` prêt à lancer.** Cette livraison ajoute la prévisualisation intégrée et l'export autonome dans la couche Electron. Le binaire Windows n'a pas été compilé ni testé dans l'environnement de création : il ne permet pas de télécharger les dépendances npm/Electron. Les tests Node de l'assemblage des fichiers et du serveur local ont été réalisés.

## Fonctionnement prévu dans l'exécutable

1. Importer un `.h5p` (par exemple Branching Scenario).
2. Lire le diagnostic des bibliothèques et modifier éventuellement `content/content.json` et `h5p.json`.
3. Dans **Prévisualisation intégrée**, cliquer sur **Prévisualiser l'activité** : un lecteur H5P s'affiche dans une iframe à l'intérieur de la fenêtre Electron. Le serveur HTTP est démarré automatiquement sur 127.0.0.1, avec un port éphémère ; aucun fichier `.cmd` ni PowerShell n'est nécessaire.
4. Cliquer sur **Exporter HTML multifichier** : le ZIP est enregistré dans le répertoire `exports/`, **avec** les fichiers du lecteur, du cœur H5P et des bibliothèques de l'archive. Les anciens scripts de préparation sont retirés automatiquement du ZIP final.
5. **Exporter en .h5p** demeure disponible. Tous les fichiers binaires d'origine sont conservés par l'outil de conversion, en dehors des deux JSON édités.

La prévisualisation et l'export nécessitent un lecteur H5P local. Dans un exécutable construit avec la procédure ci-dessous, le lecteur est **embarqué au moment de la compilation**. Sinon, en mode développement, le programme tente de télécharger automatiquement la version épinglée 3.8.2 lors de la première opération, puis la conserve localement. En cas d'impossibilité réseau, l'interface propose de sélectionner un dossier `player/` déjà présent sur l'ordinateur.

## Construction du `.exe` portable sur Windows 11

**Prérequis pour la compilation uniquement :** Node.js 22+ et npm, connexion Internet et droits d'exécution permettant la construction locale. **L'utilisateur final de l'exécutable n'aura besoin ni de Node.js, ni de npm, ni de PowerShell, ni d'une installation de serveur.**

Décompresser les sources, puis lancer `CONSTRUIRE-WINDOWS.cmd`. Le script exécute :

```powershell
npm install --no-audit --no-fund
npm test
npm run build:win
```

`npm run build:win` prépare d'abord un lecteur H5P Standalone 3.8.2 **dont le SHA-512 est vérifié à partir des métadonnées du registre npm**, puis exécute `electron-builder --win portable --x64`. L'exécutable visé est `dist/H5P-Studio-Portable-0.3.0-x64.exe`.

Si l'étape de compilation échoue, le script affiche le code d'erreur. Aucun exécutable n'est prétendu utilisable avant un test réel sous Windows 11.

Alternative : `.github/workflows/windows-portable.yml` permet une compilation à la demande avec GitHub Actions dans un dépôt vous appartenant. Elle n'impose pas Node.js sur votre poste, mais nécessite de déposer les sources dans le dépôt et d'avoir accès aux Actions.

## Architecture du projet

```text
index.html, assets/      Interface et convertisseur H5P déjà éprouvé en 0.1.3
runtime/player-manager.cjs  Installation versionnée + intégrité SHA-512
runtime/studio-site.cjs     Assemblage des ZIP et serveur de prévisualisation
runtime-bundled/3.8.2/     Lecteur téléchargé à la compilation (non inclus dans ces sources)
electron/main.cjs           Orchestrateur natif, stockage, exports, serveur intégré
electron/preload.cjs        API limitée à la fenêtre principale
scripts/fetch-player.cjs   Préparation du lecteur lors de la compilation
tests/                     Tests Node (pas de tests Electron Windows)
```

Après compilation, l'application est portable : l'exécutable et les répertoires `data/` et `exports/` sont conservés près de l'exécutable, si celui-ci se trouve dans un dossier accessible en écriture. Les prévisualisations temporaires sont supprimées à la fermeture.

## Ce qui est validé et ce qui ne l'est pas

| Fonction | Statut |
|---|---|
| Import/diagnostic/réexport `.h5p` | Déjà validé sur RIS503-Mission3.h5p par l'utilisateur avec 0.1.3 |
| Génération ZIP intégrant des fichiers de lecteur factices | Test Node réussi |
| Absence de `.cmd`/PowerShell dans le ZIP final | Test Node réussi |
| HTTP loopback et lecture des ressources | Test Node réussi |
| SHA-512 npm et extraction TAR | Code écrit ; testé localement avec TAR synthétique uniquement |
| Compilation et lancement Windows 11 | **Non testé** |
| Prévisualisation réelle dans Electron / iframe | **Non testée** |
| Export produit par l'exécutable testé dans Moodle | **Non testé** |
| Compatibilité avec les dernières bibliothèques H5P | **Non garantie** : lecteur Standalone 3.8.2 |
| Création/modification via l'éditeur visuel officiel | **Pas encore développée** : édition JSON uniquement |
| Mise à jour du cœur/éditeur et bibliothèques via interface | **Pas encore développée** |

## Limites et sécurité

- Le projet reprend temporairement **H5P Standalone 3.8.2** pour la lecture, sans le présenter comme le moteur H5P le plus récent. L'architecture du lecteur est séparée de l'import/export afin de le remplacer plus tard.
- Le site exporté est destiné à une diffusion HTTP(S) statique. L'ouverture par double-clic sur `index.html` avec `file://` peut échouer en raison des restrictions du navigateur. Sur Moodle, il faudra encore vérifier le traitement des URLs `pluginfile.php`, des fichiers JavaScript, des chemins relatifs et des iframes.
- Les scripts H5P importés sont exécutés durant la prévisualisation dans une iframe d'origine distincte, sans accès Node.js. **N'importer que des activités et bibliothèques de confiance.** Ce prototype n'a pas été audité pour un déploiement institutionnel.
- Les téléchargements du lecteur sont limités à `registry.npmjs.org`, version fixée, et protégés par comparaison SHA-512. Les bibliothèques H5P contenues dans les fichiers importés ne sont pas vérifiées par signature indépendante.
- Electron suit `contextIsolation:true`, `sandbox:true`, `nodeIntegration:false`. Les requêtes du serveur de lecture sont limitées à `127.0.0.1` et aux fichiers du site temporaire ou du lecteur.
- **Aucun score ni note n'est transféré à Moodle.** L'activité est conçue pour l'interactivité seule.
- La conversion volumineuse se fait encore en mémoire : prévoir une mémoire disponible suffisante pour les archives proches de la limite de 250 Mo.

## Licences

Code original du prototype : MIT. JSZip conserve sa licence MIT/GPL, dans `assets/LICENSE-JSZip.md`. Le lecteur H5P Standalone est un projet MIT à télécharger au moment de la compilation. Chaque bibliothèque H5P conserve sa licence propre. L'intégration ultérieure des composants de Lumi nécessitera de respecter leurs licences propres, notamment GPL/AGPL selon le composant retenu.

Ressources : https://github.com/tunapanda/h5p-standalone ; https://www.electronjs.org/docs/latest/tutorial/security ; https://www.electron.build/docs/features/multi-platform-build/
