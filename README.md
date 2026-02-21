# 💡 SparkLamp Web Controller

**SparkLamp** is an intelligent, physical desktop companion robot driven by **Google's Gemini Multimodal Live API**.

This project is the **Web Controller** (Upper Computer) that runs in your browser. It acts as the bridge between the user, the AI brain, and the physical hardware. It processes real-time audio/video, communicates with the Gemini API, and sends motor commands to an ESP32-based lamp via MQTT.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/built%20with-React%20%2B%20Vite-61DAFB.svg)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20Multimodal-8E75B2.svg)

## 🌟 Features

*   **🗣️ Real-time Voice Conversation:** Low-latency, interruptible voice chat using Gemini Live API (WebSockets).
*   **🤖 Embodied AI:** The AI "controls" the physical lamp. It can nod, shake its head, dance, and look around based on the conversation context.
*   **👀 Vision Capabilities:** (Optional) Integrates with **LiveKit** to stream your webcam to the AI, allowing it to "see" you.
*   **⚡ Serverless Architecture:** Runs entirely in the browser. API keys are stored locally in your browser, so no backend server is required.
*   **📡 IoT Control:** Uses MQTT over WebSockets (WSS) to communicate with the physical ESP32 hardware.

## 🏗️ Architecture

1.  **The Brain (Gemini):** Processes audio/video input and generates speech + tool calls (actions).
2.  **The Transport (LiveKit):** Handles real-time video/audio streaming (optional).
3.  **The Hands (MQTT):** The web app sends commands (e.g., `nod`, `wake_up`) to an MQTT Broker (e.g., EMQX).
4.  **The Body (ESP32):** The physical lamp subscribes to the MQTT topic and executes servo movements.

## 🚀 Getting Started

### Prerequisites

You need the following API keys:
1.  **Google Gemini API Key:** Get it from [Google AI Studio](https://aistudio.google.com/).
2.  **LiveKit URL & Keys (Optional):** If you want video capabilities, sign up at [LiveKit Cloud](https://livekit.io/).
3.  **MQTT Broker:** The app defaults to `broker.emqx.io` (public), but you can use your own.

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/sparklamp-web-controller.git
    cd sparklamp-web-controller
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in Browser:**
    Navigate to `http://localhost:3000`. You will see a settings modal to enter your API keys.

## 📦 Deployment (Vercel)

This project is optimized for Vercel.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Vercel will detect the **Vite** preset automatically.
4.  Click **Deploy**.

Once deployed, simply open the URL, enter your API keys in the settings UI, and connect!

## 🔧 Hardware Setup (The Lamp)

This web app expects an ESP32 connected to the same MQTT Broker and Topic. The ESP32 should listen for the following payload strings:

| Action | MQTT Payload | Description |
| :--- | :--- | :--- |
| **Wake Up** | `wake_up` | Lift head, ready state |
| **Nod** | `nod` | Up and down head movement |
| **Shake** | `headshake` | Left and right head movement |
| **Dance** | `happy_wiggle` | Fast movement, excited |
| **Think** | `think` | Tilt head, pause movement |
| **Light** | `on` / `off` | Control LED |

*Note: The default MQTT Topic is `SparkLamp-PRO01`.*

## 🛠️ Technology Stack

*   **Frontend:** React 19, Vite, Tailwind CSS
*   **AI:** @google/genai (Gemini 2.5 Flash)
*   **IoT:** MQTT.js (over WebSockets)
*   **RTC:** LiveKit Client SDK (WebRTC)
*   **Audio:** Web Audio API (PCM Processing)

## 🛡️ Security Note

Since this is a client-side application, **API Keys are entered in the browser and stored in `localStorage`**.
*   Keys are **never** sent to any server other than Google or LiveKit directly.
*   **LiveKit Tokens:** For this serverless demo, LiveKit JWT tokens are generated client-side using the Web Crypto API. In a production environment with user authentication, you should move token generation to a secure backend.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
