# H5P Studio Portable 0.5.0 (expérimental)

Application Windows 11 en distribution **DOSSIER**, construite par GitHub Actions sans installation de Node.js sur le poste utilisateur.

## Fonctions existantes conservées

- Importation, diagnostic, modification JSON et exportation `.h5p`.
- Prévisualisation H5P intégrée avec plein écran (lecteur embarqué H5P Standalone 3.8.2).
- Exportation HTML multifichier autonome pour hébergement HTTP(S) statique, notamment Moodle.
- Registre portable de bibliothèques, plusieurs versions et variantes sans écrasement.
- Analyse statique des dépendances avec API du lecteur non certifiée.

## Nouveauté : sources GitHub (0.5.0)

L'onglet **Sources et mises à jour** référence en permanence les dépôts officiels `h5p/h5p-php-library`, `h5p/h5p-editor-php-library` et `h5p/h5p-hub-client`.

Vous pouvez ajouter des dépôts de **bibliothèques tierces** au format `auteur/depot` ou `https://github.com/auteur/depot`. L'application demande, sur clic, les dernières releases, les tags et le commit récent de la branche par défaut au moyen de l'API publique GitHub. Les résultats sont des **observations**, et non une validation de compatibilité.

Lorsqu'une release du développeur inclut un **paquet `.h5p` ou `.zip` directement en pièce jointe**, vous pouvez le télécharger et l'installer explicitement dans le registre local. Le logiciel vérifie la provenance GitHub, limite la taille, contrôle l'archive et ne remplace jamais les versions existantes.

Les archives de code source brut GitHub **ne sont pas converties automatiquement** en bibliothèque H5P. Certaines nécessitent un processus de compilation spécifique. Les bibliothèques importées ne sont pas automatiquement activées dans un contenu ou dans le lecteur.

Le **cœur officiel H5P** peut être suivi, mais **ni son installation comme moteur actif, ni son remplacement dans l'éditeur ne sont disponibles en 0.5.0**. Ce développement est distinct et plus complexe que l'installation d'une bibliothèque.

## Protection et confidentialité

L'import H5P reste local. L'onglet mises à jour nécessite Internet ; il interroge les dépôts GitHub enregistrés uniquement sur action de l'utilisateur. Les dépôts tiers contiennent potentiellement du JavaScript non fiable. Leur installation est explicite, sans exécution immédiate, et leurs versions sont identifiées par SHA-256 dans le registre. Une empreinte locale **n'est pas une signature du développeur**.

L'API GitHub publique applique des quotas et certaines releases ne proposent aucun paquet directement installable. Les projets privés ou nécessitant une authentification ne sont pas pris en charge.

## Compilation (GitHub, sans Node.js local)

Déposer les sources à la racine du dépôt GitHub, notamment `.github/workflows/windows-portable.yml`. Dans l'onglet Actions, exécuter **Compiler H5P Studio Windows DOSSIER**, puis télécharger l'artefact `H5P-Studio-Portable-0.5.0-Windows-DOSSIER`.

Les données portables sont stockées dans `data/` à côté de l'exécutable. **Sauvegarder le dossier `data/` de la version précédente** avant migration et le recopier application fermée. Les sources personnalisées figurent sous `data/sources/github-sources.json`.

Cette version a été testée automatiquement sur Node.js pour la logique métier ; aucun `.exe` Windows n'a été compilé ou validé ici. La compilation GitHub et le test réel sur Windows 11 restent nécessaires.
