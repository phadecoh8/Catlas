export type CatlineAgent = {
  id: string;
  name: string;
  description: string;
};

export const CATLINE_AGENTS: CatlineAgent[] = [
  {
    id: "assistant",
    name: "Assistant",
    description: "Answers about Catlas",
  },
  {
    id: "learn",
    name: "Learn the app",
    description: "A first-run guide",
  },
  {
    id: "support",
    name: "Customer service",
    description: "Problems and fixes",
  },
];

export function getAgentName(agentId: string): string {
  return (
    CATLINE_AGENTS.find((agent) => agent.id === agentId)?.name ?? "Assistant"
  );
}
