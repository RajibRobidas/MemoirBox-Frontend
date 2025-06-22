import React, { useState, useEffect } from 'react';

interface Countdown {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
}

interface CountdownBarProps {
  countdowns: Countdown[];
  onEdit: (countdown: Countdown) => void;
  onDelete: (id: number) => void;
}

const CountdownBar: React.FC<CountdownBarProps> = ({ countdowns, onEdit, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (countdowns.length > 0 && currentIndex >= countdowns.length) {
      setCurrentIndex(countdowns.length - 1);
    }
  }, [countdowns, currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdowns.length > 0 && countdowns[currentIndex]) {
        const timeLeft = calculateTimeLeft(countdowns[currentIndex].date);
        setTimeLeft(timeLeft);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countdowns, currentIndex]);

  const calculateTimeLeft = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();
    return {
      days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
      minutes: Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))),
      seconds: Math.max(0, Math.floor((diff % (1000 * 60)) / 1000))
    };
  };

  const nextMoment = () => {
    if (countdowns.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % countdowns.length);
    }
  };

  const prevMoment = () => {
    if (countdowns.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + countdowns.length) % countdowns.length);
    }
  };

  if (!countdowns || countdowns.length === 0) return null;
  const validIndex = Math.min(currentIndex, countdowns.length - 1);
  const currentCountdown = countdowns[validIndex];
  if (!currentCountdown) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] py-10" style={{
      background: 'linear-gradient(to bottom, #6ec6ff 0%, #e0ea92 100%)',
      borderRadius: '2rem',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      maxWidth: 700,
      margin: '0 auto',
    }}>
      <div className="bg-gray-700 bg-opacity-80 rounded-2xl px-10 py-8 flex flex-col items-center" style={{maxWidth: 700}}>
        <div className="flex items-center justify-center mb-2 gap-4">
          <button onClick={prevMoment} className="text-white text-2xl px-2 py-1 rounded hover:bg-gray-700 transition-colors">&#8592;</button>
          <span className="text-2xl font-bold text-white text-center">{currentCountdown.title}</span>
          <button onClick={nextMoment} className="text-white text-2xl px-2 py-1 rounded hover:bg-gray-700 transition-colors">&#8594;</button>
        </div>
        <div className="flex flex-row gap-6 justify-center w-full mb-4 mt-2">
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-md px-8 py-4 text-3xl font-extrabold text-black mb-2 min-w-[80px] text-center">{timeLeft.days}</div>
            <div className="uppercase text-gray-200 font-bold tracking-wider text-base">days</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-md px-8 py-4 text-3xl font-extrabold text-black mb-2 min-w-[80px] text-center">{timeLeft.hours}</div>
            <div className="uppercase text-gray-200 font-bold tracking-wider text-base">hours</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-md px-8 py-4 text-3xl font-extrabold text-black mb-2 min-w-[80px] text-center">{timeLeft.minutes}</div>
            <div className="uppercase text-gray-200 font-bold tracking-wider text-base">mins</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-md px-8 py-4 text-3xl font-extrabold text-black mb-2 min-w-[80px] text-center">{timeLeft.seconds}</div>
            <div className="uppercase text-gray-200 font-bold tracking-wider text-base">secs</div>
          </div>
        </div>

      </div>
      <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => onEdit(currentCountdown)}
            className="px-6 py-2 bg-white text-gray-800 font-semibold rounded shadow hover:bg-gray-100 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(currentCountdown.id)}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded shadow hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
    </div>
  );
};

export default CountdownBar; 