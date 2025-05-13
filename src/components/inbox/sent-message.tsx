import type { Message } from "@/types/MessageType";
import { motion } from "framer-motion";

const SentMessage = ({
  message,
  senderAvatar,
}: {
  message: Message;
  senderAvatar?: string;
}) => {
  const { content, timestamp, sender_username } = message;

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start justify-end gap-2.5 w-full"
    >
      <div className="flex flex-col gap-1 max-w-[80%] min-w-[8%] items-end">
        <span className="text-sm font-cinzel text-[--gold-default]">{sender_username}</span>

        <div className="inline-block bg-[--gold-light] dark:bg-gray-800 rounded-s-xl rounded-ee-xl px-4 py-2 border border-transparent">
          <p className="text-sm font-normal text-gray-900 dark:text-white break-words">
            {content}
          </p>
        </div>

        {formattedTime && (
          <div className="text-[10px] text-gray-500 dark:text-gray-400 text-left w-full pl-1">
            {formattedTime}
          </div>
        )}
      </div>

      <img
        className="w-8 h-8 rounded-full hidden sm:block"
        src={senderAvatar || "/assets/default-avatar.png"}
        alt={`${sender_username}'s avatar`}
      />
    </motion.div>
  );
};

export default SentMessage;
