import React, { useState, useEffect } from 'react';
import './Timeline.css';
import CountdownBar from './Timeline/CountdownBar';
import CountdownCreationModal from './Timeline/CountdownCreationModal';
import CountdownEditModal from './Timeline/CountdownEditModal';
import NotificationPopup from './Timeline/NotificationPopup';
import NotificationModal from './Timeline/NotificationModal';
import TimelineCard from './Timeline/TimelineCard';
import axios from 'axios';
import { memoryService } from '../services/api';

const filterChips = [
  'All Memories',
  'Family',
  'Travel',
  'Celebrations',
  'Nature',
];

const timelineData = [
  {
    month: 'December 2024',
    memories: [
      {
        title: 'Christmas Morning',
        date: 'December 25, 2024',
        imageUrl: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['Family', 'Holiday'],
        liked: false,
      },
      {
        title: 'Holiday Baking',
        date: 'December 22, 2024',
        imageUrl: 'https://images.pixabay.com/photo/2016/11/29/09/00/doughnuts-1868573_960_720.jpg',
        tags: ['Cooking', 'Holiday'],
        liked: true,
      },
    ],
  },
  {
    month: 'November 2024',
    memories: [
      {
        title: 'Autumn Hike',
        date: 'November 15, 2024',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        tags: ['Nature', 'Adventure'],
        liked: false,
      },
      {
        title: 'Thanksgiving Dinner',
        date: 'November 28, 2024',
        imageUrl: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['Family', 'Food'],
        liked: false,
      },
      {
        title: 'Garden Memories',
        date: 'November 8, 2024',
        imageUrl: 'https://images.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_960_720.jpg',
        tags: ['Nature', 'Garden'],
        liked: true,
      },
    ],
  },
];

// Update special moments data with more personal events
const specialMoments = [
  {
    title: 'Mom\'s Birthday',
    date: '2024-12-25',
    type: 'Birthday',
    description: 'Mom\'s 50th Birthday Celebration'
  },
  {
    title: 'Wedding Anniversary',
    date: '2025-01-15',
    type: 'Anniversary',
    description: '5th Wedding Anniversary'
  },
  {
    title: 'Graduation Day',
    date: '2025-02-14',
    type: 'Academic',
    description: 'University Graduation Ceremony'
  },
  {
    title: 'Family Reunion',
    date: '2025-03-20',
    type: 'Family',
    description: 'Annual Family Get-together'
  },
  {
    title: 'Vacation Trip',
    date: '2025-04-10',
    type: 'Travel',
    description: 'Summer Vacation in Bali'
  }
];

// Add Countdown type
interface Countdown {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
}

// Add CountdownBarProps interface
interface CountdownBarProps {
  countdowns: Countdown[];
  onEdit: (countdown: Countdown) => void;
  onDelete: (id: number) => void;
}

