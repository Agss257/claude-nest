# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS TypeScript application - a progressive Node.js framework for building efficient, scalable server-side applications.

## Build and Development Commands

### Development
- `npm run start:dev` - Start in watch mode (auto-reload on changes)
- `npm run start:debug` - Start in debug mode with watch
- `npm run start` - Start without watch mode
- `npm run start:prod` - Start production build from dist/

### Build
- `npm run build` - Compile TypeScript to JavaScript in dist/
- Build output directory: `dist/`

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:debug` - Run tests in debug mode

### Code Quality
- `npm run lint` - Lint and auto-fix TypeScript files
- `npm run format` - Format code with Prettier

## Architecture

### Core Structure
- **Entry point**: `src/main.ts` - Bootstraps NestJS application on port 3000 (or PORT env var)
- **Root module**: `src/app.module.ts` - Imports modules, declares controllers and providers
- **Module pattern**: NestJS uses a modular architecture where each module encapsulates related components

### TypeScript Configuration
- Target: ES2021, CommonJS modules
- Decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`)
- `strictNullChecks: true` but `noImplicitAny: false`
- Base URL set to project root for imports

### Testing
- Unit tests: `*.spec.ts` files alongside source code in `src/`
- E2E tests: Located in `test/` directory
- Test framework: Jest with ts-jest transformer
- Coverage collected from all TypeScript files

### ESLint Setup
- Uses TypeScript ESLint with recommended type-checked config
- Prettier integration for formatting
- Custom rules:
  - `@typescript-eslint/no-explicit-any`: off
  - `@typescript-eslint/no-floating-promises`: warn
  - `@typescript-eslint/no-unsafe-argument`: warn

## NestJS CLI
The project uses NestJS CLI (`@nestjs/schematics`) to generate modules, controllers, services, etc. Source root is `src/`.
