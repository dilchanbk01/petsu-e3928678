
import { Paperclip } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file' | 'prescription';
  file_url?: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  userId: string;
}

const MessageList = ({ messages, userId }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender_id === userId ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.sender_id === userId
                ? 'bg-petsu-blue text-white'
                : 'bg-gray-100'
            }`}
          >
            {message.message_type === 'file' ? (
              <a
                href={message.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm underline"
              >
                <Paperclip className="h-4 w-4" />
                {message.content}
              </a>
            ) : (
              <p className="text-sm">{message.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
