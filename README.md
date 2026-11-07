# Brainstormer

**Run better brainstorming sessions, with AI attendees at the table.**

Brainstormer guides a group through a session based on *Getting to Yes* (Fisher & Ury): frame the situation without blame, uncover everyone's real interests, collect ideas without judging them, then review and keep the best.

**Live app:** [gabripo.github.io/brainstormer](https://gabripo.github.io/brainstormer/)

## How a session works

1. **Setup.** Describe the situation neutrally, note the underlying interests and the relationship dynamics, add the attendees and agree on the session norms. The first human attendee becomes the mediator.
2. **Brainstorm.** Everyone throws ideas onto a board of sticky notes. No criticism, quantity first, build on each other's ideas.
3. **Review.** Star the strongest ideas, discard the rest, and finish with a clear shortlist.

## AI attendees

Add AI attendees next to the people in the room. Each one brings ideas from its own point of view:

| Preset | Thinks about |
|---|---|
| 🌞 Optimist | Opportunities and the upside for every party |
| 🧐 Skeptic | Risks, phrased as options that reduce them (never as criticism) |
| 🛒 Customer | The people who live with the result |
| 🛠️ Engineer | Concrete, feasible steps and small experiments |
| 💶 Money-minded | Cheap-to-try options and fair cost sharing |
| 🃏 Wildcard | Ideas borrowed from unrelated fields |

You can also write a **custom** AI attendee (for example "Head of Sales: cares about winning new customers quickly").

On the brainstorm board, press **Ask AI attendees**: each one takes a turn, sees the situation, the interests and every idea already on the board, and adds new ideas as sticky notes labelled with its name. They follow the same rules as humans: no criticism, build on others' ideas. AI attendees never act as mediator.

### Choosing the AI

Open **AI settings** (shown as soon as an AI attendee joins):

- **Claude (API key):** paste your [Anthropic API key](https://console.anthropic.com/). It is stored only in your browser and sent only to Anthropic; usage is billed to your account. The default model is `claude-haiku-5-5` and can be changed.
- **Ollama (local):** free and private, runs on your own machine. Start Ollama with `OLLAMA_ORIGINS=*` (or the app's address) so the page may call it, and pull a model, e.g. `ollama pull llama3.2`.

The app is a static site: there is no server in between, and session data stays in your browser's local storage.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to docs/ (served by GitHub Pages)
npm run lint
```

Built with Next.js (static export), React, TypeScript, Tailwind CSS and Framer Motion. On every push to `main`, a GitHub Actions workflow rebuilds `docs/` and commits it, so the live site always matches the code.

Built through agentic coding: the ideas and direction are mine; the code was written with AI coding agents.
