@echo off
REM Optimize package size
cd /d "%~dp0"

echo ========================================
echo   Package Size Optimization
echo ========================================
echo.

echo [1/4] Analyzing dependencies...
npm ls --depth=0 --prod=true
echo.

echo [2/4] Building optimized production bundle...
call npm run build
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo [3/4] Packaging with optimizations...
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npx electron-builder --win nsis --x64

if errorlevel 1 (
    echo Packaging failed!
    pause
    exit /b 1
)

echo.
echo [4/4] Checking final size...
echo.
dir "build-output\*.exe"
echo.

echo Optimization complete!
pause
