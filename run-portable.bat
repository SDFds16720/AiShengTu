@echo off
REM Run the portable version
cd /d "%~dp0"

if exist "AI-Image-Studio-Portable\electron.exe" (
    echo Starting AI Image Studio (Portable)...
    cd AI-Image-Studio-Portable
    start "" electron.exe
    echo Application started!
    timeout /t 2 /nobreak >nul
) else (
    echo Error: Portable version not found!
    echo Expected location: AI-Image-Studio-Portable\electron.exe
    pause
)
