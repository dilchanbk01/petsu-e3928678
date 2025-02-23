
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import ConsultationHeader from './consultation-room/ConsultationHeader';
import MessageList from './consultation-room/MessageList';
import MessageInput from './consultation-room/MessageInput';

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

  useEffect(() => {
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
        <ConsultationHeader
          onVideoToggle={() => setIsVideoActive(!isVideoActive)}
          onClose={onClose}
        />
        <MessageList messages={messages} userId={userId} />
        <div ref={messagesEndRef} />
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSendMessage}
          onFileSelect={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default ConsultationRoom;
