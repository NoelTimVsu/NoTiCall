import type { User } from '@/store/useChatStore';

export interface CreateGroupModalProps {
  onClose: () => void;
  onGroupCreate?: (users: User[]) => void;
  typeOfModal?: 'create' | 'edit';
  group?: {
    id: number;
    name: string;
    members: {
      user: User;
    }[];
  };
}
