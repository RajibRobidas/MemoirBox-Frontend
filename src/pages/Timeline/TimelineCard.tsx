import React from 'react';

interface TimelineCardProps {
  title: string;
  date: string;
  type: string;
  description: string;
  imageUrl: string;
  isLarge?: boolean;
  style?: React.CSSProperties;
  cardStyle?: 'modern';
}

const typeColors: Record<string, string> = {
  Birthday: 'bg-pink-100 text-pink-700',
  Marriage: 'bg-green-100 text-green-700',
  Anniversary: 'bg-yellow-100 text-yellow-700',
  'Travel Adventures': 'bg-green-200 text-green-800',
  'Family Moments': 'bg-indigo-200 text-indigo-800',
  // Add more types as needed
};

const TimelineCard: React.FC<TimelineCardProps> = ({ title, date, type, description, imageUrl, isLarge, style, cardStyle }) => {
  // Format date
  const formattedDate = new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  if (isLarge) {
    return (
      <div
        className="rounded-xl shadow-lg bg-white overflow-hidden flex flex-col items-center p-0 my-12 hover:shadow-2xl transition-shadow duration-300"
        style={{ minHeight: style?.minHeight || 450, ...style }}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[450px] object-cover rounded-t-xl"
        />
        <div className="w-full px-8 py-6 flex flex-col items-start">
          <h3 className="font-bold text-3xl mb-3">{title}</h3>
          <div className="flex items-center gap-2 mb-3 text-lg">
            <span className="text-sm text-gray-500">{formattedDate}</span>
            <span className={`px-2 py-1 rounded-full font-semibold text-xs ${typeColors[type] || 'bg-blue-100 text-blue-700'}`}>{type}</span>
          </div>
          <p className="text-gray-700 text-lg mb-2">{description}</p>
        </div>
      </div>
    );
  }

  if (cardStyle === 'modern') {
    // Modern card style: image on top, rounded, badge, title, date, type badge below image
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden w-full mb-6 flex flex-col min-w-0">
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          {/* Example: favorite icon placeholder, can be added here if needed */}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <span className={`mb-2 px-3 py-1 rounded-full text-xs font-semibold w-fit ${typeColors[type] || 'bg-blue-100 text-blue-700'}`}>{type}</span>
          <h3 className="font-bold text-lg mb-1 truncate">{title}</h3>
          <p className="text-gray-500 text-sm mb-2">{formattedDate}</p>
          <p className="text-gray-700 text-sm line-clamp-3 flex-1">{description}</p>
        </div>
      </div>
    );
  }

  // Default (non-large) card: image thumbnail left, content right
  return (
    <div className="flex items-center bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mb-4 p-3 gap-4 max-w-xl mx-auto border border-gray-100">
      <img
        src={imageUrl}
        alt={title}
        className="w-24 h-24 object-cover rounded-lg flex-shrink-0 border border-gray-200"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg mb-1 truncate">{title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500">{formattedDate}</span>
          <span className={`px-2 py-1 rounded-full font-semibold text-xs ${typeColors[type] || 'bg-blue-100 text-blue-700'}`}>{type}</span>
        </div>
        <p className="text-gray-700 text-sm line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

export default TimelineCard; 