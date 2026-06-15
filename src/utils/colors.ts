export const STICKY_COLORS = [
  { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" },
  { bg: "#D1FAE5", border: "#10B981", text: "#065F46" },
  { bg: "#DBEAFE", border: "#3B82F6", text: "#1E40AF" },
  { bg: "#FCE7F3", border: "#EC4899", text: "#9D174D" },
  { bg: "#FFEDD5", border: "#F97316", text: "#9A3412" },
  { bg: "#F3E8FF", border: "#A855F7", text: "#6B21A8" },
  { bg: "#CCFBF1", border: "#14B8A6", text: "#115E59" },
  { bg: "#FFE4E6", border: "#F43F5E", text: "#9F1239" },
  { bg: "#E0E7FF", border: "#6366F1", text: "#3730A3" },
  { bg: "#FEF9C3", border: "#EAB308", text: "#854D0E" },
];

export function getRandomStickyColor() {
  return STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
}
