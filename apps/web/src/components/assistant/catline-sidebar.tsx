"use client";

import { useState } from "react";
import {
  Bot,
  Check,
  ChevronsUpDown,
  MoreHorizontal,
  Pencil,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { CatlasLogo } from "@/components/layout/logo";
import { CATLINE_AGENTS } from "@/components/assistant/catline-agents";
import type { CatlineConversation } from "@/lib/catline-history";

type CatlineSidebarProps = {
  activeId: string | null;
  agentId: string;
  conversations: CatlineConversation[];
  open: boolean;
  userName: string;
  onAgentChange: (agentId: string) => void;
  onClose: () => void;
  onDelete: (conversationId: string) => void;
  onNewChat: () => void;
  onRename: (conversationId: string, title: string) => void;
  onSelect: (conversationId: string) => void;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function CatlineSidebar({
  activeId,
  agentId,
  conversations,
  open,
  userName,
  onAgentChange,
  onClose,
  onDelete,
  onNewChat,
  onRename,
  onSelect,
}: CatlineSidebarProps) {
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");

  function chooseAgent(nextId: string) {
    onAgentChange(nextId);
    setAgentsOpen(false);
  }

  function startRename(conversationId: string, title: string) {
    setOpenMenuId(null);
    setRenamingId(conversationId);
    setRenameDraft(title);
  }

  function commitRename(conversationId: string) {
    if (renamingId !== conversationId) {
      return;
    }

    const title = renameDraft.trim();

    if (title) {
      onRename(conversationId, title);
    }

    setRenamingId(null);
    setRenameDraft("");
  }

  function cancelRename() {
    setRenamingId(null);
    setRenameDraft("");
  }

  function removeChat(conversationId: string) {
    setOpenMenuId(null);
    onDelete(conversationId);
  }

  return (
    <>
      {open && (
        <button
          aria-label="Close Catline menu"
          className="catline-sidebar-backdrop"
          onClick={onClose}
          type="button"
        />
      )}
      <aside className={open ? "catline-sidebar open" : "catline-sidebar"}>
        <div className="catline-sidebar-top">
          <span className="catline-sidebar-brand">
            <CatlasLogo className="catline-sidebar-logo" />
            Catline
          </span>
          <button
            aria-label="Close Catline menu"
            className="catline-sidebar-close"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <button
          className="catline-sidebar-button primary"
          onClick={onNewChat}
          type="button"
        >
          <SquarePen aria-hidden="true" />
          New chat
        </button>
        <div className="catline-agents">
          <button
            aria-expanded={agentsOpen}
            aria-haspopup="menu"
            className="catline-sidebar-button"
            onClick={() => setAgentsOpen((current) => !current)}
            type="button"
          >
            <Bot aria-hidden="true" />
            Agents
            <ChevronsUpDown
              aria-hidden="true"
              className="catline-sidebar-caret"
            />
          </button>
          {agentsOpen && (
            <>
              <button
                aria-label="Close agents menu"
                className="catline-agents-backdrop"
                onClick={() => setAgentsOpen(false)}
                type="button"
              />
              <div
                aria-label="Catline agents"
                className="catline-agents-menu"
                role="menu"
              >
                {CATLINE_AGENTS.map((agent) => (
                  <button
                    aria-checked={agent.id === agentId}
                    key={agent.id}
                    onClick={() => chooseAgent(agent.id)}
                    role="menuitemradio"
                    type="button"
                  >
                    <span className="catline-agent-text">
                      <span className="catline-agent-name">
                        {agent.name}
                      </span>
                      <span className="catline-agent-description">
                        {agent.description}
                      </span>
                    </span>
                    {agent.id === agentId && <Check aria-hidden="true" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="catline-history">
          <span className="catline-history-label">History</span>
          {conversations.length === 0 ? (
            <p className="catline-history-empty">No chats yet</p>
          ) : (
            conversations.map((conversation) => {
              const isActive = conversation.id === activeId;
              const entryClassName = isActive
                ? "catline-history-entry active"
                : "catline-history-entry";

              if (renamingId === conversation.id) {
                return (
                  <div className={entryClassName} key={conversation.id}>
                    <input
                      aria-label="Rename chat"
                      autoFocus
                      className="catline-history-rename"
                      maxLength={60}
                      onBlur={() => commitRename(conversation.id)}
                      onChange={(event) =>
                        setRenameDraft(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          commitRename(conversation.id);
                        }

                        if (event.key === "Escape") {
                          cancelRename();
                        }
                      }}
                      value={renameDraft}
                    />
                  </div>
                );
              }

              return (
                <div className={entryClassName} key={conversation.id}>
                  <button
                    aria-current={isActive}
                    className="catline-history-item"
                    onClick={() => onSelect(conversation.id)}
                    type="button"
                  >
                    {conversation.title}
                  </button>
                  <button
                    aria-expanded={openMenuId === conversation.id}
                    aria-haspopup="menu"
                    aria-label={`Options for ${conversation.title}`}
                    className="catline-history-menu-trigger"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === conversation.id
                          ? null
                          : conversation.id,
                      )
                    }
                    type="button"
                  >
                    <MoreHorizontal aria-hidden="true" />
                  </button>
                  {openMenuId === conversation.id && (
                    <>
                      <button
                        aria-label="Close chat options"
                        className="catline-history-menu-backdrop"
                        onClick={() => setOpenMenuId(null)}
                        type="button"
                      />
                      <div
                        aria-label="Chat options"
                        className="catline-history-menu"
                        role="menu"
                      >
                        <button
                          onClick={() =>
                            startRename(
                              conversation.id,
                              conversation.title,
                            )
                          }
                          role="menuitem"
                          type="button"
                        >
                          <Pencil aria-hidden="true" />
                          Rename
                        </button>
                        <button
                          className="danger"
                          onClick={() => removeChat(conversation.id)}
                          role="menuitem"
                          type="button"
                        >
                          <Trash2 aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
        <div className="catline-sidebar-footer">
          <span aria-hidden="true" className="catline-footer-avatar">
            {getInitials(userName)}
          </span>
          <span className="catline-footer-name">{userName}</span>
        </div>
      </aside>
    </>
  );
}
