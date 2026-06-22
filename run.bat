@echo off
REM Switch to the project directory
cd /d "%~dp0"

echo Starting AI Image Generation Studio...
npx electron .

pause
