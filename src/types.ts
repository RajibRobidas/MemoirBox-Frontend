export interface Collection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  memoryCount: number;
  lastUpdated: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  privacy: 'private' | 'shared';
} 