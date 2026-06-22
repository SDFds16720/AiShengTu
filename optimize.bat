@echo off
REM Complete optimization and packaging
cd /d "%~dp0"

echo ========================================
echo   Size Optimization and Packaging
echo ========================================
echo.

echo [1/5] Cleaning old builds...
if exist "build-output" rmdir /s /q build-output
if exist "dist" rmdir /s /q dist
if exist "dist-electron" rmdir /s /q dist-electron
timeout /t 2 /nobreak >nul

echo [2/5] Building application...
call npm run build
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo [3/5] Packaging application...
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npx electron-builder --win nsis --x64
if errorlevel 1 (
    echo Packaging failed!
    pause
    exit /b 1
)

echo [4/5] Optimizing language files...
node post-build-optimize.js

echo [5/5] Creating optimized installer...
echo.
echo Final package size:
dir "build-output\*.exe"
echo.

echo ========================================
echo   Optimization Complete!
echo ========================================
pause
