# EduSync - Smart Student Reminder App

A modern, high-end, mobile-first web application built for students to manage reminders, generate digital ID cards, and track academic tasks. 

## 🚀 Tech Stack
* **Frontend**: HTML5, CSS3, Vanilla JavaScript
* **Animations**: GSAP (GreenSock)
* **Backend/Database**: Supabase
* **Features**: Browser Notification API, PWA (Progressive Web App), Glassmorphism UI.

## 📁 File Structure
- `index.html` (All UI and modals)
- `style.css` (Premium dark mode UI, animations, glassmorphism)
- `script.js` (Supabase logic, GSAP animations, DOM manipulation)
- `manifest.json` (PWA configuration)
- `README.md` (Project documentation)

## 🛠️ Setup Instructions

1. **Clone or Download** all files into a single folder.
2. **Supabase Setup**:
   - Go to [Supabase](https://supabase.com/) and create a new project.
   - Create two tables: `students` and `tasks`.
   - Copy your Project URL and Anon Key.
   - Open `script.js` and replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` at the very top.
3. **Run Locally**:
   - Since this utilizes ES modules and PWA features, you must serve it via a local web server. 
   - If using VS Code, install the **Live Server** extension and click "Go Live" on `index.html`.

## ✨ Features
* **Premium UI**: Fluid animations, dark mode, neon accents, and interactive flip cards.
* **Smart Reminders**: Utilizes the Browser Notification API to ping you when a task is due.
* **Persistent Sessions**: Log in once, stay logged in.

---
*Built entirely without complex frameworks.*
