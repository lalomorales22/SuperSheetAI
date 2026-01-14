# SuperSheet AI 🚀

SuperSheet AI is an intelligent homework generation platform designed for parents and educators to create personalized, high-engagement worksheets for children. By leveraging the power of Google Gemini AI, it transforms standard curriculum into exciting missions themed around a child's specific interests, such as Minecraft, Fortnite, or Dinosaurs.

## ✨ Features

- **Personalized Hero Profiles**: Tailor content based on the child's name, age, grade, strengths, and specific areas where they need help.
- **AI-Powered Generation**: Simply describe what you want (e.g., "10 subtraction problems and a short story about a creeper") and the AI builds it instantly.
- **Strict Math Engine**: Generates clean, vertical math problems formatted specifically for early learners (Kindergarten to 3rd Grade).
- **Procedural Maze Generator**: Every worksheet includes a unique, algorithmically generated maze that is guaranteed to be solvable.
- **Mission Gallery**: Save your favorite creations to a persistent local database to reuse or print later.
- **Print-Ready Design**: Professionally styled layouts optimized for A4/Letter printing or saving as high-quality PDFs.

## 🛠️ Technical Stack

- **Frontend**: React (ES Modules via esm.sh)
- **Styling**: Tailwind CSS
- **Icons & Fonts**: Font Awesome, Google Fonts (Fredoka, Quicksand, Press Start 2P)
- **AI Integration**: [Google Gemini API (@google/genai)](https://ai.google.dev/)
- **State Management**: React Hooks & LocalStorage for persistence.

## 🚀 Getting Started

### Prerequisites

You will need a Google Gemini API Key. You can obtain one for free (within certain limits) at the [Google AI Studio](https://aistudio.google.com/).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lalomorales22/supersheet-ai.git
   cd supersheet-ai
   ```

2. This project uses a modern "no-build" approach via ES modules and import maps. You don't need `npm install` for basic usage!

### Configuration

The application requires an environment variable named `API_KEY`. 

In the development environment provided by your platform, ensure the `API_KEY` is set in your environment variables.

### Running Locally

To serve the application locally, you can use any static file server. For example, using Python:

```bash
python3 -m http.server 8000
```

Then open your browser to `http://localhost:8000`.

## 📖 How to Use

1. **Create a Profile**: Enter the child's details. Be specific about their interests (e.g., "Charizard", "Redstone", "Princesses").
2. **Issue a Prompt**: In the chat box, describe the worksheet. 
   - *Example: "Give me 12 addition problems up to 20 and a story about a space pirate named Leo."*
3. **Review & Print**: Click "Print / Save PDF". 
   - **Tip**: In the print dialog, set "Margins" to "None" and ensure "Background Graphics" is checked for the best result.
4. **Save**: Click "Save to Missions" to store the worksheet in your local gallery.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request to the repository: [github.com/lalomorales22/supersheet-kid-ai](https://github.com/lalomorales22/supersheet-kid-ai)

## 📄 License

This project is open-source and available under the MIT License.
