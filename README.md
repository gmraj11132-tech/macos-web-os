# 🍎 macOS Web OS (Apple Sequoia Edition)

> **A Pixel-Perfect, High-Performance Web Operating System engineered in Vanilla Web Technologies.**  
> **Architected & Engineered by [Aryan Raj](https://github.com/gmraj11132-tech)** • *B.Tech CSE (4th Year, 8.0 CGPA) at Techno India University*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://macos-web-os.vercel.app)
[![GitHub Profile](https://img.shields.io/badge/GitHub-gmraj11132--tech-181717?style=for-the-badge&logo=github)](https://github.com/gmraj11132-tech)
[![LinkedIn Profile](https://img.shields.io/badge/LinkedIn-aryanrajcse-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/aryanrajcse)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🌟 Overview & Architectural Philosophy

**macOS Web OS** is an end-to-end simulation of Apple's flagship desktop operating system (**macOS Sequoia 15.0**), running natively in modern web browsers with 60fps animations, zero external framework dependencies, and authentic operating system semantics.

Conceived and engineered by **Aryan Raj**, this project showcases full-stack web engineering, custom window management algorithms, realistic boot loading sequences, an interactive virtual file system, and native integrations with real-world developer profiles and applications.

---

## 🚀 Key Highlights & Features

### 1. 🍎 Authentic Apple Boot Sequence & Login Architecture
- Realistic Apple logo glowing boot sequence with smooth progress interpolation.
- Translucent frosted glass login screen featuring **Aryan Raj**'s profile avatar.
- Integrated lock screen with real-time digital clock and password unlock state.

### 2. 🪟 Desktop Window Management System (WindowManager)
- Draggable window titlebars with boundary constraint detection.
- Functional Apple traffic lights:
  - 🔴 **Close**: Smooth scale & opacity exit animation.
  - 🟡 **Minimize**: Minimizes window to the bottom Dock.
  - 🟢 **Maximize / Fullscreen**: Toggles true viewport expansion with double-click titlebar support.
- Reactive `z-index` layering and active window focus states.

### 3. ⚓ Reactive Dock with Magnification
- Proportional bezier magnification curve on mouse hover.
- Running application indicator dots (`.dock-dot.active`).
- Spring bounce launch animations on app activation.
- Pre-loaded with 18+ high-fidelity applications.

### 4. 🔍 Spotlight Search & Control Center
- Global hotkey `Ctrl + Space` / `Cmd + Space` toggles Spotlight.
- Real-time search across applications, files, and Aryan Raj's biography.
- macOS Control Center with functional Wi-Fi, Bluetooth, AirDrop, Brightness, and Sound sliders.

### 5. 🧑‍💻 Integrated Apps by Aryan Raj

| Application | Features |
|---|---|
| **About This Mac** | Comprehensive interactive dossier detailing **Aryan Raj**'s biography, academic credentials, 12 verified industry certifications (IIT BHU, IBM, Siemens, Tata Forage, etc.), resume viewer/downloader, and hardware specifications. |
| **GitHub App** | Dedicated in-OS client showcasing `@gmraj11132-tech` with live API sync, pinned projects (**ScamShield AI**, **CareerPilot AI**, **Portfolio**), commit stats, and direct repository links. |
| **LinkedIn App** | High-fidelity LinkedIn profile card featuring verified badges, headline, experience, education (Techno India University), and direct 1-click connect actions. |
| **Terminal** | Authentic Unix shell with prompt `aryan@macbook-pro:~ %`, 20+ commands (`ls`, `cd`, `pwd`, `cat`, `mkdir`, `whoami`, `neofetch`, `projects`, `bio`, `contact`, `github`, `linkedin`). |
| **Safari** | Functional web browser with tab management, URL bar, and bookmark navigation. |
| **Calculator** | Full arithmetic computation engine with memory, percentage, negate, and chained operations. |
| **Notes & TextEdit** | Rich text editing with auto-save persistence to `localStorage`. |
| **System Settings** | Live wallpaper switching, accent color customizer, and system preferences. |

---

## 🛠️ Technology Stack

- **Frontend Core:** Semantic HTML5, Modern CSS3 (Grid, Flexbox, Backdrop-Filter, 3D Transforms), Vanilla JavaScript (ES6+ Modules)
- **Typography:** `Inter` (macOS UI), `JetBrains Mono` & `Menlo` (Terminal & Code)
- **Iconography:** Font Awesome 6 Pro / SVG Vectors
- **Backend & API:** Node.js, Express, REST Endpoints, CORS
- **Hosting & CI/CD:** Vercel Edge Network & GitHub

---

## 💻 Running Locally

```bash
# 1. Clone repository
git clone https://github.com/gmraj11132-tech/macos-web-os.git
cd macos-web-os

# 2. Run with Node.js backend
cd server
npm install
node server.js

# 3. Open in browser
# Navigate to http://localhost:3000
```

Or simply open `index.html` in any modern web browser or live server.

---

## 👨‍💻 About The Creator

**Aryan Raj**  
- **Degree:** B.Tech Computer Science & Engineering (4th Year, 8.0 CGPA)  
- **Institution:** Techno India University  
- **Email:** [aryanjaiswal11132@gmail.com](mailto:aryanjaiswal11132@gmail.com)  
- **Phone:** [+91 8340177620](tel:+918340177620)  
- **Location:** Noida, Alpha 2, Uttar Pradesh, India  
- **GitHub:** [@gmraj11132-tech](https://github.com/gmraj11132-tech)  
- **LinkedIn:** [in/aryanrajcse](https://www.linkedin.com/in/aryanrajcse)  

---

## 📄 License

This project is open-source and released under the [MIT License](LICENSE).  
Copyright © 2026 Aryan Raj.
