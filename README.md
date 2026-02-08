# Minecraft Clone

A high-performance, feature-rich Minecraft clone prototype built with React, Three.js, and TypeScript. This project explores procedural world generation, voxel physics, and immersive 3D web environments.

## 🚀 Key Features

- **Procedural World Generation**: Infinite-looking world generated using Simplex noise.
- **Biomes**: Includes Forest (trees & grass), Desert (stone/sand), and Lakes (water logic).
- **Advanced Physics Engine**: Custom AABB collision detection with iterative resolution for smooth movement and corner handling.
- **Creative Mode**: Press `F` to toggle flight mode. Ascend with `Space` and descend with `Shift`.
- **Dynamic Interaction**: Build and break blocks using a central crosshair.
- **Heads-Up Display (HUD)**: 2D Hotbar for block selection and a functional Chat interface.
- **Classical Soundscape**: Background music featuring Beethoven's Moonlight Sonata and interactive sound fallbacks.
- **Intelligent Spawn**: Automatically detects the highest surface point to ensure safe spawning.

## 🛠 Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **3D Engine**: [Three.js](https://threejs.org/) via [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- **Utilities**: [@react-three/drei](https://github.com/pmndrs/drei)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Noise**: [Simplex-noise](https://www.npmjs.com/package/simplex-noise)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Testing**: [Playwright](https://playwright.dev/) (E2E) and [Vitest](https://vitest.dev/) (Unit)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sxa101/minecraft-clone.git
   cd minecraft-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright Browsers:**
   ```bash
   npx playwright install --with-deps
   ```

## 🎮 Usage

### Development
Start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
To access from your local network:
```bash
npm run dev -- --host
```

### Production Build
Build the project for production:
```bash
npm run build
```
The output will be in the `dist/` directory.

### Deployment
You can deploy the `dist/` folder to any static site hosting service (e.g., Vercel, Netlify, GitHub Pages).

## ⌨️ Controls

- **WASD**: Move
- **Space**: Jump / Fly Up
- **Shift**: Fly Down
- **F**: Toggle Fly Mode
- **1-8**: Select Block Type
- **Left Click**: Break Block
- **Right Click**: Build Block
- **T**: Open Chat
- **Enter**: Send Chat Message

## 🧪 Testing

### Unit Tests
Run physics and store logic tests:
```bash
npm run test
```

### End-to-End (E2E) Tests
Run full gameplay verification suite:
```bash
npx playwright test
```

---
Built with ❤️ using the Gemini CLI.