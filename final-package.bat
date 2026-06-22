@echo off
REM Final optimized packaging
cd /d "%~dp0"

echo ========================================
echo   Final Optimized Packaging
echo ========================================
echo.

echo [1/4] Cleaning old builds...
if exist "build-output" rmdir /s /q build-output
timeout /t 2 /nobreak >nul

echo [2/4] Building optimized bundle...
call npm run build
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo [3/4] Creating installer...
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npx electron-builder --win nsis --x64

echo [4/4] Removing unnecessary files...
if exist "build-output\win-unpacked\LICENSES.chromium.html" (
    del /f /q "build-output\win-unpacked\LICENSES.chromium.html"
    echo - Removed LICENSES.chromium.html
)

echo.
echo ========================================
echo   Packaging Complete!
echo ========================================
echo.
echo Final size:
dir "build-output\*.exe" | find ".exe"
echo.
echo Installation package: build-output\AI Image Studio Setup 1.0.0.exe
echo.
pause
