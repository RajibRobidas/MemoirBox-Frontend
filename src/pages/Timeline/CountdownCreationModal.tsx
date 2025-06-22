import React, { useState, useEffect } from 'react';

interface Countdown {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
}

const CountdownCreationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Countdown) => void;
  editData?: Countdown;
}> = ({ isOpen, onClose, onSave, editData }) => {
  const [formData, setFormData] = useState<Omit<Countdown, 'id'>>({
    title: editData?.title || '',
    date: editData?.date || '',
    type: editData?.type || 'Birthday',
    description: editData?.description || ''
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        date: editData.date,
        type: editData.type,
        description: editData.description
      });
    } else {
      setFormData({
        title: '',
        date: '',
        type: 'Birthday',
        description: ''
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = () => {
    if (!formData.title || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }
    onSave({ ...formData, id: editData?.id || Date.now() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{editData ? 'Edit Countdown' : 'Create New Countdown'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Wedding Anniversary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Holiday">Holiday</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add a description..."
              rows={3}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={handleSubmit}
          >
            {editData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountdownCreationModal; 