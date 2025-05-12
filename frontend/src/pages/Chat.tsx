import { Send, X, Image, MessageCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Message, useChatStore } from '@/store/useChatStore.ts';
import MessageSkeleton from '@/components/skeletons/MessageSkeleton.tsx';
import { useAuthStore } from '@/store/useAuthStore.ts';
import { formatMessageTime } from '@/lib/utils.ts';
import Sidebar from '@/components/Sidebar.tsx';
import { useSocketStore } from '@/store/useSocketStore.ts';

function NoChatSelected() {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-blue-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to NoTiCall!</h2>
        <p className="text-gray-500">Select a conversation from the sidebar to start chatting</p>
      </div>
    </div>
  );
}

function ChatContainer() {
  const messageContainerEndRef = useRef<HTMLDivElement>(null);
  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    const selectUser = selectedUser;
    console.log('selectUser: ', selectUser);
    getMessages(selectedUser);
    console.log('messages: ', messages);
    subscribeToMessages();

    // cleanup function
    return () => unsubscribeFromMessages();
  }, [getMessages, selectedUser?.id, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageContainerEndRef.current && messages.length > 0) {
      messageContainerEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-accent">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message) => (
          <div
            className={`chat ${message.sender_id === authUser?.id ? 'chat-end' : 'chat-start'}`}
            key={message.id}
            ref={messageContainerEndRef}
          >
            <div className="chat-image avatar">
              <Avatar className="w-8 h-8 rounded-full border-2 p-2">
                <AvatarImage
                  src={
                    message.sender_id === authUser?.id
                      ? authUser?.profile_pic
                      : selectedUser && 'username' in selectedUser
                        ? selectedUser.profile_pic
                        : selectedUser && 'members' in selectedUser
                          ? selectedUser.members.find(
                              member => member.user.id === message.sender_id,
                            )?.user.profile_pic
                          : undefined
                  }
                />
                <AvatarFallback>
                  {message.sender_id === authUser?.id
                    ? authUser?.username.slice(0, 2).toUpperCase()
                    : selectedUser && 'username' in selectedUser
                      ? selectedUser?.username.slice(0, 2).toUpperCase()
                      : selectedUser && 'members' in selectedUser
                        ? selectedUser.members
                            .find(member => member.user.id === message.sender_id)
                            ?.user.username.slice(0, 2)
                            .toUpperCase()
                        : undefined}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="chat-header mb-1">
              <time className="text-sm opacity-50 ml-1">
                {formatMessageTime(message.created_at)}
              </time>
            </div>

            <div
              className={`chat-bubble flex flex-col group ${message.sender_id === authUser?.id ? 'bg-blue-100' : 'bg-gray-200'}`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.content && <MessageText message={message.content} />}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
}

function MessageText({ message }: { message: string }) {
  const [originalMessage] = useState(message);

  return (
    <div>
      <p>{originalMessage}</p>
    </div>
  );
}

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useSocketStore();
  const { authUser } = useAuthStore();

  const checkAnyOnlineUser = () => {
    if (!selectedUser) return false;

    // If selectedUser is an individual user
    if ('username' in selectedUser) {
      return onlineUsers.includes(String(selectedUser.id));
    }

    // If selectedUser is a group, check if any member is online. Group has status online if atleast 1 user online
    if ('members' in selectedUser) {
      return selectedUser.members.some(
        member => member.user.id !== authUser?.id && onlineUsers.includes(String(member.user.id)),
      );
    }
    return false;
  };

  return (
    <div className="p-2.5 border-b border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar className="w-8 h-8 rounded-full border-2 p-2">
            <AvatarImage
              src={selectedUser && 'username' in selectedUser ? selectedUser.profile_pic : ''}
            />
            <AvatarFallback>
              {selectedUser && 'username' in selectedUser
                ? selectedUser?.username.slice(0, 2).toUpperCase()
                : selectedUser?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {selectedUser && 'username' in selectedUser ? selectedUser?.full_name : ''}
            </h3>
            <p className="text-sm text-gray-400">{checkAnyOnlineUser() ? 'Online' : 'Offline'}</p>
          </div>
        </div>

        {/* Close btn */}
        <button onClick={() => setSelectedUser(undefined)}>
          <X />
        </button>
      </div>
    </div>
  );
}

function MessageInput() {
  const { sendMessage } = useChatStore();
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async e => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        content: text.trim(),
        image: imagePreview ? imagePreview : '',
      });

      setText(() => '');
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to send a message');
      console.log('Failed to send message:', error);
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setImagePreview(result);
      }
      console.log('result ', result);
      console.log('reader: ', reader);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const autoResize = event => {
    event.target.style.height = 'auto'; // Reset the height to auto
    event.target.style.height = `${event.target.scrollHeight}px`; // Set the height to fit content
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-blue-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/*Text message*/}
          <input
            type="text"
            value={text}
            className="w-full input input-bordered rounded-lg input-sm sm:input-md resize-none leading-relaxed"
            placeholder="Type a message..."
            onInput={autoResize}
            onChange={e => setText(e.target.value)}
          />

          {/*/!*Image input*!/*/}
          <input
            type="file"
            accept="image/jpg,image/jpeg,image/png"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${imagePreview ? 'text-blue-500' : 'text-zinc-400'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          {/* Send button */}
          <button
            type="submit"
            className="sm:flex btn btn-circle"
            disabled={!text.trim() && !imagePreview}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

function Chat() {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-[calc(100%-70px)]">
      <div className="flex items-center justify-center pt-5 px-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
