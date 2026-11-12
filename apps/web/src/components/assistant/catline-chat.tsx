import { Cat, Menu, Plus, Send, X, MessageSquare, ChevronDown } from "lucide-react";
import styles from "./catline-chat.module.css";

type ChatMessage = { id: number; role: "assistant" | "user"; text: string };
type Conversation = { id: number; title: string; messages: ChatMessage[] };
const models = [
  { id: "auto", label: "Catlas Auto", detail: "Automatic fallback" },
  { id: "gemini", label: "Gemini", detail: "Google AI" },
  { id: "openai", label: "OpenAI", detail: "GPT models" },
  { id: "anthropic", label: "Claude", detail: "Anthropic" },
];

export function CatlineChat() {
  return null;
}
