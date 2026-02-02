import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  useConversations,
  useConversation,
  useCreateConversation,
  useSendMessage,
  useAppProject,
} from "@/hooks/useAppLaunch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  Send,
  Plus,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  Smartphone,
  User,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Simulated AI response (in production, this would call your AI backend)
const WELCOME_MESSAGE = `Hi! I'm your Launch Assistant. 🚀

I'm here to help you publish your app to Google Play and the App Store. I know all the guidelines, requirements, and best practices.

**What I can help you with:**
- Setting up your developer accounts
- Creating store listings that convert
- Generating screenshots and assets
- Writing privacy policies and compliance docs
- Managing beta testing
- Handling review rejections
- Optimizing for search (ASO)

What would you like to work on today?`;

const QUICK_ACTIONS = [
  { label: "Start new project", action: "I want to launch a new app" },
  { label: "Fix rejection", action: "My app was rejected, help me fix it" },
  { label: "Create screenshots", action: "I need help creating screenshots" },
  { label: "Privacy policy", action: "Generate a privacy policy for my app" },
];

export function AIAssistantPage() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");

  const { data: project } = useAppProject(projectId || "");
  const { data: conversations } = useConversations(projectId || undefined);
  const createConversation = useCreateConversation();
  const sendMessage = useSendMessage();

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const { data: activeConversation } = useConversation(activeConversationId || "");

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  const handleNewConversation = async () => {
    try {
      const conversation = await createConversation.mutateAsync({
        project_id: projectId || undefined,
        title: "New conversation",
        context_type: projectId ? "project" : "general",
      });

      if (conversation) {
        setActiveConversationId(conversation.id);
      }
    } catch (error) {
      toast.error("Failed to create conversation");
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!activeConversationId) {
      // Create a new conversation first
      const conversation = await createConversation.mutateAsync({
        project_id: projectId || undefined,
        title: inputValue.slice(0, 50),
        context_type: projectId ? "project" : "general",
      });

      if (conversation) {
        setActiveConversationId(conversation.id);
        await sendMessageToConversation(conversation.id, inputValue);
      }
    } else {
      await sendMessageToConversation(activeConversationId, inputValue);
    }

    setInputValue("");
  };

  const sendMessageToConversation = async (conversationId: string, content: string) => {
    try {
      await sendMessage.mutateAsync({ conversationId, content });

      // Simulate AI typing
      setIsTyping(true);

      // In production, this would be a real API call
      setTimeout(async () => {
        // This is where you'd call your AI backend
        // For now, just simulate a response
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar - Conversation History */}
      <div className="w-72 border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/app-launch">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="font-semibold">Launch AI</h2>
          </div>
          <Button
            onClick={handleNewConversation}
            className="w-full gap-2"
            disabled={createConversation.isPending}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Project Context */}
        {project && (
          <div className="p-3 mx-3 mt-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium truncate">{project.name}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Context: {project.status}
            </p>
          </div>
        )}

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {conversations?.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-colors",
                activeConversationId === conv.id
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-background/50"
              )}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {conv.title || "New conversation"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {conv.message_count} messages
              </p>
            </button>
          ))}

          {(!conversations || conversations.length === 0) && (
            <div className="text-center text-sm text-muted-foreground py-8">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Launch Assistant</h3>
              <p className="text-xs text-muted-foreground">
                AI expert for app publishing
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Powered by AI</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome Message (shown when no active conversation) */}
          {!activeConversationId && (
            <>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-background/50 rounded-2xl rounded-tl-sm p-4 max-w-2xl">
                    <div className="prose prose-sm prose-invert">
                      <p className="whitespace-pre-wrap">{WELCOME_MESSAGE}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 ml-11">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.action)}
                    className="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-sm text-primary transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Conversation Messages */}
          {activeConversation?.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  message.role === "user"
                    ? "bg-primary"
                    : "bg-gradient-to-br from-primary to-purple-500"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div
                className={cn(
                  "rounded-2xl p-4 max-w-2xl",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-background/50 rounded-tl-sm"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-background/50 rounded-2xl rounded-tl-sm p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask me anything about app publishing..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || sendMessage.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Launch AI knows Google Play & App Store guidelines inside out
          </p>
        </div>
      </div>
    </div>
  );
}
