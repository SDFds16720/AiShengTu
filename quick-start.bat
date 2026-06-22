@echo off
REM Switch to the project directory
cd /d "%~dp0"

title AI Image Studio
color 0A

echo ========================================
echo    AI Image Studio - Quick Start
echo ========================================
echo.

echo [1/2] Checking dependencies...
if not exist "node_modules" (
    echo Error: node_modules not found, please run npm install first
    pause
    exit /b 1
)

echo [2/2] Starting application...
echo.

npx electron .

if errorlevel 1 (
    echo.
    echo Startup failed! Error code: %errorlevel%
    echo.
    echo Possible solutions:
    echo 1. Make sure npm install has been run
    echo 2. Make sure npm run build has been run
    echo 3. Check if antivirus is blocking
    echo.
    pause
)
