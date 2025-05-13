import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useParams } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/MessageType";
import ReceivedMessage from "@/components/inbox/recieved-message";
import SentMessage from "@/components/inbox/sent-message";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocketRoom } from "@/hooks/useSocketRoom";
import { fetchConversations, fetchMessages } from "@/services/chatapi";

interface Conversation {
  id: number;
  other_participant: {
    id: number;
    username: string;
    email: string;
  };
  last_message: Message;
  avatar?: string;
}

const InboxPage: React.FC = () => {
  const { user } = useAuth();
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageMap, setMessageMap] = useState<Record<number, Message[]>>({});
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const params = useParams();
  const conversationParam = params.conversationId;
  const conversationId = selectedConversation?.id ?? null;
  const messages = conversationId ? messageMap[conversationId] || [] : [];

  const { isConnected, send } = useSocketRoom({
    room: conversationId || "",
    onMessage: (msg: Message) => {
      if (!conversationId) return;
      setMessageMap(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), msg],
      }));
    },
    onEvent: (type, payload) => {
      if (!conversationId) return;

      if (type === "chat_message") {
        const msg: Message = {
          id: Date.now(),
          sender_username: payload.sender,
          content: payload.message,
          timestamp: payload.timestamp,
          seen: true,
        };
        setMessageMap(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), msg],
        }));
      }
      else if (type === "typing") {
        console.log("[Typing event received]", payload);

        if (payload.user !== user?.username) {
          setTypingUser(payload.user);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setTypingUser(null);
          }, 3000);
        }
      }
      else if (type === "new_conversation") {
        fetchConversations().then(convs => {
          setAllConversations(convs);
        });
      }
    },
  });

  useEffect(() => {
    fetchConversations().then((convs: Conversation[]) => {
      setAllConversations(convs);

      // Preload last_message for preview
      const preloadMap: Record<number, Message[]> = {};
      convs.forEach(c => {
        if (c.last_message) {
          preloadMap[c.id] = [c.last_message];
        }
      });
      setMessageMap(preloadMap);

      if (conversationParam) {
        const convId = parseInt(conversationParam);
        const found = convs.find(c => c.id === convId);
        if (found) handleConversationSelect(found);
      }
    });
  }, [conversationParam]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages, typingUser]);

  const scrollTimeoutRef = useRef<number | null>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowScrollbar(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setShowScrollbar(false), 2000);
    };

    const scrollArea = contentRef.current;
    scrollArea?.addEventListener("mousemove", handleMouseMove);
    return () => {
      scrollArea?.removeEventListener("mousemove", handleMouseMove);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const handleConversationSelect = async (conv: Conversation) => {
    setSelectedConversation(conv);
    if (!messageMap[conv.id] || messageMap[conv.id].length <= 1) {
      const msgs = await fetchMessages(conv.id);
      const enrichedMsgs = msgs.map((msg: any) => ({
        ...msg,
        sender_username: msg.sender || "<unknown>",
      }));
      setMessageMap(prev => ({ ...prev, [conv.id]: enrichedMsgs }));
    }
  };

  const handleSend = () => {
    if (input.trim() && selectedConversation) {
      const msg: Message = {
        id: Date.now(),
        sender_username: user?.username || "me",
        content: input,
        timestamp: new Date().toISOString(),
        seen: true,
      };
      setMessageMap(prev => ({
        ...prev,
        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), msg],
      }));
      send({ type: "send_message", message: input });
      setInput("");
    }
  };

  const handleTyping = () => {
    if (selectedConversation) {
      send({ type: "typing" });
    }
  };

  return (
    <div className="flex flex-row h-[80dvh] w-full overflow-hidden">
      <aside className="w-16 md:w-1/4 bg-[--navy-dark] border-r border-[--royal-default] overflow-y-auto">
        <ul className="flex flex-col">
          {allConversations.map(conv => {
            const isActive = selectedConversation?.id === conv.id;
            const avatar_url = conv.avatar || "/assets/profile_avatar.png";
            const lastMsg = messageMap[conv.id]?.slice(-1)[0];
            const isUnread = lastMsg?.seen === false && lastMsg?.sender_username !== user?.username;

            return (
              <li key={conv.id}>
                <div
                  onClick={() => handleConversationSelect(conv)}
                  className={`relative p-3 cursor-pointer flex justify-center md:justify-start transition-colors rounded-xl mx-1 my-1 ${isActive ? "bg-[--royal-default]" : "hover:bg-[rgba(--royal-default]"}`}
                >
                  {/* {isUnread && <span className="absolute top-1 right-1 w-2 h-2 bg-[--gold-default] rounded-full" />} */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-[--gold-default]">
                      <AvatarImage src={avatar_url} alt={conv.other_participant.username} />
                      <AvatarFallback />
                    </Avatar>
                    <div className="hidden md:block min-w-0">
                      <div className="font-bold font-cinzel text-[--gold-default] truncate">
                        {conv.other_participant.username}
                      </div>
                      {lastMsg && (
                        <div className="text-xs text-gray-400 truncate max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                          {lastMsg.content}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="flex-1 flex flex-col h-full">
        {selectedConversation ? (
          <Card className="flex flex-col h-full rounded-none border-none ">
            <CardHeader className="sticky top-0 z-10 bg-[--royal-default] p-2 px-4 pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-[--gold-default]">
                  <AvatarImage
                    src={selectedConversation.avatar || "/assets/profile_avatar.png"}
                    alt={selectedConversation.other_participant.username}
                  />
                  <AvatarFallback />
                </Avatar>

                <div className="flex flex-col justify-center">
                  <span className="text-sm font-cinzel text-[--gold-default] leading-tight">
                    {selectedConversation.other_participant.username}
                  </span>
                  {typingUser && (
                    <span className="text-[10px] italic text-gray-400 leading-none">
                      Typing...
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>







            <CardContent ref={contentRef} className={`flex-1 px-4 py-2 space-y-4 overflow-y-auto`}>
              {messages.map(message =>
                message.sender_username === user?.username ? (
                  <SentMessage key={message.id} message={message} senderAvatar={user?.avatar || "/assets/profile_avatar.png"} />
                ) : (
                  <ReceivedMessage key={message.id} message={message} senderAvatar={selectedConversation?.avatar} />
                )
              )}
            </CardContent>

            <CardFooter className="border-t p-4">
              <div className="flex w-full gap-2">
                <Input
                  placeholder="Type your message..."
                  className="flex-1"
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <Button type="button" onClick={handleSend}>
                  Send
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 italic">
            Select a conversation to chat
          </div>
        )}
      </section>
    </div>
  );
};

export default InboxPage;
