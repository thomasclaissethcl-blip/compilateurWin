# H5P Studio Portable 0.5.2

## Ajouts

- Journal local des téléchargements de sources et installations depuis les releases, avec succès/erreur, commit, horodatage et persistence limitée à 120 opérations.
- Feedback immédiatement sous l'action « Examiner cette révision », avec SHA-256 et résultat.
- Bouton d'ouverture du `source.zip` dans l'Explorateur Windows et affichage des sources du cœur enregistrées.
- Registre des révisions du cœur téléchargées : **sources conservées uniquement, aucune activation ou compatibilité prétendue**.
- Remplacement de `build-game-map.yml` par `build-h5p-libraries.yml` et un runner générique de recettes révisées. Une recette Game Map est fournie, sans couplage du moteur.
- Tests du journal, du cœur non activé, de la validation des références Git et de la recette.

## Limites

- Pas d'éditeur visuel, ni de remplacement du cœur actif.
- La compilation distante est initiée manuellement depuis GitHub Actions ; elle n'est pas encore directement déclenchable depuis H5P Studio.
- Les recettes doivent être relues et ajoutées explicitement. Les dépôts tiers ne sont pas exécutés arbitrairement.
