
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Video, Send, Paperclip, X, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file' | 'prescription';
  file_url?: string;
  created_at: string;
}

interface ConsultationRoomProps {
  sessionId: string;
  userId: string;
  vetId: string;
  onClose: () => void;
}

const ConsultationRoom = ({ sessionId, userId, vetId, onClose }: ConsultationRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoActive, setIsVideoActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('consultation_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        toast.error('Failed to load messages');
        return;
      }

      setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultation_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('consultation_messages')
        .insert({
          session_id: sessionId,
          sender_id: userId,
          content: newMessage,
          message_type: 'text',
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${sessionId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('consultation-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('consultation-files')
        .getPublicUrl(filePath);

      const { error: messageError } = await supabase
        .from('consultation_messages')
        .insert({
          session_id: sessionId,
          sender_id: userId,
          content: file.name,
          message_type: 'file',
          file_url: publicUrl,
        });

      if (messageError) throw messageError;
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl h-[80vh] rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-petsu-blue text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">Consultation Session</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-petsu-blue/90"
              onClick={() => setIsVideoActive(!isVideoActive)}
            >
              <Video className="h-5 w-5 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-petsu-blue/90"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
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
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRoom;
