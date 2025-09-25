#!/bin/bash

# Endzeit Survival Game - Deployment Script für Vercel

echo "🎮 Endzeit Survival Game - Deployment Script"
echo "=============================================="

# Prüfen ob Node.js installiert ist
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert. Bitte installiere Node.js 18+"
    exit 1
fi

# Prüfen ob npm installiert ist
if ! command -v npm &> /dev/null; then
    echo "❌ npm ist nicht installiert. Bitte installiere npm"
    exit 1
fi

echo "✅ Node.js und npm sind verfügbar"

# Dependencies installieren
echo "📦 Installiere Dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Fehler beim Installieren der Dependencies"
    exit 1
fi

echo "✅ Dependencies installiert"

# TypeScript-Check
echo "🔍 Führe TypeScript-Check durch..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "❌ TypeScript-Fehler gefunden"
    exit 1
fi

echo "✅ TypeScript-Check erfolgreich"

# Linting
echo "🧹 Führe Linting durch..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Linting-Warnungen gefunden, aber Build wird fortgesetzt"
fi

# Build erstellen
echo "🏗️  Erstelle Production Build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build fehlgeschlagen"
    exit 1
fi

echo "✅ Build erfolgreich erstellt"

# Prüfen ob Vercel CLI installiert ist
if ! command -v vercel &> /dev/null; then
    echo "📦 Installiere Vercel CLI..."
    npm install -g vercel
fi

echo "🚀 Deploye auf Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "🎉 Deployment erfolgreich!"
    echo "🌐 Deine App ist jetzt live auf Vercel!"
else
    echo "❌ Deployment fehlgeschlagen"
    exit 1
fi
