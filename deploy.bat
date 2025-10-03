@echo off
REM ──────────────── Déploiement automatique Expo Web → Netlify ────────────────

echo 🚀 Génération du build web avec Expo...
npx expo export:web
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors de l'export web. Abandon.
    pause
    exit /b 1
)

echo ✅ Build web généré dans web-build/

echo 🌐 Déploiement sur Netlify...
netlify deploy --dir=web-build --prod
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors du déploiement Netlify. Abandon.
    pause
    exit /b 1
)

echo 🎉 Déploiement terminé avec succès !
pause
