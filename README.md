# ✂️ Hairloon — AI-Powered Face Shape & Hairstyle Architect

Hairloon is an immersive, high-fidelity luxury web application integrating **Autonomous Multi-Agent Computer Vision** and real-time **RAG (Retrieval-Augmented Generation) classification** to analyze biometric face structures and recommend optimal hairstyles.

## 🌟 Core Innovations

1. **Biometric Face Shape Analyzer**:
   * Uses real-time webcam captures or uploaded portraits.
   * Multi-modal computer vision evaluates geometric dimensions across the forehead, cheekbones, jawline, and face length ratio.
   * Classifies profiles into **7 primary face shapes**: *Oval, Round, Square, Heart, Diamond, Oblong, or Pear*.

2. **Hairstyle Trend Catalog & Virtual Try-On**:
   * Interactive directory containing custom styled lobs, cascading beach waves, voluminous shags, curtain fringes, and textured pixies.
   * Filters for hair length (Short, Medium, Long) and texture suitability.
   * **Virtual Try-on Mirror**: Overlays specific hairstyle vectors precisely onto user-uploaded portraits or snapshots!

3. **Autonomous Partner Salon Scheduler**:
   * Simulates a booking engine connected to top-tier physical salons (e.g. *Aura Luxe Hair Lounge*, *Botanical Hair Garden*).
   * Fully customizable appointment tickets: Select date, select hour, and choose specialized stylists (e.g. *Master Stylist Genevieve*).
   * Direct ticket receipt rendering stored securely via **localStorage** persistence.

4. **Madame Simone AI Stylist (Conversational RAG Agent)**:
   * Real-time custom-tailored chat assistant.
   * Feeds the user's analyzed biometric data directly into the agent's contextual memory, allowing Madame Simone to offer custom product formulas, coloring choices, and maintenance schedules.

---

## 🛠️ Technical Stack & Architecture

* **Frontend**: React 18 with Vite, styled elegantly with **Tailwind CSS**.
* **Interactions**: Animated transitions and sliding indicators managed via **motion/react**.
* **Biometric Model**: Gemini Computer Vision model pipeline via secure server-side proxy `/api/generate` with dynamic fallback routing.
* **Storage Engine**: Unified client-side local storage preserving all active bookings and analyzed face profiles securely across browser reloads.
