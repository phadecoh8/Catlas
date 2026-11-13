"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { getAgentName } from "@/components/assistant/catline-agents";
import { CatlineChat } from "@/components/assistant/catline-chat";
import { CatlineSidebar } from "@/components/assistant/catline-sidebar";
import {
  type CatlineConversation,
  type CatlineStoredMessage,
  buildConversationTitle,
  createId,
  loadConversations,
  saveConversations,
} from "@/lib/catline-history";

type CatlineWorkspaceProps = {
  userName: string;
};

export function CatlineWorkspace({ userName }: CatlineWorkspaceProps) {
  const [conversations, setConversations] = useState<
    CatlineConversation[]
  >([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [agentId, setAgentId] = useState("assistant");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = loadConversations();

    setConversations(stored);
    setActiveId(stored[0]?.id ?? null);
  }, []);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeId,
  );

  function persist(next: CatlineConversation[]) {
    setConversations(next);
    saveConversations(next);
  }

  function handleSend(text: string, attachments: string[]) {
    const now = Date.now();
    const userMessage: CatlineStoredMessage = {
      id: createId(),
      role: "user",
      text,
      ...(attachments.length > 0 ? { attachments } : {}),
    };
    const assistantMessage: CatlineStoredMessage = {
      id: createId(),
      role: "assistant",
      text: "Catline is not connected yet. Your message stayed on this device and was not sent.",
    };

    if (!activeConversation) {
      const conversation: CatlineConversation = {
        id: createId(),
        title: buildConversationTitle(text),
        agentId,
        updatedAt: now,
        messages: [userMessage, assistantMessage],
      };

      persist([conversation, ...conversations]);
      setActiveId(conversation.id);
      return;
    }

    const updated: CatlineConversation = {
      ...activeConversation,
      agentId,
      updatedAt: now,
      messages: [
        ...activeConversation.messages,
        userMessage,
        assistantMessage,
      ],
    };

    persist([
      updated,
      ...conversations.filter(
        (conversation) => conversation.id !== updated.id,
      ),
    ]);
  }

  function handleClear() {
    if (!activeConversation) {
      return;
    }

    persist(
      conversations.filter(
        (conversation) => conversation.id !== activeConversation.id,
      ),
    );
    setActiveId(null);
  }

  function handleNewChat() {
    setActiveId(null);
    setSidebarOpen(false);
  }

  function handleSelect(conversationId: string) {
    const conversation = conversations.find(
      (item) => item.id === conversationId,
    );

    setActiveId(conversationId);

    if (conversation) {
      setAgentId(conversation.agentId);
    }

    setSidebarOpen(false);
  }

  function handleAgentChange(nextId: string) {
    setAgentId(nextId);

    if (activeConversation) {
      persist(
        conversations.map((conversation) =>
          conversation.id === activeConversation.id
            ? { ...conversation, agentId: nextId }
            : conversation,
        ),
      );
    }
  }

  function handleRename(conversationId: string, title: string) {
    persist(
      conversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, title }
          : conversation,
      ),
    );
  }

  function handleDelete(conversationId: string) {
    persist(
      conversations.filter(
        (conversation) => conversation.id !== conversationId,
      ),
    );

    if (activeId === conversationId) {
      setActiveId(null);
    }
  }

  return (
    <>
      <button
        aria-expanded={sidebarOpen}
        aria-label="Open Catline menu"
        className="catline-sidebar-toggle"
        onClick={() => setSidebarOpen(true)}
        type="button"
      >
        <Menu aria-hidden="true" />
      </button>
      <div className="catline-workspace">
        <CatlineSidebar
          activeId={activeId}
          agentId={agentId}
          conversations={conversations}
          onAgentChange={handleAgentChange}
          onClose={() => setSidebarOpen(false)}
          onDelete={handleDelete}
          onNewChat={handleNewChat}
          onRename={handleRename}
          onSelect={handleSelect}
          open={sidebarOpen}
          userName={userName}
        />
        <div className="catline-main">
          <CatlineChat
            agentName={getAgentName(agentId)}
            messages={activeConversation?.messages ?? []}
            onClear={handleClear}
            onSend={handleSend}
          />
        </div>
      </div>
    </>
  );
}
