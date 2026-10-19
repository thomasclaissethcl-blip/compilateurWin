# Version 0.5.0 : premières sources de mises à jour

- Suivi explicite des releases, tags et commits de dépôts GitHub H5P officiels et tiers.
- Sources officielles de lecture, d'édition et de Hub référencées indépendamment de Standalone.
- Ajout / suppression de dépôts tiers avec stockage portable persistant.
- Installation manuelle des pièces jointes `.h5p` / `.zip` publiées dans des releases GitHub de bibliothèques.
- Contrôles sur les URLs, taille des téléchargements, archives et refus d'exécuter automatiquement du code tiers.
- Source de provenance GitHub conservée dans le registre avec ses empreintes des contenus.
- Audit npm informatif dans GitHub Actions.
- **Limitations :** pas de substitution du cœur actif, pas de migration, pas d'éditeur visuel intégré et pas de génération automatique depuis les sources GitHub brutes.
- Tests automatisés : 86 réussis sur ce code source.

---

# Historique des versions

## 0.4.2 (correctif du registre Windows)

- Correction des identifiants HTML dupliqués qui rendaient le rapport invisible et le bouton d'analyse inopérant.
- Installation plus tolérante aux verrouillages Windows : nouvelles tentatives sur `EPERM`/`EACCES`/`EBUSY` puis copie de secours avec métadonnées écrites en dernier.
- Interdiction explicite d'écraser une destination existante mais incomplète.
- Persistance du dernier rapport d'importation et restitution au redémarrage.
- Correction du retour de `canPreview()` sur les situations valides.
- 77 tests automatisés réussis sous Node.js 22 dans l'environnement de développement ; validation sous Windows 11 en attente.

# Historique

## 0.4.1 : diagnostics du registre et résolution statique des dépendances

- Rapport d'importation **manifest par manifest** : nouvelle installation, bibliothèque déjà présente, rejet avec motif précis. Il permet d'enquêter sur les écarts entre le nombre de bibliothèques visibles dans l'archive et les variantes présentes dans le registre.
- Résolveur des dépendances transitives installées ; signalement des versions incompatibles, absentes, préférences incompatibles et variantes concurrentes de même version corrective. Par défaut, les dépendances spécifiques à l’éditeur sont exclues du contrôle d’exécution.
- Identification de la provenance du lecteur lorsque `runtime-source.json` est disponible. L'API exacte du cœur H5P n'est **pas certifiée** par les informations actuelles ; l'interface l'indique explicitement.
- Calcul de la version minimale de l'API cœur déclarée par les bibliothèques retenues ; aucun résultat de « compatibilité vérifiée » n'est annoncé si l'API du lecteur n'est pas attestée.
- Aucune modification du contenu H5P, aucune migration, aucun remplacement du moteur ou de ses bibliothèques. Les options de lecteur et d'export de la version 0.4.0 sont conservées.
- **70 tests automatisés réussis**, dont 11 nouveaux tests de résolution et de diagnostic. Validation Windows 11 et essai du Branching Scenario réel encore nécessaires.

**Non inclus** : vérification exacte du cœur H5P embarqué, récupération de bibliothèques depuis les dépôts des développeurs, application effective des choix aux fichiers et édition H5P visuelle.

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
