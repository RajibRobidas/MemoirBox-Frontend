import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Gallery from './pages/Gallery';
import Collections from './pages/Collections';
import Upload from './pages/Upload';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import ProfileSettings from './pages/ProfileSettings';
import Timeline from './pages/Timeline';
import GroupPage from './pages/GroupPage';
import AI from './pages/AI';
import AIBackgroundRemove from './pages/Ai/AIBackgroundRemove';
import AIGhibliArt from './pages/Ai/AIGhibliArt';
import AIObjectRemoval from './pages/Ai/AIObjectRemoval';
import AIInteriorDesign from './pages/Ai/AIInteriorDesign';
import AIImageToImage from './pages/Ai/AIImageToImage';
import AITextToImage from './pages/Ai/AITextToImage';

import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/group" element={<GroupPage />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/ai/remove-background" element={<AIBackgroundRemove />} />
          <Route path="/ai/ghibli-art" element={<AIGhibliArt />} />
          <Route path="/ai/object-removal" element={<AIObjectRemoval />} />
          <Route path="/ai/interior-design" element={<AIInteriorDesign />} />
          <Route path="/ai/image-to-image" element={<AIImageToImage />} />
          <Route path="/ai/text-to-image" element={<AITextToImage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
