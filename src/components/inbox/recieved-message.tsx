import type { Message } from "@/types/MessageType";
import { motion } from "framer-motion";

interface ReceivedMessageProps {
  message: Message;
  onReply?: (message: Message) => void;
  onDelete?: (id: string) => void;
  onCopy?: (text: string) => void;
  senderAvatar?: string | null;
}

const ReceivedMessage = ({
  message,
  senderAvatar,
}: ReceivedMessageProps) => {
  const {
    content,
    timestamp,
    sender_username,
  } = message;

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-2.5 group relative"
    >
      {/* Avatar */}
      <img
        className="w-8 h-8 rounded-full hidden sm:block"
        src={senderAvatar || "/assets/MakerGrid_Blue_Background.jpg"}
        alt={`${sender_username}'s avatar`}
      />

      {/* Message Content */}
      <div className="flex flex-col gap-1 max-w-[80%] min-w-[8%]">
        <span className="text-sm font-cinzel text-[--gold-default]">{sender_username}</span>

        <div className="inline-block bg-[--gold-default] dark:bg-gray-700 rounded-e-xl rounded-es-xl px-4 py-2 border-gray-200">
          <p className="text-sm font-normal text-gray-900 dark:text-white break-words">
            {content}
          </p>
        </div>

        {formattedTime && (
          <div className="text-[10px] text-gray-500 dark:text-gray-400 text-right pr-1">
            {formattedTime}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReceivedMessage;