// UploadedTimelineCard: uses the same template as demo card
const UploadedTimelineCard = ({ card }: { card: any }) => (
  <div className="group bg-white rounded-xl shadow-warm hover:shadow-warm-md transition-all duration-300 overflow-hidden">
    <div className="aspect-photo overflow-hidden">
      <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; }} />
    </div>
    <div className="p-4">
      <h4 className="font-heading font-medium text-text-primary mb-1">{card.title}</h4>
      <p className="text-sm text-text-secondary mb-2">{new Date(card.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {card.type && <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs rounded-full">{card.type}</span>}
        </div>
      </div>
      {card.description && <p className="text-xs text-gray-500 mt-2">{card.description}</p>}
    </div>
  </div>
);

const Timeline: React.FC = () => {
  const [activeChip, setActiveChip] = useState('All Memories');
  const [timelineView, setTimelineView] = useState('Year View');
  const [filters, setFilters] = useState({ people: false, locations: false, favorites: false });
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [countdowns, setCountdowns] = useState<Countdown[]>(() => {
    const savedCountdowns = localStorage.getItem('countdowns');
    return savedCountdowns ? JSON.parse(savedCountdowns) : [];
  });
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedCountdown, setSelectedCountdown] = useState<Countdown | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<{ [id: number]: number[] }>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {};
  });
  const [editCountdown, setEditCountdown] = useState<Countdown | null>(null);
  const [timelineCards, setTimelineCards] = useState<any[]>([]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCard, setNewCard] = useState<{ title: string; date: string; type: string; description: string; imageUrl: string; imageFile: File | null }>({ title: '', date: '', type: '', description: '', imageUrl: '', imageFile: null });
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [inAppNotification, setInAppNotification] = useState<string | null>(null);
  const [missedNotifications, setMissedNotifications] = useState<string[]>([]);
  const [showMissedPopup, setShowMissedPopup] = useState(false);

  useEffect(() => {
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [countdowns, notificationSettings]);

  useEffect(() => {
    if (!('Notification' in window)) return;
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        alert('Notifications are blocked or denied. Please allow notifications in your browser settings.');
      }
    });

    let timers: NodeJS.Timeout[] = [];

    countdowns.forEach(cd => {
      const notifyTimes = notificationSettings[cd.id] || [];
      notifyTimes.forEach(mins => {
        const target = new Date(cd.date).getTime() - mins * 60 * 1000;
        const now = Date.now();
        if (target > now) {
          console.log(`Scheduling notification for '${cd.title}' in ${Math.floor((target-now)/1000)} seconds (${Math.floor(mins/60)}h ${mins%60}m before)`);
          const timeout = setTimeout(() => {
            console.log(`Triggering notification for '${cd.title}' (${Math.floor(mins/60)}h ${mins%60}m before)`);
            if (Notification.permission === 'granted') {
              new Notification(`Countdown: ${cd.title}`, {
                body: `${Math.floor(mins/60)}h ${mins%60}m left!`
              });
            } else {
              setInAppNotification(`Your event '${cd.title}' is ${Math.floor(mins/60) > 0 ? Math.floor(mins/60) + ' hour' + (Math.floor(mins/60) > 1 ? 's' : '') : ''}${Math.floor(mins/60) > 0 && mins%60 > 0 ? ' and ' : ''}${mins%60 > 0 ? mins%60 + ' minute' + (mins%60 > 1 ? 's' : '') : ''} away!`);
            }
          }, target - now);
          timers.push(timeout);
        } else {
          console.warn(`Notification for '${cd.title}' at ${Math.floor(mins/60)}h ${mins%60}m before is in the past and will not be scheduled.`);
        }
      });
    });

    return () => timers.forEach(clearTimeout);
  }, [countdowns, notificationSettings]);

  useEffect(() => {
    const fetchTimelineCards = async () => {
      try {
        const response = await memoryService.getTimelineCards();
        setTimelineCards(response);
      } catch (error) {
        console.error('Error fetching timeline cards:', error);
      }
    };

    fetchTimelineCards();
  }, []);

  useEffect(() => {
    // Check for missed notifications on load
    const lastCheck = parseInt(localStorage.getItem('lastNotificationCheck') || '0', 10);
    const now = Date.now();
    let missed: string[] = [];
    countdowns.forEach(cd => {
      const notifyTimes = notificationSettings[cd.id] || [];
      notifyTimes.forEach(mins => {
        const target = new Date(cd.date).getTime() - mins * 60 * 1000;
        if (target < now && target > lastCheck) {
          // Missed notification
          missed.push(`Your event '${cd.title}' was ${Math.floor(mins/60) > 0 ? Math.floor(mins/60) + ' hour' + (Math.floor(mins/60) > 1 ? 's' : '') : ''}${Math.floor(mins/60) > 0 && mins%60 > 0 ? ' and ' : ''}${mins%60 > 0 ? mins%60 + ' minute' + (mins%60 > 1 ? 's' : '') : ''} ago!`);
        }
      });
    });
    if (missed.length > 0) {
      setMissedNotifications(missed);
      setShowMissedPopup(true);
    }
    localStorage.setItem('lastNotificationCheck', now.toString());
  }, []); // Only run on mount

  const handleCreateCountdown = (newCountdown: Countdown) => {
    setCountdowns([...countdowns, { ...newCountdown, id: Date.now() }]);
    setShowCountdownModal(false);
  };

  const handleEditCountdown = (countdown: Countdown) => {
    setCountdowns(countdowns.map(c => c.id === countdown.id ? countdown : c));
  };

  const handleDeleteCountdown = (id: number) => {
    setCountdowns(countdowns.filter(c => c.id !== id));
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const cardDetails = newCard;
    setUploadError(''); // Clear previous errors
    if (!cardDetails.title || !cardDetails.date || !cardDetails.type || !cardDetails.imageFile) {
      setUploadError('Please fill all required fields and select an image');
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const imageFile = cardDetails.imageFile;
      let newImageUrl = cardDetails.imageUrl;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        try {
          const uploadRes = await memoryService.uploadTimelineCardImage(formData);
          // Accept both imageUrl and secure_url for compatibility
          newImageUrl = uploadRes.imageUrl || uploadRes.secure_url;
          if (!newImageUrl) {
            setUploadError('Image upload failed: No image URL returned.');
            setIsUploading(false);
            return;
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          setUploadError('Image upload failed. Please try again.');
          setIsUploading(false);
          return;
        }
      }

      if (!newImageUrl) {
        setUploadError('Image upload failed. No image URL available.');
        setIsUploading(false);
        return;
      }

      const cardData = {
        title: cardDetails.title,
        date: cardDetails.date,
        type: cardDetails.type,
        description: cardDetails.description,
        imageUrl: newImageUrl
      };

      console.log('Creating timeline card with data:', cardData);

      try {
        const createdCard = await memoryService.createTimelineCard(cardData);
        setTimelineCards([...timelineCards, createdCard]);
        setShowAddCardModal(false);
        setNewCard({ title: '', date: '', type: '', description: '', imageUrl: '', imageFile: null });
        setUploadSuccess(true);
      } catch (error) {
        console.error('Error creating timeline card:', error);
        setUploadError('Failed to create timeline card. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setUploadError('An unexpected error occurred. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="timeline-container">
      {/* Timeline Controls (Sidebar) */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 timeline-sidebar z-40 pt-20">
        <div className="p-6 space-y-6">
          {/* Date Range Picker */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Date Range</h3>
            <div className="space-y-2">
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                value={dateRange.from} 
                onChange={e => setDateRange({ ...dateRange, from: e.target.value })} 
              />
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                value={dateRange.to} 
                onChange={e => setDateRange({ ...dateRange, to: e.target.value })} 
              />
            </div>
          </div>

          {/* Countdown Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Countdowns ({countdowns.length})</h3>
            <div className="mb-4">
              <button
                onClick={() => setShowCountdownModal(true)}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-100 text-purple-800 rounded-lg hover:from-pink-100 hover:to-purple-200 transition-all duration-300 shadow"
              >
                Create Countdown
              </button>
            </div>
            <button
              onClick={() => setShowNotificationPopup(true)}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-100 text-purple-800 rounded-lg hover:from-pink-100 hover:to-purple-200 transition-all duration-300 mt-2 shadow"
            >
              Set Notification
            </button>
          </div>

          {/* Timeline Zoom */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Timeline View</h3>
            <div className="space-y-2">
              {['Year View', 'Month View', 'Day View'].map((view) => (
                <button
                  key={view}
                  className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                    timelineView === view 
                      ? 'bg-primary text-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setTimelineView(view)}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary focus:ring-primary" 
                  checked={filters.people} 
                  onChange={() => setFilters(f => ({ ...f, people: !f.people }))} 
                />
                <span className="ml-2 text-sm text-gray-600">People</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary focus:ring-primary" 
                  checked={filters.locations} 
                  onChange={() => setFilters(f => ({ ...f, locations: !f.locations }))} 
                />
                <span className="ml-2 text-sm text-gray-600">Locations</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary focus:ring-primary" 
                  checked={filters.favorites} 
                  onChange={() => setFilters(f => ({ ...f, favorites: !f.favorites }))} 
                />
                <span className="ml-2 text-sm text-gray-600">Favorites</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen timeline-content">
        <div className="px-4 py-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Countdown Bar - Moved to top */}
            {countdowns.length > 0 && (
              <div className="mb-8">
                <CountdownBar 
                  countdowns={countdowns}
                  onEdit={setEditCountdown}
                  onDelete={handleDeleteCountdown}
                />
              </div>
            )}

            {/* Timeline Today label */}
            <div className="mt-20 text-2xl font-bold text-gray-800 text-center my-10">Timeline Today</div>

            {/* Show the most recent uploaded (future) card as a large card under the countdown */}
            {(() => {
              const futureCards = timelineCards.filter((card: any) => new Date(card.date) >= new Date());
              if (futureCards.length === 0) return null;
              const mostRecent = futureCards[futureCards.length - 1];
              return <TimelineCard key={mostRecent.title+mostRecent.date} {...mostRecent} isLarge style={{ minHeight: 320 }} />;
            })()}

            {/* Add Timeline Card Button after large card */}
            <div className="mb-4 flex justify-center">
              <button onClick={() => setShowAddCardModal(true)} className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition-colors">Add Timeline Card</button>
            </div>

            {/* Show demo cards (timelineData) first */}
                {timelineData.map((section, idx) => (
                  <div className="relative" key={section.month}>
                    {/* Date Marker */}
                    <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-warm"></div>
                    <div className="ml-16">
                      <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">{section.month}</h3>
                      {/* Memory Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {section.memories.map((mem, i) => (
                          <div key={mem.title} className="group bg-white rounded-xl shadow-warm hover:shadow-warm-md transition-all duration-300 overflow-hidden">
                            <div className="aspect-photo overflow-hidden">
                              <img src={mem.imageUrl} alt={mem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; }} />
                            </div>
                            <div className="p-4">
                              <h4 className="font-heading font-medium text-text-primary mb-1">{mem.title}</h4>
                              <p className="text-sm text-text-secondary mb-2">{mem.date}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {mem.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-accent-100 text-accent-700 text-xs rounded-full">{tag}</span>
                                  ))}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button className={`p-1 ${mem.liked ? 'text-error' : 'text-text-secondary hover:text-error transition-smooth'}`}>
                                    <svg className="w-4 h-4" fill={mem.liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                    </svg>
                                  </button>
                                  <button className="p-1 text-text-secondary hover:text-primary transition-smooth">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

            {/* Timeline Today label */}
            <div className="mt-20 text-2xl font-bold text-gray-800 text-center my-10">Timeline Past</div>

            {/* Show all other uploaded cards (future and past, except the most recent future card) after demo cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timelineCards.filter((card: any) => {
              const isFuture = new Date(card.date) >= new Date();
              const futureCards = timelineCards.filter((c: any) => new Date(c.date) >= new Date());
              const mostRecent = futureCards.length > 0 ? futureCards[futureCards.length - 1] : null;
              return !isFuture || (mostRecent && (card._id !== mostRecent._id));
            }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((card: any) => (
              <UploadedTimelineCard key={card.title+card.date} card={card} />
            ))}
            </div>
          </div>
        </div>
      </main>

      {/* Countdown Creation Modal */}
      {showCountdownModal && (
        <CountdownCreationModal
          isOpen={showCountdownModal}
          onClose={() => setShowCountdownModal(false)}
          onSave={handleCreateCountdown}
        />
      )}

      {showNotificationPopup && (
        <NotificationPopup
          countdowns={countdowns}
          onClose={() => setShowNotificationPopup(false)}
          onSelectCountdown={(cd: Countdown) => {
            setSelectedCountdown(cd);
            setShowNotificationModal(true);
            setShowNotificationPopup(false);
          }}
        />
      )}

      {showNotificationModal && selectedCountdown && (
        <NotificationModal
          countdown={selectedCountdown}
          settings={(notificationSettings[selectedCountdown.id] as number[] ?? [])}
          onSave={(times: number[]) => {
            const cd = selectedCountdown;
            if (cd) {
              const now = Date.now();
              const eventTime = new Date(cd.date).getTime();
              const invalid = times.some(mins => (eventTime - mins * 60 * 1000) <= now);
              if (invalid) {
                alert('One or more notification times are in the past and will not be scheduled. Please choose a future time.');
      return;
    }
            }
            setNotificationSettings(prev => ({ ...prev, [selectedCountdown.id]: times }));
            setShowNotificationModal(false);
          }}
          onClose={() => setShowNotificationModal(false)}
        />
      )}

      {editCountdown && (
        <CountdownEditModal
          isOpen={!!editCountdown}
          onClose={() => setEditCountdown(null)}
          onSave={(cd: Countdown) => {
            handleEditCountdown(cd);
            setEditCountdown(null);
          }}
          editData={editCountdown}
        />
      )}

      {/* Add new card modal */}
      {showAddCardModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Timeline Card</h2>
              <button onClick={() => setShowAddCardModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
              <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Title" value={newCard.title} onChange={e => setNewCard({ ...newCard, title: e.target.value })} />
              <input type="date" className="w-full px-3 py-2 border rounded" value={newCard.date} onChange={e => setNewCard({ ...newCard, date: e.target.value })} />
              <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Type (e.g. Birthday, Marriage)" value={newCard.type} onChange={e => setNewCard({ ...newCard, type: e.target.value })} />
              <textarea className="w-full px-3 py-2 border rounded" placeholder="Description" value={newCard.description} onChange={e => setNewCard({ ...newCard, description: e.target.value })} />
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files && e.target.files[0];
                if (file) {
                  setNewCard(card => ({ ...card, imageFile: file }));
                  const reader = new FileReader();
                  reader.onload = ev => setNewCard(card => ({ ...card, imageUrl: ev.target?.result as string }));
                  reader.readAsDataURL(file);
                }
              }} />
              {newCard.imageUrl && <img src={newCard.imageUrl} alt="Preview" className="w-full h-40 object-cover rounded" />}
              {uploadError && <div className="text-red-600 text-sm">{uploadError}</div>}
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  <div className="text-xs text-gray-500 mt-1">Uploading... {Math.round(uploadProgress)}%</div>
                </div>
              )}
              {uploadSuccess && <div className="text-green-600 text-sm">Upload successful!</div>}
          </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setShowAddCardModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
              <button
                onClick={handleAddCard}
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Add'}
              </button>
          </div>
          </div>
        </div>
      )}

      {inAppNotification && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded shadow z-50 flex items-center">
          <span>{inAppNotification}</span>
          <button onClick={() => setInAppNotification(null)} className="ml-4 bg-white text-blue-500 px-2 py-1 rounded">Close</button>
        </div>
      )}

      {/* Centered missed notification popup */}
      {showMissedPopup && missedNotifications.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg border-2 border-blue-500 text-center max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Missed Notification</h2>
            {missedNotifications.map((msg, idx) => (
              <div key={idx} className="mb-2 text-gray-800">{msg}</div>
            ))}
            <button onClick={() => setShowMissedPopup(false)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline; 