export type LegacyPart =
  | { type?: "text"; text?: string }
  | { type?: "image_url"; image_url?: string; url?: string }
  | { type?: string; [key: string]: unknown };

export type LegacyMessage = {
  id?: string;
  role?: string;
  content?: unknown;
  parts?: LegacyPart[];
  message?: string;
  createdAt?: string;
  metadata?: Record<string, unknown>;
};

export type LegacyChatSession = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: LegacyMessage[];
};

export type UIPart =
  | { type: "text"; text: string }
  | { type: "image_url"; url: string };

export type UIMessage = {
  id: string;
  role: "user" | "assistant" | "system" | "tool" | "data";
  content: UIPart[];
  createdAt?: string;
  metadata?: Record<string, unknown>;
};

export type UIChatSession = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: UIMessage[];
  metadata?: Record<string, unknown>;
};
