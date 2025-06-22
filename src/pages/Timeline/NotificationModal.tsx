import React, { useState } from 'react';

interface Countdown {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
}

const NotificationModal: React.FC<{
  countdown: Countdown;
  settings: number[];
  onSave: (times: number[]) => void;
  onClose: () => void;
}> = ({ countdown, settings, onSave, onClose }) => {
  const [times, setTimes] = useState<{h: number, m: number}[]>(settings.map(t => ({h: Math.floor(t/60), m: t%60})));
  const [customH, setCustomH] = useState('');
  const [customM, setCustomM] = useState('');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Notification for {countdown.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <input type="number" min={0} placeholder="Hours" value={customH} onChange={e => setCustomH(e.target.value)} className="border px-2 py-1 rounded w-20" />
            <input type="number" min={0} max={59} placeholder="Minutes" value={customM} onChange={e => setCustomM(e.target.value)} className="border px-2 py-1 rounded w-20" />
            <button onClick={() => {
              const h = Number(customH)||0, m = Number(customM)||0;
              if (h > 0 || m > 0) {
                setTimes(t => [...t, {h, m}]);
                setCustomH(''); setCustomM('');
              }
            }} className="px-2 py-1 bg-blue-500 text-white rounded">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {times.map((t, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-200 rounded-full flex items-center">
                {t.h > 0 ? `${t.h}h ` : ''}{t.m > 0 ? `${t.m}m ` : ''}before
                <button onClick={() => setTimes(ts => ts.filter((_, i) => i !== idx))} className="ml-1 text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
          <button onClick={() => onSave(times.map(t => t.h*60 + t.m))} className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-green-400">Save</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal; 