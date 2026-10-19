# Appliquer 0.3.2 sur GitHub (sans Node.js)

1. Ouvrir le dépôt GitHub, onglet **Code**.
2. Copier les fichiers du dossier de correctif dans leurs emplacements existants sur GitHub. Pour les fichiers existants, ouvrir le fichier et utiliser **Edit** puis **Commit changes**. Pour le nouveau fichier `runtime/portable-path.cjs`, utiliser **Add file > Create new file**, puis coller son contenu.
3. Vérifier `package.json` et `.github/workflows/windows-portable.yml`, puis cliquer sur **Actions > Compiler le portable Windows > Run workflow**.
4. Une fois la compilation réussie, télécharger la variante **Windows-DOSSIER**, et décompresser tout son contenu avant de lancer l'application.
5. Importer le H5P, lancer **Prévisualiser**, et relever le nouveau message si une erreur JSON subsiste.
6. Pour tester l'export HTML, charger le ZIP décompressé dans la ressource Fichier de Moodle, définir `index.html` comme fichier principal et l'ouvrir par HTTP(S). L'ouverture locale en double-cliquant sur `index.html` est bloquée par la sécurité du navigateur.

À noter : l'application peut être restreinte par les politiques de sécurité de Windows 11 en établissement.
