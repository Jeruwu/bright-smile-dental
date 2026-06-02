# Bright Smile Dental 🦷✨

A premium, production-ready dental clinic web application designed around transparency, accessibility, and modern patient comfort. This platform simplifies clinical onboarding through dynamic scheduling and proactive customer features.

## 🚀 Key Features

* **Interactive Transparent Pricing Calculator:** Features an on-the-fly copay estimator allowing patients to dynamically toggle procedures and compare standard retail rates with custom membership/insurance coverage models.
* **Autonomous Symptom Orientation System:** An intuitive diagnostic consultation interface that matches user text patterns (e.g., pain, whitening, checkups) to instantly deliver personalized, overlay-driven clinical recommendations and auto-fill booking intents.
* **60-Second Scheduling Engine:** A robust, state-driven visual calendar builder to book individual or complex family block slots (simultaneous hygienist scheduling) without administrative overlap.
* **Fully Synced Persistence:** Architecture seamlessly tied to `localStorage` to retain client state, scheduled appointments, and dynamic custom reviews across browser sessions.
* **Adaptive Theme Orchestration:** Contextual dark mode implementation with seamless transition physics built on Tailwind v4 CSS variables.

## 🛠️ Tech Stack & Architecture

* **Core Framework:** React 19 (Strict Mode)
* **Type Safety:** TypeScript
* **Styling Engine:** Tailwind CSS v4 (utilizing explicit `@theme` CSS variable overrides for structural UI values)
* **Animation System:** Framer Motion (`motion/react`) for smooth component entries and spatial transitions.
* **Iconography:** Google Material Symbols Outlined

## 📦 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── TopNavBar.tsx              # Adaptive navigation bar with dark mode toggle
│   │   ├── LandingView.tsx            # Main hero layout, symptom advisor, & testimonial engine
│   │   ├── InteractiveCalculator.tsx  # Dynamic financial calculator and pricing map
│   │   ├── BookingView.tsx            # State-driven calendar engine and client validation form
│   │   ├── MyBookingsView.tsx         # Active booking tracking, .ics file downloader, & cancellation flows
│   │   └── Footer.tsx                 # Compliance and statutory policy directory
│   ├── types.ts                       # Explicit contract structures for App state models
│   ├── index.css                      # Modern Tailwind configuration and asset font imports
│   ├── main.tsx                       # Client-side root rendering pipeline
│   └── App.tsx                        # Global layout orchestration and state engine
