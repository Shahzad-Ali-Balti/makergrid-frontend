// services/chatApi.ts
import axiosInstance from "@/lib/axiosInstance";
import { Message } from "@/types/MessageType";

export const fetchConversations = async () => {
  const res = await axiosInstance.get("/api/community/conversations/");
  return res.data;
};

export const fetchMessages = async (conversationId: number) => {
  const res = await axiosInstance.get(`/api/community/conversations/${conversationId}/history/`);
  return res.data;
};

export const createConversation = async (username: string) => {
  const res = await axiosInstance.post("/api/community/conversations/private/create/", {
    username
  });
  
  return res.data;
};
