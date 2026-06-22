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

echo Cleaning build artifacts...

if exist "release" (
    echo Removing release directory...
    rmdir /s /q release
)

if exist "dist" (
    echo Removing dist directory...
    rmdir /s /q dist
)

if exist "dist-electron" (
    echo Removing dist-electron directory...
    rmdir /s /q dist-electron
)

echo.
echo Cleanup complete!
pause
