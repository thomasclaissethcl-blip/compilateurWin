# Feuille de route H5P Studio Portable

## Jalon 1 : importation et intégrité, version 0.1.3, validé sur un cas réel

Lecture des archives, diagnostic statique des dépendances, inventaire et réexport `.h5p` avec modification JSON. Test utilisateur sur Branching Scenario : 2 648 entrées ZIP, 72 bibliothèques, 22 dépendances reconnues, puis réimportation fonctionnelle dans Lumi.

## Jalon 2A : prévisualisation statique préparatoire, version 0.2.1, prototype expérimental (correctif Windows)

Livré : conversion ZIP vers arborescence HTML, préservation des bibliothèques et médias, injection d'une page de lecture et serveur de test local Windows. Le lecteur H5P Standalone doit être fourni séparément. Les scripts Windows et la lecture interactive réelle doivent être testés sur Windows 11. L'application principale ne prévisualise pas encore directement dans son interface.

## Jalon 2B : intégration native, version 0.3.0, code disponible et tests de composants réalisés

- Implémenté dans le code Electron : lancement transparent du serveur HTTP local, prévisualisation intégrée dans une iframe isolée et export ZIP multifichier avec lecteur inclus.
- Préparation du lecteur dès la compilation, contrôlée par SHA-512 npm ; version de lecteur épinglée et séparation de l'adaptateur.
- Contrôle automatique des archives et de la sortie ; aucun script Windows exporté dans le ZIP final.
- **Reste à confirmer sur Windows 11** : compilation, démarrage réel de l'interface, interactions et médias du Branching Scenario de référence, puis validation Moodle.

## Jalon 3 : édition visuelle H5P et création d'activités

- Évaluer les composants maintenus de `@lumieducation/h5p-server` et `@lumieducation/h5p-express`, avec serveur local.
- Récupérer le cœur et l'éditeur H5P avec empreintes, licences et versions explicites.
- Intégrer les formulaires et l'édition des `semantics.json` des bibliothèques.
- Tester le cycle complet créer, ouvrir, modifier, prévisualiser, exporter puis réimporter.

## Jalon 4 : gestionnaire de versions H5P

- Gérer indépendamment les versions du cœur, de l'éditeur, du lecteur et des bibliothèques.
- Installation explicite, multi-version, validation des dépendances et migrations contrôlées.
- Historique, provenance, empreintes et retour arrière.
- Matrice de tests automatiques et validation des nouvelles versions avant activation.

## Jalon 5 : packaging Windows et export multimodule

- Export statique multimodule, mutualisation des bibliothèques et adaptation Moodle `pluginfile.php`.
- Vérification en compte étudiant sur Moodle, sans H5P Moodle et sans remontée de scores.
- Compilation Electron portable Windows 11, stockage voisin de l'exécutable, sauvegardes et sécurité.

## Contrat d'adaptateur à stabiliser

```ts
interface IRuntimeAdapter {
  id: string;
  version: string;
  inspectSupport(archiveManifest: unknown): Promise<{supported: boolean; reasons: string[]}>;
  buildStaticSite(inputs: {packagePaths: string[]; outputDirectory: string}): Promise<{manifestPath: string; warnings: string[]}>;
}
```

Ce contrat est une proposition architecturale, non une API déjà opérationnelle.
