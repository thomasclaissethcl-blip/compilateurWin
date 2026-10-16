@echo off
setlocal
cd /d "%~dp0"
echo === Construction de H5P Studio Portable 0.3.0 ===
where npm >nul 2>nul
if errorlevel 1 (
 echo Node.js et npm sont necessaires uniquement pour construire l'executable.
 echo Installez Node.js 22 ou plus sur le poste de compilation, puis recommencez.
 pause
 exit /b 1
)
call npm install --no-audit --no-fund
if errorlevel 1 goto :fail
call npm test
if errorlevel 1 goto :fail
call npm run build:win
if errorlevel 1 goto :fail
echo.
echo Construction terminee. Consulter le dossier dist\.
pause
exit /b 0
:fail
echo.
echo La construction a echoue. Voir les messages ci-dessus.
pause
exit /b 1
