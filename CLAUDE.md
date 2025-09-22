# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Aaron McCarthy's personal website - a static GitHub Pages site built with vanilla HTML, CSS, and JavaScript. The site features a clean, minimal design with dark/light theme support.

## Architecture

### File Structure
- `/` - Root contains main `index.html` homepage
- `/about/`, `/resume/`, `/contact/` - Individual page directories with their own `index.html`
- `/assets/` - Contains shared CSS (`style.css`) and JavaScript (`site.js`)
- `/images/` - Static image assets including avatar and project screenshots
- `.nojekyll` - Disables Jekyll processing for GitHub Pages

### Core Components

**Theme System**: CSS custom properties in `:root` and `[data-theme="light"]` define color schemes. JavaScript in `site.js` handles theme persistence and system preference detection.

**Responsive Layout**: CSS Grid and Flexbox with mobile-first approach. Breakpoint at 768px for tablet/desktop layouts.

**Interactive Features**:
- Theme toggle with localStorage persistence
- Email copy-to-clipboard functionality
- Scroll-triggered reveal animations using IntersectionObserver
- Horizontal scrolling project gallery

## Development

### No Build System
This is a pure static site with no build process, package manager, or dependencies. Files are served directly.

### Making Changes
- Edit HTML files directly for content updates
- Modify `/assets/style.css` for styling changes
- Update `/assets/site.js` for interactive behavior
- Images go in `/images/` directory

### Deployment
The site deploys automatically via GitHub Pages when changes are pushed to the main branch.

### Testing
Test locally by serving the directory with any static file server:
```bash
python -m http.server 8000
# or
npx serve .
```

## Key Patterns

**CSS Variables**: All colors and common values use CSS custom properties for consistent theming.

**Progressive Enhancement**: JavaScript features degrade gracefully. Site remains functional without JavaScript.

**Performance**: Minimal JavaScript, optimized images, and clean CSS for fast loading.