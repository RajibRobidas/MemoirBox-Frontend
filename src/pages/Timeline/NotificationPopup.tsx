import React from 'react';

interface Countdown {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
}

const NotificationPopup: React.FC<{
  countdowns: Countdown[];
  onClose: () => void;
  onSelectCountdown: (cd: Countdown) => void;
}> = ({ countdowns, onClose, onSelectCountdown }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Set Notification</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-2">
        {countdowns.map((cd: Countdown) => (
          <button key={cd.id} onClick={() => onSelectCountdown(cd)} className="w-full text-left px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white font-medium mb-2 hover:from-pink-400 hover:to-blue-400 transition-all">
            {cd.title} ({cd.date})
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default NotificationPopup; 