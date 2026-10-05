# A Game Made for the Basis China 2025 Network Hackathon available at [hg.richardsblogs.com](https://hg.richardsblogs.com)
## Overview
It is an immersive, browser-based fantasy game where players pilot an orb to collect elemental orbs, triggering reactions to score points. The objective is to reach 10,000 points as quickly as possible by navigating a dynamic terrain and strategically combining elements. Inspired by *Flappy Bird* for its gameplay mechanics and *Genshin Impact* for its elemental reaction system, the game offers intuitive controls, engaging visuals, and a rich audio experience.
## Features
- **Elemental Reactions**: Collect orbs of different elements to trigger reactions, each providing unique point bonuses.
- **Dynamic Terrain**: Navigate a procedurally generated landscape with a scrolling sky and terrain.
- **Responsive Controls**: Supports both keyboard and touch inputs for vertical movement and speed adjustments.
- **Audio Integration**: Utilizes Tone.js for sound effects and MIDI-based background music to enhance immersion.
- **Cross-Device Compatibility**: Optimized for desktop and mobile devices with responsive design and touch controls.
- **Endgame Metrics**: Displays total score, time taken, and reaction statistics upon reaching 10,000 points.
## Installation
To run it locally, follow these steps:
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/richie-rich90454/HackathonGame.git
   cd HackathonGame
   ```
2. **Install Dependencies**:
   Ensure Node.js is installed, then run:
   ```bash
   npm install
   ```
3. **Start the Server**:
   The game uses Go with the Fiber web framework to serve the built files. Ensure Go is installed, then build the frontend and run the server with:
   ```bash
   npm run build
   npm start
   ```
   The server will start at `http://localhost:6008`.
4. **Access the Game**:
   Open a web browser and navigate to `http://localhost:6008`.
## Dependencies
- **Node.js**: Required to build the frontend with Vite.
- **Go**: Hosts the Fiber web server that serves the game files.
- **Fiber**: Web server framework for serving game files.
- **Vite**: Bundles the frontend into `dist`.
- **jQuery**: Handles DOM manipulation and touch controls.
- **Tone.js**: Powers audio effects and music playback.
- **@tonejs/midi**: Processes MIDI files for background music.
## File Structure
- `src/index.html`: Main game interface with canvas, modals, and controls.
- `src/rules.html`: Detailed game rules and mechanics.
- `src/style.css`: Shared styling for the game pages.
- `src/script.ts`: Core game logic, including rendering, physics, and reactions.
- `src/bgm.ts`: Background music handling with Tone.js and MIDI.
- `src/midi.ts`: The soundtrack embedded as a data URI, generated from `public/hackathon_game.mid`.
- `vite.config.ts`: Vite build configuration (both pages, relative asset URLs).
- `main.go`: Go/Fiber server that serves the built files from `dist`.
- `public/NotoSans-VariableFont_wdth_wght.ttf`, `public/EBGaramond-VariableFont_wght.ttf`: Custom fonts for styling.
- `public/hackathon_game.mid`: MIDI source for the background music.
- `public/favicon.svg`: Vector logo, the primary icon for modern browsers.
- `public/favicon.ico`, `public/favicon-16.png`, `public/favicon-32.png`, `public/favicon-48.png`, `public/favicon-64.png`, `public/favicon-192.png`, `public/favicon-512.png`, `public/favicon.png`, `public/apple-touch-icon.png`: Raster logo sizes generated from `favicon.svg` for older browsers, iOS and web manifests.
- `public/safari-pinned-tab.svg`: Monochrome icon for Safari pinned tabs.
- `public/robots.txt`: Crawler rules, points at the sitemap.
- `public/sitemap.xml`: Sitemap for both pages.
- `public/site.webmanifest`: Web app manifest so the game can be installed.
## Usage
1. **Start the Game**:
   - On load, a modal welcomes players with instructions.
   - Click "Begin the Journey with Wonder!" to start.
2. **Controls**:
   - **Keyboard**:
     - `W` / `S`: Move up/down.
     - `-` / `A`: Decrease max speed.
     - `=` / `+` / `D`: Increase max speed.
   - **Touch**:
     - Swipe up/down or tap ▲/▼ for vertical movement.
     - Tap `-` / `+` to adjust speed.
3. **Gameplay**:
   - Collect elemental orbs to gain points and trigger reactions.
   - Reactions (e.g., Vaporize, Overload) provide bonus points based on their type (amplifying, transformative, catalyze, or status).
   - Reach 10,000 points to win and view game metrics.
4. **Rules**:
   - Access detailed rules via the "Rules" link or at `/rules.html`.
## Development
- **Canvas Rendering**: Uses HTML5 Canvas for rendering the sky, terrain, player orb, and elemental orbs.
- **Elemental System**: Implements a reaction system inspired by *Genshin Impact*, with 15 unique reactions.
- **Responsive Design**: Uses CSS media queries and `clamp()` for scalability across devices.
- **Audio**: Tone.js generates sound effects for orb collection and reactions; MIDI-based music loops in the background.
- **Autoplay Policy**: Tone.js is imported on the first pointer or key interaction, so the browser allows the AudioContext to start and no autoplay warning is logged.
- **Offline / Local Copies**: Everything (fonts, logo, music, scripts) is served from this repository, and asset URLs are relative, so a built copy also works straight from disk.
- **Server**: Go/Fiber serves the built files from `dist`, revalidating pages and caching fingerprinted assets.
## License
This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
## Acknowledgments
- Inspired by *Flappy Bird* for its simple yet addictive gameplay.
- Elemental reaction system adapted with modification from *Genshin Impact*.
- Fonts: Noto Sans and EB Garamond.
- Libraries: jQuery, Tone.js, Midi.js.
