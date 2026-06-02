# 🦷 Bright Smile Dental - Web Booking App

A modern, fast, and highly interactive web application developed for managing and booking dental clinic appointments. Designed with a patient-first approach, it offers real-time scheduling, transparent price simulation, and automated clinical assistance.

This project is part of a professional web development portfolio that demonstrates the creation of dynamic, high-performance user interfaces (UIs).

## ✨ Key Features

* **🗓️ Interactive Booking Engine:** A 60-second scheduling flow featuring visual date and time selection, data validation, and local state integration.
* **💳 Transparent Price Simulator:** An interactive calculator that allows patients to estimate their copays based on their specific coverage type (Out-of-Pocket, Membership, or Insurance).
* **🤖 Quick Symptom Consultation:** A built-in assistant system that reads user queries and provides immediate clinical recommendation alerts.
* **🌓 Dark/Light Mode Support:** Seamless transitions between light and dark themes, managed globally to enhance visual accessibility.
* **💾 Local State Management:** Persistence of booked appointments and user reviews utilizing `localStorage`.
* **📅 Calendar Integration (.ics):** Native generation and downloading of calendar files so users can save their reservations directly to their personal devices.
* **📱 Responsive Design:** A modular structure built with Bento Grids, ensuring flawless display across mobile, tablet, and desktop devices.

## 🛠️ Technologies & Tools

* **Frontend:** React (v18), TypeScript
* **Styling:** Tailwind CSS (featuring advanced CSS variable configuration and glassmorphism design).
* **Animations:** Motion / Framer Motion for smooth component transitions.
* **Iconography:** Google Material Symbols.
* **Deployment & Version Control:** Ready for deployment on platforms like Netlify and synchronization via GitHub.
* **Runtime Environment:** Node.js, npm.

## 🚀 Installation & Local Execution

Follow these steps to clone the project and run it in your local environment:

1. **Clone the repository:**
   
        git clone https://github.com/Jeruwu/bright-smile-dental.git
        cd bright-smile-dental

2. **Install dependencies:**
   Make sure you have Node.js and npm installed on your system.
   
        npm install

3. **Start the development server:**
   
        npm run dev

   The project will be available locally, typically at `http://localhost:5173` or the port assigned by your environment.

## 📁 Project Structure

The code architecture is modularly divided to facilitate scalability:

* `src/App.tsx`: Main router and global state manager (Dark Mode, Appointments, Views).
* `src/types.ts`: Static TypeScript interface definitions (Appointment, Review, Service).
* `src/components/`:
    * `TopNavBar.tsx`: Main navigation featuring theme detection and an appointment notification counter.
    * `LandingView.tsx`: Home view with the services layout (Bento grid), testimonials, and symptom assistant.
    * `BookingView.tsx`: Interactive calendar engine and secure registration form.
    * `MyBookingsView.tsx`: User management panel to review and cancel appointments, or download `.ics` reminders.
    * `InteractiveCalculator.tsx`: Logical module for calculating and projecting treatment costs.

## 👤 Author

**Jeremy Rubén Cañarte Ayón** Developer focused on building efficient, scalable digital solutions.