# LUMIN FORGE | LuminForge Digital Identity System

## Project Overview
LUMIN FORGE is a cinematic, next-generation interactive web experience designed as a digital identity portal. It moves beyond traditional portfolio structures to express curiosity, ambition, and obsession with technology through immersive UI engineering and 3D atmospheres.

## Tech Stack
- **Framework**: React (Vite)
- **3D Engine**: Three.js via `@react-three/fiber` & `@react-three/drei`
- **Animations**: Framer Motion & GSAP ScrollTrigger
- **Scrolling**: Lenis (Smooth Scroll)
- **Styling**: Tailwind CSS
- **Post-processing**: `@react-three/postprocessing` (Bloom, Noise, Vignette, Chromatic Aberration, Glitch)
- **Audio**: Web Audio API (Spatial Soundscape)

## Core Features
- **Future Core Hero**: A mouse-reactive, 3D energy core with "System Overload" protocol.
- **Neural Link Status Bar**: Real-time connection simulation and time-adaptive glow.
- **Identity Sections**:
  - **Consciousness**: Interest-driven content with parallax glass cards.
  - **Data & Thought**: 3D grid environment with kinetic typography.
  - **Interface Philosophy**: Interactive glass panels with kinetic text assembly and holographic flickers.
  - **Neural Map 2.0**: Interactive 3D graph of interconnected interests.
  - **Vision Forward**: Cinematic typography with volumetric fog and light sweeps.
- **Atmospheric Systems**:
  - **Custom Cursor**: Magnetic glowing orb with spring physics.
  - **System Logs**: Real-time scrolling terminal logs.
  - **Command Terminal**: Hidden console for system stats (FPS, Memory) and overrides.
  - **Spatial Soundscape**: Low-frequency hum that shifts pitch based on scroll velocity.

## Design System
- **Colors**: Deep True Black (#000000), Lumin Red (#ff2a2a), Time-Adaptive Accents.
- **Components**: GlassCard (Glassmorphism with tilt and glow effects).
- **Overlays**: Custom noise grain and cinematic vignette.

## Build & Deployment
- **Build Command**: `npm run build`
- **Optimization**: GPU-accelerated animations, lazy-loaded 3D assets, instanced rendering for particles.
