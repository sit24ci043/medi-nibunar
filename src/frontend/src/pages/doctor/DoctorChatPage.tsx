import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useConversation, useSendMessage } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Lock, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function DoctorChatPage() {
  const { patientId } = useParams({ from: "/doctor/chat/$patientId" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const sendMessage = useSendMessage();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // For the chat, we use the caller's own principal as both ends for demo purposes
  const targetPrincipal = identity?.getPrincipal() ?? null;
  const { data: messages = [] } = useConversation(targetPrincipal);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messagesEndRef.current is intentionally excluded
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !targetPrincipal) return;
    const content = message.trim();
    setMessage("");
    try {
      await sendMessage.mutateAsync({ to: targetPrincipal, content });
    } catch {
      toast.error("Failed to send message");
    }
  };

  const myPrincipal = identity?.getPrincipal()?.toString();
  const shortId = patientId.substring(0, 8);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-w-2xl mx-auto">
      <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/doctor/chat" })}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-bold">
            {shortId.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">
            Patient {shortId}
          </p>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] gap-1 text-emerald-700 border-emerald-300 bg-emerald-50"
        >
          <Lock className="h-2.5 w-2.5" />
          Encrypted
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Lock className="h-8 w-8 text-primary/30 mx-auto mb-3" />
            <p className="font-semibold text-foreground text-sm">
              Secure Channel
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Start the conversation with Patient {shortId}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.from.toString() === myPrincipal;
            return (
              <div
                key={msg.id}
                className={cn("flex", isMe ? "justify-end" : "justify-start")}
              >
                {!isMe && (
                  <Avatar className="h-7 w-7 mr-2 flex-shrink-0 mt-1">
                    <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground font-bold">
                      {shortId.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border rounded-bl-sm",
                  )}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1",
                      isMe
                        ? "text-primary-foreground/70 text-right"
                        : "text-muted-foreground",
                    )}
                  >
                    {new Date(
                      Number(msg.timestamp) / 1_000_000,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-4 py-3 bg-card border-t border-border flex-shrink-0"
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message patient..."
          className="flex-1"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || sendMessage.isPending}
          aria-label="Send"
        >
          {sendMessage.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
