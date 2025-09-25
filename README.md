# 🎮 Endzeit Überleben - Point & Click Survival Game

Ein vollständiges Point-and-Click-Survival-Spiel mit Next.js, React und jQuery, das auf Vercel deployt werden kann.

## 🚀 Features

- **Point-and-Click Gameplay**: Interagiere mit Objekten durch Mausklicks
- **Überlebensmechanik**: Gesundheit und Hunger verwalten
- **Crafting-System**: 6 verschiedene Rezepte
- **3 Szenen + versteckte Kapitel**: Erkunde verschiedene Orte
- **Versteckte Objekte**: Finde versteckte Ressourcen
- **Sound-System**: Audio-Feedback für Aktionen
- **Responsive Design**: Funktioniert auf Desktop und Mobile
- **Kapitel-System**: Schalte neue Bereiche frei

## 🛠️ Technologie-Stack

- **Next.js 14**: React Framework für moderne Web-Apps
- **React 18**: UI-Bibliothek
- **jQuery**: DOM-Manipulation und Event-Handling
- **TypeScript**: Typsichere Entwicklung
- **CSS3**: Moderne Styling mit Animationen
- **Vercel**: Deployment-Plattform

## 📦 Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Production Build erstellen
npm run build

# Production Server starten
npm start
```

## 🌐 Deployment auf Vercel

1. **Repository auf GitHub erstellen**
2. **Vercel Account erstellen** (vercel.com)
3. **Projekt importieren** von GitHub
4. **Automatisches Deployment** - Vercel erkennt Next.js automatisch

### Vercel CLI (Alternative)

```bash
# Vercel CLI installieren
npm i -g vercel

# Projekt deployen
vercel

# Production Deployment
vercel --prod
```

## 🎯 Spielanleitung

### Ziel
Überlebe 3 Tage in der Endzeit! Sammle Ressourcen, craft Gegenstände und halte deine Gesundheit und deinen Hunger im grünen Bereich.

### Steuerung
- **Mausklick**: Interagiere mit Objekten
- **I**: Inventar öffnen/schließen
- **C**: Crafting-Panel öffnen/schließen
- **U**: Ausgewähltes Item verwenden
- **S**: Sound ein-/ausschalten
- **H**: Hilfe anzeigen

### Crafting-Rezepte
1. **Messer**: Metall + Stoff
2. **Lagerfeuer**: Holz + Stoff
3. **Verband**: Stoff + Stoff
4. **Werkzeugkasten**: Metall + Holz
5. **Rationen**: Essen + Essen
6. **Funkgerät**: Metall + Metall + Metall

### Tipps
- Jede Nacht reduziert deinen Hunger - ohne Essen stirbst du!
- Klicke auf versteckte Objekte in den Szenen
- Rationen sind effektiver als normales Essen
- Funkgerät schaltet neue Kapitel frei!

## 📁 Projektstruktur

```
├── pages/
│   ├── _app.tsx          # App-Wrapper
│   └── index.tsx         # Hauptspiel-Seite
├── components/
│   ├── Game.tsx          # Hauptspiel-Komponente
│   ├── Scene.tsx         # Szene-Komponente
│   ├── Inventory.tsx     # Inventar-Komponente
│   └── Crafting.tsx      # Crafting-Komponente
├── styles/
│   ├── globals.css       # Globale Styles
│   └── game.css          # Spiel-spezifische Styles
├── lib/
│   ├── game.ts           # Spiel-Logik
│   ├── types.ts          # TypeScript-Typen
│   └── utils.ts          # Hilfsfunktionen
├── public/
│   ├── images/           # Spiel-Assets
│   └── sounds/           # Audio-Dateien
└── package.json
```

## 🔧 Entwicklung

### Neue Features hinzufügen

1. **Neue Szenen**: In `lib/game.ts` erweitern
2. **Neue Items**: Icons und Namen in `lib/types.ts` hinzufügen
3. **Neue Rezepte**: Crafting-System in `lib/game.ts` erweitern
4. **Styling**: CSS in `styles/game.css` anpassen

### Performance-Optimierung

- **Code-Splitting**: Next.js automatisch
- **Image Optimization**: Next.js Image-Komponente
- **Bundle Analysis**: `npm run build` zeigt Bundle-Größe
- **Lazy Loading**: React.lazy() für Komponenten

## 🐛 Debugging

```bash
# Linting
npm run lint

# TypeScript-Check
npx tsc --noEmit

# Build-Errors
npm run build
```

## 📱 Browser-Unterstützung

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork das Repository
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Commits (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## 🎮 Live Demo

[Spiele das Spiel auf Vercel](https://ki-experte-08-7p77f8eu4-davids-projects-995f6adc.vercel.app)

## 📂 GitHub Repository

[**GitHub Repository**](https://github.com/jakupe/KI-Experte-08) - Fork das Projekt und trage bei!

---

**Viel Spaß beim Überleben in der Endzeit!** 🎮🔥
# KI-Experte-08
