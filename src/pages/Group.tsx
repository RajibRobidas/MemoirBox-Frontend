import React from 'react';
import MemoryCard from '../components/MemoryCard';
import { memoryService } from '../services/api';

interface Memory {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  collection: string;
  collectionColor: string;
  author?: string;
  description?: string;
}

const Group: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [publicMemories, setPublicMemories] = React.useState<Memory[]>([]);

  // Helper function to get random color for collection
  function getRandomColor() {
    const colors = ['bg-accent', 'bg-success', 'bg-warning', 'bg-info'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Load public memories
  const loadPublicMemories = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const memories = await memoryService.getPublicMemories();
      const transformedMemories = memories.map((memory: any) => ({
        id: memory._id,
        title: memory.title,
        date: memory.date
          ? new Date(memory.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : 'Unknown date',
        imageUrl: Array.isArray(memory.imageUrls) && memory.imageUrls.length > 0 ? memory.imageUrls[0] : '',
        collection: memory.tags?.[0] || 'Uncategorized',
        collectionColor: getRandomColor(),
        author: memory.user?.name || 'Anonymous'
      }));
      setPublicMemories(transformedMemories);
    } catch (err) {
      setError('Failed to load public memories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadPublicMemories();
  }, [loadPublicMemories]);

  const demoMemories: Memory[] = [
    {
      id: 'demo-1',
      title: 'Picnic in the Park',
      date: 'March 20, 2024',
      imageUrl: 'https://i.pinimg.com/736x/d1/d5/95/d1d5957bcbc7816485634f69263f20b7.jpg',
      collection: 'Family Moments',
      collectionColor: 'bg-accent',
      author: 'Alice',
      description: 'A wonderful day spent with family enjoying food and games in the park.'
    },
    {
      id: 'demo-2',
      title: 'Sunset Memories',
      date: 'March 21, 2024',
      imageUrl: 'https://i.pinimg.com/736x/81/f0/d4/81f0d484f859cac49fad34ffba62c3de.jpg',
      collection: 'Travel Adventures',
      collectionColor: 'bg-success',
      author: 'Bob',
      description: 'Capturing the beauty of a sunset during our road trip adventure.'
    },
    {
      id: 'demo-3',
      title: 'Joyful Gathering',
      date: 'March 22, 2024',
      imageUrl: 'https://i.pinimg.com/736x/ff/de/a3/ffdea3d59e1d110fae891ff5984dce3b.jpg',
      collection: 'Celebrations',
      collectionColor: 'bg-warning',
      author: 'Alice',
      description: 'Friends and family gathered for a joyful celebration full of laughter.'
    },
    {
      id: 'demo-4',
      title: 'Friends Forever',
      date: 'March 23, 2024',
      imageUrl: 'https://i.pinimg.com/736x/75/f7/b5/75f7b5aacca7a44ec11c0323bfeda881.jpg',
      collection: 'Friendship',
      collectionColor: 'bg-primary',
      author: 'Bob',
      description: 'Cherishing the bond of friendship with unforgettable moments.'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-8">Public Memories</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : error ? (
          <div className="text-center text-error p-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {demoMemories.map((memory) => (
              <MemoryCard key={memory.id} {...memory} />
            ))}
            {publicMemories.map((memory) => (
              <MemoryCard key={memory.id} {...memory} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Group; 