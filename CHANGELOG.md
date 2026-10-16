# Changelog

## 0.3.3 (correctif)

- Corrige le chemin double `//h5p.json` dans la prévisualisation locale : le serveur reconnaît maintenant la ressource JSON et ne renvoie plus `index.html` à sa place.
- Prépare les chemins de H5P Standalone sans `/` final, selon son mécanisme d’ajout de chemins relatifs.
- Retire l’en-tête de titre et le message « lecteur initialisé » des ZIP HTML de production ; un message ne s’affiche qu’en cas d’erreur.
- Conserve le format DOSSIER qui a démarré en 10 secondes sur le poste de test.
- Conserve le lecteur versionné 3.8.2. La compatibilité des autres activités reste à valider.
- Tests de non-régression supplémentaires sur les URL avec double slash et l’absence de bandeau.

## 0.3.2 et versions précédentes

Voir l’historique Git du projet si disponible.
