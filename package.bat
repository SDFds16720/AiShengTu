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

echo Packaging AI Image Generation Studio...
echo.

REM Clean old package files
if exist "release" (
    echo Cleaning old package files...
    rmdir /s /q release
    timeout /t 3 /nobreak >nul
)

if exist "release" (
    echo Warning: Cannot delete release directory
    echo Trying to continue...
)

REM Build Vite project
echo [1/3] Building Vite project...
call npm run build
if errorlevel 1 (
    echo Error: Vite build failed
    pause
    exit /b 1
)

REM Run electron-builder
echo [2/3] Packaging Electron app...
call npx electron-builder --win nsis --x64
if errorlevel 1 (
    echo Error: Electron packaging failed
    pause
    exit /b 1
)

echo.
echo [3/3] Packaging complete!
echo Executable location: release\
echo.
pause
