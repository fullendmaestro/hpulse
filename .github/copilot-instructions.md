# Copilot instructions

## Project Overview

This is a monorepo for hpulse, a modular AI system designed to operate within the EVM ecosystem, leveraging a **multi-agent architecture** to handle diverse blockchain interactions efficiently.
Hpulse is a chrome extension that allows users to interact with various EVM-compatible blockchains through specialized AI agents.

## Repository Structure

- **Web** (`apps/web/`): Web interface for hpulse
- **Extension** (`apps/extension/`): Chrome extension interface for the hpulse agent
  - **UI components** (`apps/extension/src/components/ui`): UI components for the extension
  - **Redux store** (`apps/extension/src/store`): Redux store for the extension
  - **Hooks** (`apps/extension/src/hooks`): Custom React Hooks for the extension
- **Agents** (`apps/agents/`): A collection of AI agents systems for hpuls systems

## Development guides and scripts

### Extension:

- To build the chrome extension, run `pnpm run extension:build` from the root directory.

### Agents:

- To start the AI agent, run `pnpm run agent:start` from the root directory.

### Key Technologies

- **TypeScript** everywhere
- **React** for web
- **Redux Toolkit** for state management
- **ADK-ts** for multiagent interaction
- **Others** react-loading-skeleton,

### UI Design

- Professional, minimalist design with a flat design (no gradients or complex textures).
- Use the app's CSS color tokens for theming; avoid using custom colors and palettes. Focus on simplicity and contrast.
- Use the Kanit font for all text.
- Keep the layout clean using a grid or card-based system.
- Focus on content rather than flashy design elements.
- Ensure easy navigation with clear menus.
- Make the site responsive across all devices, so content remains the focus.

### Notes:

- Currently supporting evm testnets
- wallet secrets are currently unencrypted
