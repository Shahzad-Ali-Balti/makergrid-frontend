import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/authContext";

interface SocketContextType {
  isConnected: boolean;
  send: (payload: any) => void;
}

export const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  send: () => { },
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("SocketProvider must be used within an AuthProvider");
  }

  const { token, refreshAccessToken, user } = auth;

  const connectSocket = async () => {
    if (!user) return;

    let accessToken = token || localStorage.getItem("access_token");
    if (!accessToken && refreshAccessToken) {
      accessToken = await refreshAccessToken();
    }

    if (!accessToken) {
      console.warn("[Socket] ❌ No access token. Skipping connection.");
      return;
    }

    const socket_url = import.meta.env.VITE_SOCKET_URL

    const ws = new WebSocket(`ws://${socket_url}/ws/chat/user_${user.id}/?token=${accessToken}`);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("[Socket] ✅ Connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("[Socket] 📥 Message:", data);
      // You can dispatch global events or handle them contextually.
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.warn("[Socket] 🔌 Disconnected");
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      reconnectRef.current = setTimeout(connectSocket, 3000);
    };

    ws.onerror = (err) => {
      console.error("[Socket] 🛑 Error:", err);
    };
  };

  useEffect(() => {
    if (user) {
      connectSocket();
    } else {
      // Disconnect when user logs out
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    }
  }, [user]);

  const send = (payload: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      console.warn("[Socket] ⚠️ Cannot send, socket not open.");
    }
  };

  return (
    <SocketContext.Provider value={{ isConnected, send }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useGlobalSocket = () => useContext(SocketContext);
