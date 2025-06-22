import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaBoxOpen } from 'react-icons/fa';
import MainNavigation from '../components/MainNavigation';
import CommunitySection from '../components/CommunitySection';

const LandingPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigation = (path: string, sectionId?: string) => {
    if (sectionId) {
      navigate(path);
      setTimeout(() => scrollToSection(sectionId), 100);
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    // Statistics counter animation
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target.querySelector('[data-count]');
          if (counter && !counter.classList.contains('counted')) {
            counter.classList.add('counted');
            animateCounter(counter);
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.progressive-reveal').forEach(el => {
      observer.observe(el);
    });

    // Progressive reveal animation
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.progressive-reveal').forEach(el => {
      revealObserver.observe(el);
    });

    // Add loading states for images
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
    });

    return () => {
      observer.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  const animateCounter = (element: Element) => {
    const target = parseInt(element.getAttribute('data-count') || '0');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + (target >= 1000 ? '+' : '+');
    }, 16);
  };

  return (
    <div className="bg-gray-50 text-text-primary flex min-h-screen">
      {/* Collapsible Sidebar */}
      <div className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} bg-gray-100 border-r border-gray-200 w-64 shadow-lg flex flex-col`}>
        <button
          className="absolute top-4 right-4 p-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-smooth"
          onClick={() => setSidebarOpen(false)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <nav className="mt-20 flex flex-col space-y-2 px-6">
          <button onClick={() => handleNavigation('/', 'hero')} className="py-2 px-4 rounded-lg hover:bg-gray-200 font-medium text-left">Home</button>
          <button onClick={() => handleNavigation('/', 'stories')} className="py-2 px-4 rounded-lg hover:bg-gray-200 font-medium text-left">Stories</button>
          <button onClick={() => handleNavigation('/', 'groups')} className="py-2 px-4 rounded-lg hover:bg-gray-200 font-medium text-left">Groups</button>
          <button onClick={() => handleNavigation('/', 'ai-features')} className="py-2 px-4 rounded-lg hover:bg-gray-200 font-medium text-left">AI Features</button>
          <button onClick={() => handleNavigation('/', 'fun')} className="py-2 px-4 rounded-lg hover:bg-gray-200 font-medium text-left">Let's Have Fun</button>
        </nav>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-700 text-white hover:bg-gray-900 transition-smooth shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : ''} px-4 md:px-12`}>
        <div className="bg-background text-text-primary">
          {/* Hero Section */}
          <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white rounded-xl shadow-lg mx-4 my-8">
            {/* Background Image with Reflection Effect */}
            <div className="absolute inset-0 z-0 rounded-xl overflow-hidden">
              <div className="relative h-full">
                <img 
                  // src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  // src='https://thumbs.dreamstime.com/b/happy-young-groom-his-friends-standing-together-outdoors-laughing-groomsmen-suits-hold-smiling-groom-under-his-arms-108751604.jpg?w=768'
                  src='https://i.pinimg.com/736x/30/a4/aa/30a4aa660462b2f28844af2d803663c0.jpg'
                  alt="Nostalgic memories" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
                  }}
                />
                {/* Reflection Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50/80 via-gray-50/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent transform scale-y-[-1] opacity-30"></div>
              </div>
            </div>
            
            {/* Hero Content */}
            <div className="relative z-10 text-center px-4">
              <h1 className="text-5xl md:text-7xl font-playfair font-bold text-gray-900 mb-6 leading-tight">
                Time Travel<br />
                <span className="text-accent">BECOMES REALITY!</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Preserve your precious memories and share nostalgic stories with AI-enhanced features that bring your past to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="bg-accent text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-400 transition-colors duration-300 transform hover:-translate-y-1">Start Your Journey</Link>
                <a href="#features" className="bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors duration-300 transform hover:-translate-y-1">Explore Features</a>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-16 h-16 bg-accent/20 rounded-full ambient-float"></div>
            <div className="absolute bottom-32 right-16 w-12 h-12 bg-secondary/20 rounded-full ambient-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 right-8 w-8 h-8 bg-primary/20 rounded-full ambient-float" style={{ animationDelay: '4s' }}></div>
          </section>


          {/* Statistics Section */}
          <section className="py-16 bg-white rounded-xl shadow-lg mx-4 my-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="progressive-reveal">
                  <div className="text-4xl md:text-6xl font-playfair font-bold text-primary mb-2" data-count="12">0</div>
                  <p className="text-lg text-gray-500">Years of Memories</p>
                </div>
                <div className="progressive-reveal">
                  <div className="text-4xl md:text-6xl font-playfair font-bold text-secondary mb-2" data-count="100">0</div>
                  <p className="text-lg text-gray-500">Thousand Stories</p>
                </div>
                <div className="progressive-reveal">
                  <div className="text-4xl md:text-6xl font-playfair font-bold text-accent-600 mb-2" data-count="10000">0</div>
                  <p className="text-lg text-gray-500">Happy Users</p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-white rounded-xl shadow-lg mx-4 my-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">Unlock Your Memories</h2>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">Experience the magic of time travel through our innovative features designed to preserve and enhance your precious moments.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1: Time & Place Unlocks */}
                <div className="memory-card p-8 text-center group bg-gray-50 rounded-xl shadow-md">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-playfair font-semibold text-primary mb-4">Time & Place Unlocks</h3>
                  <p className="text-gray-600 leading-relaxed">Discover memories based on specific locations and time periods. Our intelligent system helps you rediscover forgotten moments tied to special places.</p>
                </div>
                
                {/* Feature 2: AI Captions & Dreamy Filters */}
                <div className="memory-card p-8 text-center group bg-gray-50 rounded-xl shadow-md">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
                    <svg className="w-8 h-8 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-playfair font-semibold text-secondary mb-4">AI Captions & Dreamy Filters</h3>
                  <p className="text-gray-600 leading-relaxed">Let AI enhance your memories with intelligent captions and beautiful filters that capture the essence of your nostalgic moments.</p>
                </div>
                
                {/* Feature 3: Legacy Nominees Zero Worry */}
                <div className="memory-card p-8 text-center group bg-gray-50 rounded-xl shadow-md">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/30 transition-colors duration-300">
                    <svg className="w-8 h-8 text-accent-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-playfair font-semibold text-accent-600 mb-4">Legacy Nominees Zero Worry</h3>
                  <p className="text-gray-600 leading-relaxed">Secure your digital legacy with trusted nominees who can preserve and share your memories for future generations.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Stories, Groups, AI Features, Let's Have Fun Section */}
          <section className="py-20 bg-gray-50 rounded-xl shadow-lg mx-4 my-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">Discover More Ways to Connect</h2>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">Explore our unique features that make memory keeping social, smart, and fun!</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Stories */}
                <div className="memory-card p-8 text-center group bg-white rounded-xl shadow-md">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-3c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-playfair font-semibold text-primary mb-4">Stories</h3>
                  <p className="text-gray-600 leading-relaxed">Share and relive your most cherished moments. Read heartwarming stories from our community and contribute your own chapters to the MemoirBox legacy.</p>
                </div>
                {/* Groups */}
                <div className="memory-card p-8 text-center group bg-white rounded-xl shadow-md">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
                    <svg className="w-8 h-8 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C15.64 13.36 17 14.28 17 15.5V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-playfair font-semibold text-secondary mb-4">Groups</h3>
                  <p className="text-gray-600 leading-relaxed">Create or join groups to connect with friends, family, or like-minded memory keepers. Collaborate, celebrate, and preserve memories together.</p>
                </div>
                {/* AI Features */}
                <div className="memory-card p-8 text-center group bg-white rounded-xl shadow-md">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                    <svg className="w-8 h-8 text-accent-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-playfair font-semibold text-accent-600 mb-4">AI Features</h3>
                  <p className="text-gray-600 leading-relaxed">Experience the magic of AI—automatic tagging, smart search, and memory enhancement tools that make organizing and discovering your memories effortless.</p>
                </div>
                {/* Let's Have Fun */}
                <div className="memory-card p-8 text-center group bg-white rounded-xl shadow-md">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-playfair font-semibold text-primary mb-4">Let's Have Fun</h3>
                  <p className="text-gray-600 leading-relaxed">Enjoy interactive games, quizzes, and creative challenges designed to make memory keeping playful and engaging for everyone.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Memory Capsule Gallery */}
          <section className="py-20 bg-gray-50 rounded-xl shadow-lg mx-4 my-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">Memory Capsules</h2>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">Explore beautiful memories shared by our community members</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {/* Memory Capsules */}
                {[
                  { image: "https://images.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg", title: "Summer 1995" },
                  { image: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg", title: "Family Reunion" },
                  { image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e", title: "Mountain Adventure" },
                  { image: "https://images.pixabay.com/photo/2017/07/21/23/57/concert-2527495_1280.jpg", title: "First Concert" },
                  { image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg", title: "Wedding Day" },
                  { image: "https://images.unsplash.com/photo-1511895426328-dc8714191300", title: "Graduation" },
                  { image: "https://images.pixabay.com/photo/2016/11/19/15/32/laptop-1839876_1280.jpg", title: "First Job" },
                  { image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg", title: "Best Friend" }
                ].map((capsule, index) => (
                  <div key={index} className="memory-card overflow-hidden group cursor-pointer">
                    <div className="aspect-square relative">
                      <img 
                        src={capsule.image} 
                        alt={capsule.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm font-medium">{capsule.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Main Navigation Sections */}
          <MainNavigation />

          {/* Testimonials Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">What Our Users Say</h2>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto">Real stories from people who've rediscovered their precious memories</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Testimonials */}
                {[
                  {
                    name: "Sarah Johnson",
                    role: "Memory Keeper",
                    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
                    quote: "Memoirbox helped me rediscover photos from my childhood that I thought were lost forever. The AI captions brought back so many forgotten details!"
                  },
                  {
                    name: "Michael Chen",
                    role: "Family Historian",
                    image: "https://images.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg",
                    quote: "The legacy feature gives me peace of mind knowing my family's stories will be preserved for future generations. It's like creating a digital time capsule."
                  },
                  {
                    name: "Emma Rodriguez",
                    role: "Travel Enthusiast",
                    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
                    quote: "I love how the location-based features help me relive my travels. Every photo tells a story, and Memoirbox helps me remember exactly where and when each moment happened."
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="memory-card p-8">
                    <div className="flex items-center mb-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full object-cover mr-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                        }}
                      />
                      <div>
                        <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                        <p className="text-sm text-text-secondary">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-text-secondary leading-relaxed caption-text italic">{testimonial.quote}</p>
                    <div className="flex text-accent-500 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Community Section */}
          <CommunitySection />

          {/* Footer */}
          <footer className="bg-white text-gray-800 py-16 border-t border-gray-200">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span className="text-2xl font-playfair font-bold text-accent">Memoirbox</span>
                  </div>
                  <p className="text-gray-600 mb-6 max-w-md">Preserving memories and connecting generations through the power of storytelling and AI-enhanced experiences.</p>
                  <div className="flex space-x-4">
                    {['twitter', 'facebook', 'pinterest', 'instagram'].map((social) => (
                      <a key={social} href="#" className="text-gray-400 hover:text-accent transition-colors duration-300">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          {/* Add social media icons here */}
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
                {/* Quick Links */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-accent">Quick Links</h4>
                  <ul className="space-y-2">
                    <li><button onClick={() => handleNavigation('/', 'hero')} className="text-gray-600 hover:text-accent transition-colors duration-300">Home</button></li>
                    <li><button onClick={() => handleNavigation('/', 'stories')} className="text-gray-600 hover:text-accent transition-colors duration-300">Stories</button></li>
                    <li><button onClick={() => handleNavigation('/', 'groups')} className="text-gray-600 hover:text-accent transition-colors duration-300">Groups</button></li>
                    <li><button onClick={() => handleNavigation('/', 'ai-features')} className="text-gray-600 hover:text-accent transition-colors duration-300">AI Features</button></li>
                    <li><button onClick={() => handleNavigation('/', 'fun')} className="text-gray-600 hover:text-accent transition-colors duration-300">Let's Have Fun</button></li>
                  </ul>
                </div>
                {/* Support */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-accent">Support</h4>
                  <ul className="space-y-2">
                    <li><button onClick={() => handleNavigation('/help')} className="text-gray-600 hover:text-accent transition-colors duration-300">Help Center</button></li>
                    <li><button onClick={() => handleNavigation('/privacy')} className="text-gray-600 hover:text-accent transition-colors duration-300">Privacy Policy</button></li>
                    <li><button onClick={() => handleNavigation('/terms')} className="text-gray-600 hover:text-accent transition-colors duration-300">Terms of Service</button></li>
                    <li><button onClick={() => handleNavigation('/contact')} className="text-gray-600 hover:text-accent transition-colors duration-300">Contact Us</button></li>
                    <li><button onClick={() => handleNavigation('/login')} className="text-gray-600 hover:text-accent transition-colors duration-300">Login</button></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-12 pt-8 text-center">
                <p className="text-gray-500">© 2025 Memoirbox. All Rights Reserved. Made with <span className='text-accent'>❤️</span> for memory keepers everywhere.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 