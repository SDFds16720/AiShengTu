@echo off
REM Run the packed Electron app directly
cd /d "%~dp0"

echo Starting AI Image Studio (Packed Version)...
echo.

if exist "build-output\win-unpacked.tmp\electron.exe" (
    cd build-output\win-unpacked.tmp
    start "" electron.exe
    echo Application started!
    timeout /t 2 /nobreak >nul
) else if exist "build-output\win-unpacked\electron.exe" (
    cd build-output\win-unpacked
    start "" electron.exe
    echo Application started!
    timeout /t 2 /nobreak >nul
) else (
    echo Error: Packed application not found!
    echo Please run package-fixed.bat first.
    pause
)
