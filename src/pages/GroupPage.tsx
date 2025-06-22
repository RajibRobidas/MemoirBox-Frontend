import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { memoryService } from '../services/api';

interface Memory {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  likes: string[];
  comments: Array<{
    _id: string;
    user: {
      name: string;
      email: string;
    };
    text: string;
    createdAt: string;
  }>;
  imageUrls?: string[];
}

// Demo memories
const demoMemories: Memory[] = [
  {
    _id: 'demo1-old',
    title: 'Summer Beach Day',
    description: 'A perfect day at the beach with friends and family',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    createdAt: '2024-03-15T10:00:00.000Z',
    user: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    likes: [],
    comments: [],
    imageUrls: []
  },
  {
    _id: 'demo2-old',
    title: 'Mountain Hiking Adventure',
    description: 'Exploring the beautiful mountain trails',
    imageUrl: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2024-03-10T14:30:00.000Z',
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    likes: [],
    comments: [],
    imageUrls: []
  },
  {
    _id: 'demo3-old',
    title: 'Birthday Celebration',
    description: 'Unforgettable birthday party with loved ones',
    imageUrl: 'https://images.pixabay.com/photo-2017/07/21/23/57/concert-2527495_1280.jpg',
    createdAt: '2024-03-08T18:00:00.000Z',
    user: {
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    likes: [],
    comments: [],
    imageUrls: []
  },
  {
    _id: 'demo1',
    title: 'Picnic in the Park',
    description: 'A wonderful day spent with family enjoying food and games in the park.',
    imageUrl: 'https://i.pinimg.com/736x/d1/d5/95/d1d5957bcbc7816485634f69263f20b7.jpg',
    createdAt: '2024-03-20T10:00:00.000Z',
    user: {
      name: 'Alice',
      email: 'alice@example.com'
    },
    likes: [],
    comments: [],
    imageUrls: []
  },
  {
    _id: 'demo2',
    title: 'Sunset Memories',
    description: 'Capturing the beauty of a sunset during our road trip adventure.',
    imageUrl: 'https://i.pinimg.com/736x/81/f0/d4/81f0d484f859cac49fad34ffba62c3de.jpg',
    createdAt: '2024-03-21T18:30:00.000Z',
    user: {
      name: 'Bob',
      email: 'bob@example.com'
    },
    likes: [],
    comments: [],
    imageUrls: []
  },
  {
    _id: 'demo3',
    title: 'Joyful Gathering',
    description: 'Friends and family gathered for a joyful celebration full of laughter.',
    imageUrl: 'https://i.pinimg.com/736x/ff/de/a3/ffdea3d59e1d110fae891ff5984dce3b.jpg',
    createdAt: '2024-03-22T15:00:00.000Z',
    user: {
      name: 'Alice',
      email: 'alice@example.com'
    },
    likes: [],
    comments: [],
    imageUrls: []
  },
  {
    _id: 'demo4',
    title: 'Friends Forever',
    description: 'Cherishing the bond of friendship with unforgettable moments.',
    imageUrl: 'https://i.pinimg.com/736x/75/f7/b5/75f7b5aacca7a44ec11c0323bfeda881.jpg',
    createdAt: '2024-03-23T12:00:00.000Z',
    user: {
      name: 'Bob',
      email: 'bob@example.com'
    },
    likes: [],
    comments: [],
    imageUrls: []
  }
];

const GroupPage: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicMemories();
  }, []);

  const fetchPublicMemories = async () => {
    try {
      const data = await memoryService.getPublicMemories();
      setMemories(data || []);
    } catch (err) {
      setError('Failed to load memories');
      console.error('Error fetching memories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (memoryId: string) => {
    try {
      const updatedMemory = await memoryService.likeMemory(memoryId);
      setMemories(prevMemories =>
        prevMemories.map(memory =>
          memory._id === memoryId ? updatedMemory : memory
        )
      );
    } catch (err) {
      console.error('Error liking memory:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-error text-center">
          <p className="text-xl font-semibold mb-2">{error}</p>
          <button
            onClick={fetchPublicMemories}
            className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-8">Public Memories</h1>
        
        {/* Demo Memories Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Featured Memories</h2>
          <div className="space-y-6">
            {demoMemories.map(memory => (
              <div key={memory._id} className="bg-white rounded-xl shadow-warm overflow-hidden">
                {/* Memory Header */}
                <div className="p-4 border-b border-border-light">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(memory.user?.name || 'Anonymous')}&background=random`}
                        alt={memory.user?.name || 'Anonymous'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-text-primary">{memory.user?.name || 'Anonymous'}</h3>
                      <p className="text-sm text-text-secondary">
                        {memory.createdAt ? format(new Date(memory.createdAt), 'MMM d, yyyy • h:mm a') : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Memory Image */}
                <div className="relative aspect-w-16 aspect-h-9">
                  <img
                    src={memory.imageUrls && memory.imageUrls.length > 0 ? memory.imageUrls[0] : (memory.imageUrl || '')}
                    alt={memory.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3';
                    }}
                  />
                </div>

                {/* Memory Content */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-text-primary mb-2">{memory.title}</h2>
                  <p className="text-text-secondary mb-4">{memory.description}</p>
                  
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(memory._id)}
                    className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    <span>{memory.likes?.length || 0} likes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Public Memories Section */}
        {memories.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Community Memories</h2>
            <div className="space-y-6">
              {memories.map(memory => (
                <div key={memory._id} className="bg-white rounded-xl shadow-warm overflow-hidden">
                  {/* Memory Header */}
                  <div className="p-4 border-b border-border-light">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(memory.user?.name || 'Anonymous')}&background=random`}
                          alt={memory.user?.name || 'Anonymous'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-text-primary">{memory.user?.name || 'Anonymous'}</h3>
                        <p className="text-sm text-text-secondary">
                          {memory.createdAt ? format(new Date(memory.createdAt), 'MMM d, yyyy • h:mm a') : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Memory Image */}
                  <div className="relative aspect-w-16 aspect-h-9">
                    <img
                      src={memory.imageUrls && memory.imageUrls.length > 0 ? memory.imageUrls[0] : (memory.imageUrl || '')}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3';
                      }}
                    />
                  </div>

                  {/* Memory Content */}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-text-primary mb-2">{memory.title}</h2>
                    <p className="text-text-secondary mb-2">{memory.description}</p>
                    <p className="text-sm text-text-secondary mb-4">
                      {memory.createdAt ? format(new Date(memory.createdAt), 'MMM d, yyyy • h:mm a') : 'Unknown date'}
                    </p>
                    {/* Like Button */}
                    <button
                      onClick={() => handleLike(memory._id)}
                      className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      <span>{memory.likes?.length || 0} likes</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage; 