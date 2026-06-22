@echo off
setlocal

REM Set electron cache directory
set ELECTRON_CACHE=%LOCALAPPDATA%\electron\Cache
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/

echo Using Electron cache: %ELECTRON_CACHE%
echo.

REM Build and package
call npm run build
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Starting packaging...
call npx electron-builder

echo.
echo Package completed!
pause
