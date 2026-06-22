@echo off
REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Please run this script as Administrator!
    echo Right-click this file and select "Run as administrator"
    pause
    exit /b 1
)

REM Switch to the project directory
cd /d "%~dp0"

echo Packaging AI Image Studio with NSIS format...
echo.

REM Clean old package files
if exist "build-output" (
    echo Cleaning old package files...
    rmdir /s /q build-output
    timeout /t 2 /nobreak >nul
)

if exist "release" (
    rmdir /s /q release
)

REM Build Vite project
echo [1/3] Building Vite project...
call npm run build
if errorlevel 1 (
    echo Error: Vite build failed
    pause
    exit /b 1
)

REM Run electron-builder with NSIS format
echo [2/3] Packaging Electron app with NSIS...
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npx electron-builder --win nsis --x64
if errorlevel 1 (
    echo Error: Electron packaging failed
    echo.
    echo Possible solutions:
    echo 1. Temporarily disable antivirus software
    echo 2. Close all programs accessing the project directory
    echo 3. Try running as Administrator
    pause
    exit /b 1
)

echo.
echo [3/3] Packaging complete!
echo Installer location: build-output\
echo.
dir build-output\*.exe
pause
