# bella-vista

## API Routen

Das Projekt stellt Custom REST API Endpunkte für Apartments bereit:

### Endpunkte

**Alle Apartments abrufen**
```
GET /wp-json/apartments/v1
```

Optional: Filter nach Verkaufsstatus
```
GET /wp-json/apartments/v1?status=Verfügbar
GET /wp-json/apartments/v1?status=Reserviert
GET /wp-json/apartments/v1?status=Verkauft
GET /wp-json/apartments/v1?status=Auf%20Anfrage
```

**Einzelnes Apartment abrufen**
```
GET /wp-json/apartments/v1/{id}
```

### Response-Struktur

```json
{
  "id": 123,
  "title": "Wohnung 2.1",
  "slug": "wohnung-2-1",
  "content": "...",
  "excerpt": "...",
  "date": "2025-12-22T10:00:00+00:00",
  "modified": "2025-12-22T12:00:00+00:00",
  "featured_image": "https://...",
  "details": {
    "level": "2. Etage",
    "rooms": 3,
    "living_space": 75.5,
    "terrace_balcony": 12.5,
    "garden": 0,
    "basement": 8,
    "status": "Verfügbar",
    "price": "CHF 850'000",
    "floor_plan_url": "https://..."
  }
}
```

## Gutenberg Block: Sell Index

Ein Custom Block zum Anzeigen von Apartments im WordPress-Editor.

### Voraussetzungen

- **Advanced Custom Fields (ACF)**: Erforderlich für die Apartment-Felder
- WordPress 6.0+
- PHP 8.0+

### Plugin-Struktur

```
/wp-content/plugins/sell-index/
├── src/
│   └── sell-index/
│       ├── block.json       # Block-Konfiguration
│       ├── edit.js          # Editor-Komponente (React)
│       ├── render.php       # Frontend-Rendering (PHP)
│       ├── view.js          # Frontend-JavaScript
│       └── *.scss           # Styles
```

### Features

- **Automatischer API-Aufruf**: Lädt Apartments automatisch vom REST API Endpunkt
- **Live-Vorschau**: Zeigt Apartments direkt im Block-Editor
- **Tabellenansicht**: Apartments werden übersichtlich in Tabellenform dargestellt
- **Server-Side Rendering**: PHP-basiertes Rendering für bessere Performance
- **React Hooks**: Nutzt moderne WordPress-Komponenten (`useState`, `useEffect`)

### Verwendung

1. Block im Editor einfügen: **Sell Index Block**
2. Block zeigt automatisch alle verfügbaren Apartments
3. Daten werden sowohl im Editor als auch im Frontend geladen

### Entwicklung

```bash
# Block neu kompilieren
cd /wp-content/plugins/sell-index
npm run build

# Watch-Mode für Entwicklung
npm start
```