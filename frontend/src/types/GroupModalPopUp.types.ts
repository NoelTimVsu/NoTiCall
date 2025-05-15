import type { User } from '@/store/useChatStore';

export interface CreateGroupModalProps {
  onClose: () => void;
  onGroupCreate?: (users: User[]) => void;
  typeOfModal?: 'create' | 'edit';
  group?: {
    id: number;
    name: string;
    created_by: number;
    update_by?: number;
    members: {
      user: User;
      chat_room_id: number;
      role: 'ADMIN' | 'USER';
    }[];
  };
}
