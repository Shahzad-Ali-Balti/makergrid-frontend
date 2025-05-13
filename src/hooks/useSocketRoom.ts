import { useRef, useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/authContext";

interface UseSocketRoomProps {
  room: string | number;
  onMessage?: (data: any) => void;
  onEvent?: (event: string, payload: any) => void;
}

export function useSocketRoom({ room, onMessage, onEvent }: UseSocketRoomProps) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tokenRefreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const auth = useContext(AuthContext);
  const refreshAccessToken = auth?.refreshAccessToken;

  useEffect(() => {
    if (!room) return;

    let activeSocket: WebSocket | null = null;

    const connect = async () => {
      // 🛑 Avoid duplicate connection attempts
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        console.log(`[ws:${room}] ⚠️ Already connected. Skipping.`);
        return;
      }

      console.log(`[ws:${room}] 🔄 Attempting to connect...`);

      let token = localStorage.getItem("access_token");
      if (!token && refreshAccessToken) {
        token = await refreshAccessToken();
      }

      if (!token) {
        console.warn(`[ws:${room}] ❌ No access token. Skipping connection.`);
        return;
      }

      const wsUrl = `ws://localhost:8000/ws/chat/${room}/?token=${token}`;
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      activeSocket = socket;

      socket.onopen = () => {
        setIsConnected(true);
        console.log(`[ws:${room}] ✅ Connected`);

        // ⏳ Start token refresh interval (50 mins)
        if (tokenRefreshIntervalRef.current) clearInterval(tokenRefreshIntervalRef.current);
        tokenRefreshIntervalRef.current = setInterval(async () => {
          const refreshed = await refreshAccessToken?.();
          if (!refreshed) {
            console.warn(`[ws:${room}] ❌ Token refresh failed`);
          }
        }, 50 * 60 * 1000);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(`[ws:${room}] 📥 Message:`, data);

          if (data?.type === "token_expired") {
            console.warn(`[ws:${room}] 🔁 Token expired — closing socket.`);
            socket.close(); // trigger reconnect
          } else if (data.type && onEvent) {
            onEvent(data.type, data);
          } else {
            onMessage?.(data);
          }
        } catch (err) {
          console.error(`[ws:${room}] ⚠️ Message parse error:`, err);
        }
      };

      socket.onclose = async () => {
        setIsConnected(false);
        console.warn(`[ws:${room}] 🔌 Disconnected`);

        if (reconnectRef.current) clearTimeout(reconnectRef.current);
        reconnectRef.current = setTimeout(async () => {
          const newToken = await refreshAccessToken?.();
          if (newToken) {
            console.log(`[ws:${room}] 🔁 Reconnecting with new token...`);
            connect();
          } else {
            console.warn(`[ws:${room}] ❌ Cannot reconnect, no new token`);
          }
        }, 3000);
      };

      socket.onerror = (err) => {
        console.error(`[ws:${room}] 🛑 Socket error`, err);
      };
    };

    connect();

    return () => {
      console.log(`[ws:${room}] 🔄 Cleaning up connection`);
      if (activeSocket) activeSocket.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (tokenRefreshIntervalRef.current) clearInterval(tokenRefreshIntervalRef.current);
    };
  }, [room, refreshAccessToken]);

  const send = (payload: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
      console.log(`[ws:${room}] 📤 Sent:`, payload);
    } else {
      console.warn(`[ws:${room}] ⚠️ Socket not ready. Cannot send:`, payload);
    }
  };

  return {
    isConnected,
    send,
  };
}
