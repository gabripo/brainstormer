export interface Principle {
  id: number;
  title: string;
  description: string;
  icon: string;
  lucideIcon: string;
}

export const GETTING_TO_YES_PRINCIPLES: Principle[] = [
  {
    id: 1,
    title: "Separate people from the problem",
    description:
      "Address the issue, not the person. Be soft on people, hard on the problem.",
    icon: "👥→📋",
    lucideIcon: "Users",
  },
  {
    id: 2,
    title: "Focus on interests, not positions",
    description:
      "Ask 'why?' to uncover the underlying needs behind stated positions.",
    icon: "🔍→💡",
    lucideIcon: "Heart",
  },
  {
    id: 3,
    title: "Invent options for mutual gain",
    description:
      "Brainstorm multiple solutions before deciding. Separate invention from decision.",
    icon: "💡×💡",
    lucideIcon: "Lightbulb",
  },
  {
    id: 4,
    title: "Insist on objective criteria",
    description:
      "Use fair standards to evaluate options, not pressure or power.",
    icon: "⚖️",
    lucideIcon: "Scale",
  },
];

export const BRAINSTORMING_RULES: Principle[] = [
  {
    id: 5,
    title: "Defer judgment",
    description: "No criticism during brainstorming. All ideas are welcome.",
    icon: "✋",
    lucideIcon: "Ban",
  },
  {
    id: 6,
    title: "Build on others' ideas",
    description: 'Use "Yes, and..." to expand and combine ideas.',
    icon: "🧱",
    lucideIcon: "Puzzle",
  },
];
