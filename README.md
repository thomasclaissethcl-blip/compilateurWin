# H5P Studio Portable 0.4.0 (expérimental)

Application Windows 11 portable (distribution **DOSSIER**), sans Node.js à installer sur le poste de l'utilisateur. Le format EXE auto-extractible n'est plus publié.

## Fonctions disponibles

- Importation et analyse statique de fichiers `.h5p`, diagnostic de dépendances et inventaire des bibliothèques.
- Édition limitée aux fichiers JSON du paquet et réexportation `.h5p` ; pas encore d'éditeur visuel H5P.
- Prévisualisation locale intégrée dans Electron avec H5P Standalone 3.8.2, y compris plein écran sous réserve du contenu.
- Export HTML multifichier avec lecteur inclus, destiné à un serveur HTTP(S) : Moodle (ressource Fichier) ou autre hébergement statique. L'ouverture locale en `file://` ne constitue pas un test valide.
- **Nouveau registre multiversion local** : installation explicite des bibliothèques présentes dans un fichier H5P ouvert ou un paquet `.h5p` / `.zip` local, inventaire des versions, de la provenance, des dépendances et de l'API cœur requise ; coexistence de plusieurs variantes d'une même version si leurs fichiers diffèrent ; enregistrement de préférences de versions associées à l'empreinte SHA-256 de l'archive originale.

## Limites importantes du registre 0.4.0

- Le sélecteur **mémorise un choix de version**, mais **n'applique pas encore cette version** à l'édition, la prévisualisation, l'export `.h5p` ou l'export HTML. Appliquer une autre version requiert la résolution de ses dépendances, des migrations contrôlées et une validation d'exécution.
- Aucun catalogue en ligne n'est encore interrogé. Pour disposer d'une bibliothèque tierce, il faut importer un paquet local valide contenant un `library.json`. Les archives de code source GitHub ne sont pas nécessairement des paquets H5P exploitables.
- Aucun téléchargement automatique d'un nouveau cœur ou d'une nouvelle version des bibliothèques. Le lecteur livré est toujours Standalone **3.8.2**. Sa compatibilité avec une bibliothèque donnée reste à vérifier.
- Le champ `coreApi` représente l'exigence **déclarée par la bibliothèque**. Il ne démontre pas que notre lecteur l'implémente. Nous n'annonçons aucune compatibilité du cœur non vérifiée.
- Les bibliothèques peuvent contenir du JavaScript de tiers : leur importation dans le registre ne les exécute pas, mais leur utilisation future comme contenus actifs devra être contrôlée. N'importer que des sources fiables.
- Un choix de version est associé à l'empreinte du **fichier H5P original**. Si le paquet est modifié puis réenregistré, son empreinte change ; une réassociation pourra être nécessaire.

## Première utilisation du registre

1. Lancez H5P Studio Portable (dossier `win-unpacked`) et ouvrez un `.h5p` de confiance.
2. Dans **Registre multiversion**, utilisez **Enregistrer les bibliothèques du H5P ouvert**. Les fichiers et métadonnées sont copiés dans `data/data/libraries` à côté de l'application. Le fichier H5P importé n'est pas modifié.
3. Pour un paquet récupéré auprès d'un développeur, utilisez **Importer un paquet local .h5p ou .zip**. Son dépôt d'origine est enregistré comme provenance déclarée par l'utilisateur ; H5P Studio ne certifie pas sa signature ni sa qualité.
4. Choisissez un type de bibliothèque puis l'une des versions installées. Cliquez sur **Enregistrer ce choix** pour mémoriser votre préférence pour l'archive ouverte. **Cette préférence ne change pas encore le rendu**.
5. Le registre ne désinstalle ni ne remplace automatiquement une version existante. Un même `machineName` et une même version peuvent être stockés avec des empreintes différentes.

## Compiler sans Node.js sur le poste Windows

1. Publier les sources dans un dépôt privé GitHub ; le fichier `.github/workflows/windows-portable.yml` doit être présent sur la branche principale.
2. Dans **Actions**, lancer **Compiler H5P Studio Windows DOSSIER**.
3. Télécharger `H5P-Studio-Portable-0.4.0-Windows-DOSSIER`, décompresser tous les fichiers et lancer `H5P Studio Portable.exe` dans `win-unpacked`.

Le serveur de prévisualisation est local au poste (`127.0.0.1`) et ne sert pas de plateforme en ligne.

## Développement et tests

```shell
npm install --no-audit --no-fund
npm test
npm run build:win
```

Les tests automatisés utilisent Node.js sur le poste de compilation ou sur GitHub Actions. Ils ne remplacent pas les tests réels sous Windows 11 avec vos fichiers H5P.

Documentation H5P :
- https://h5p.org/library-definition
- https://h5p.org/documentation/developers/h5p-specification

## Pistes suivantes

1. Résolution complète des dépendances des versions choisies, compatibilité cœur/lecteur et migration de données.
2. Connecteurs de catalogue officiel H5P et de sources tierces configurables, avec vérification de provenance et téléchargements explicites.
3. Intégration de l'éditeur visuel H5P et de versions maintenues du cœur/éditeur, avec profils validés et expérimentaux.
4. Exports multimodules, sauvegardes et procédure de retour arrière.
