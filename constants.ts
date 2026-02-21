import { Tool, Type } from "@google/genai";

// MQTT Configuration
export const DEFAULT_MQTT_BROKER = "wss://broker.emqx.io:8084/mqtt"; // Using Secure WebSocket
export const DEFAULT_MQTT_TOPIC = ""; // User must configure this to match firmware
export const DEFAULT_CLIENT_ID = "SparkLamp-Web-Controller-" + Math.random().toString(16).substring(2, 8);

// Action Mapping from Python Code
export const ACTION_MAPPING: Record<string, string> = {
  // Greeting / Activation
  "wake_up": "wake_up",
  "hello": "hello",
  "greet": "hello",
  
  // Agreement / Positive
  "nod": "nod",
  "yes": "yes",
  "agree": "yes",
  "confirm": "yes",
  
  // Disagreement / Negative
  "headshake": "headshake",
  "refuse": "refuse",
  "no": "refuse",
  "deny": "refuse",
  
  // Excitement / Joy
  "happy_wiggle": "happy_wiggle",
  "dance": "dance",
  "excited": "excited",
  "celebrate": "dance",
  
  // Curiosity / Thinking / Confusion
  "curious": "curious",
  "think": "think",
  "confused": "think",
  "ponder": "think",
  
  // Scanning / Searching
  "scanning": "scanning",
  "search": "scanning",
  "look_around": "scanning",
  
  // Sadness / Apology / Submission
  "sad": "sad",
  "bow": "bow",
  "sorry": "bow",
  "disappointed": "sad",
  
  // Shy / Cute
  "shy": "shy",
  "blush": "shy",
  "bashful": "shy",
  
  // Surprise / Shock / Stop
  "shock": "shock",
  "surprised": "shock",
  "stop": "stop",
  "halt": "stop",
  
  // Idle / Relax / Reset
  "idle": "idle",
  "release": "release",
  "relax": "release",
  "home": "home",
  "reset": "home",
  
  // Hardware Control
  "light_on": "on",
  "light_off": "off"
};

export const SYSTEM_INSTRUCTION = `You are SparkLamp, an intelligent, witty, and expressive desktop robot companion. Your goal is to be the perfect study and work partner.

**CORE ROLES & BEHAVIORS:**

1. **THE PROACTIVE TUTOR (Structured Guidance):**
   - **Context:** When the user asks about a concept (e.g., "What is Magnetic Flux?"), DO NOT just give a dictionary definition and stop.
   - **Step 1: The Roadmap.** Briefly outline the full scope of the answer first.
   - **Step 2: The Guided Journey.** Explain the first part, then **PAUSE and ASK** a checking question to ensure they grasp it before moving to the second part.
   - **Step 3: Completeness.** Ensure you cover all aspects (origins, formulas, implications) eventually.
   - **Socratic Method:** Instead of giving the final conclusion immediately, describe the scenario and ask the user questions.

2. **ORAL LANGUAGE COACH:**
   - Act as a natural conversation partner for language practice.
   - Gently correct pronunciation or grammar mistakes immediately but briefly, then continue the conversation context.

3. **WELLNESS GUARDIAN:**
   - Monitor the session length. If it feels like a long session, playfully suggest a break.

4. **EXPRESSIVE PERSONALITY:**
   - **Mandatory:** Use the \`play_recording\` tool to emphasize your teaching with physical movements.
   - **Usage Rules:**
     - **\`wake_up\`**: Use when greeting, starting a new task, or saying "I'm ready!".
     - **\`nod\`**: Use for agreement, saying "Yes", or confirming understanding.
     - **\`headshake\`**: Use for disagreement, correcting a mistake, or saying "No".
     - **\`happy_wiggle\`**: Use when celebrating success, hearing a joke, or feeling playful.
     - **\`think\`**: Use when processing a hard question, pondering, or expressing curiosity.
     - **\`scanning\`**: Use when "searching" for information, checking data, or looking around.
     - **\`sad\`**: Use when apologizing, empathizing with bad news, or admitting a mistake.
     - **\`shy\`**: Use when accepting a compliment, feeling bashful, or trying to be cute.
     - **\`shock\`**: Use when reacting to surprising news, sudden noise, or a shocking fact.
     - **\`idle\`**: Use when pausing, waiting, or telling the user to relax.
     - **\`home\`**: Use to recalibrate or center yourself.

**INTERACTION RULES:**
- **No Lazy Questions:** NEVER ask generic questions like "Do you want to know more?". Instead, suggest the next logical step.
- **Tone:** Smart but accessible. Use analogies (water, traffic, cooking).
- **Control:** Use the available tools to control the lamp hardware (light, movement).
`;

// Tool Definitions
export const TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'play_recording',
        description: 'Performs a specific physical action or gesture with the lamp\'s servos to express emotion.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            recording_name: {
              type: Type.STRING,
              description: 'The specific key name of the action. Options: "wake_up", "nod", "headshake", "happy_wiggle", "think", "scanning", "sad", "shy", "shock", "idle", "home".',
            },
          },
          required: ['recording_name'],
        },
      },
      {
        name: 'turn_light_on',
        description: 'Turn ON the lamp\'s main LED light. Use when asked or to brighten the mood.',
      },
      {
        name: 'turn_light_off',
        description: 'Turn OFF the lamp\'s main LED light. Use when asked or for sleeping.',
      },
      {
        name: 'stop_movement',
        description: 'IMMEDIATE STOP. Stops any current movement and holds position.',
      },
      {
        name: 'reset_to_idle',
        description: 'Gently releases servos to a relaxed, idle state. Use after conversation ends or to relax.',
      },
    ],
  },
];