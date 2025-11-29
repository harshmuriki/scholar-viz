# ScholarPapers React Component

A lightweight, zero-config React component that fetches and visualizes academic papers for any researcher. It aggregates data from Semantic Scholar and OpenAlex to provide a comprehensive list of publications without requiring AI dependencies or API keys for basic usage.

## Features

- 🔍 **Auto-fetch**: Just provide a researcher's name.
- ⚡ **Smart Caching**: Caches results in LocalStorage for 24h to minimize API calls and improve load times.
- 🛠 **Built-in Controls**: Users can sort by citations/year and filter by date range.
- 💾 **State Persistence**: User preferences for sorting and filtering are saved automatically.
- 📱 **Responsive**: Clean, mobile-friendly UI that fits into any web app.
- 🛡 **Robust**: Fallback strategies (Semantic Scholar -> OpenAlex) to ensure data availability.

## Installation

```bash
npm install scholar-papers-react
```

## Usage

Import the component and pass the researcher's name.

```jsx
import React from 'react';
import { ScholarPapers } from 'scholar-papers-react';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1>My Publications</h1>
      
      {/* Basic Usage */}
      <ScholarPapers username="Yoshua Bengio" />
      
      {/* Limit the number of papers initially loaded */}
      <ScholarPapers username="Geoffrey Hinton" limit={10} />
    </div>
  );
}

export default App;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | **Required** | The full name of the researcher to search for. |
| `limit` | `number` | `50` | Maximum number of papers to fetch and display. |

## Data Sources

This component utilizes public academic APIs:
1. **Semantic Scholar** (Primary source)
2. **OpenAlex** (Fallback source)

These are free-to-use APIs. The component handles rate limiting and fallbacks automatically.

## Persistence & Caching

- **Paper Data**: To respect API rate limits and improve performance, paper data is cached in the browser's `localStorage` for 24 hours. A "Refresh Data" button is provided in the UI for users who need immediate updates.
- **UI Settings**: Sort order and year filters are persisted so users don't have to re-configure them on every visit.

## Styling

The component uses Tailwind CSS utility classes. Ensure your project has Tailwind configured, or the styles will degrade gracefully to standard HTML defaults.
