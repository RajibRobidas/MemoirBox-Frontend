import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Text to Image',
    description: 'Generate images from text prompts using AI.',
    icon: '📝',
    color: 'from-accent to-accent-600',
    link: '/ai/text-to-image',
    comingSoon: false,
  },
  {
    title: 'Image to Image',
    description: 'Transform one image into another with AI magic.',
    icon: '🔄',
    color: 'from-pink-400 to-pink-600',
    link: '/ai/image-to-image',
    comingSoon: false,
  },
  {
    title: 'Remove Object',
    description: 'Erase unwanted objects from your photos.',
    icon: '❌',
    color: 'from-red-400 to-red-600',
    link: '/ai/object-removal',
    comingSoon: false,
  },
  {
    title: 'Ghibli-Art Style',
    description: 'Turn your photos into Ghibli-style artwork.',
    icon: '🌸',
    color: 'from-yellow-400 to-pink-400',
    link: '/ai/ghibli-art',
    comingSoon: false,
  },
  {
    title: 'Remove Background',
    description: 'Remove the background from your images instantly.',
    icon: '🧹',
    color: 'from-blue-400 to-accent',
    link: '/ai/remove-background',
    comingSoon: false,
  },
  {
    title: 'Architecture & Interior',
    description: 'AI tools for architecture and interior design images.',
    icon: '🏛️',
    color: 'from-cyan-400 to-cyan-600',
    link: '/ai/interior-design',
    comingSoon: false,
  },
  {
    title: 'Image Editing',
    description: 'Edit images with advanced AI-powered tools.',
    icon: '🖌️',
    color: 'from-green-400 to-green-600',
    link: '#',
    comingSoon: true,
  },
  {
    title: 'Extend Image / Outpainting',
    description: 'Expand your images beyond their original borders.',
    icon: '🖼️',
    color: 'from-purple-400 to-purple-600',
    link: '#',
    comingSoon: true,
  },
  {
    title: 'Replace Background',
    description: 'Swap out image backgrounds with ease.',
    icon: '🌄',
    color: 'from-indigo-400 to-indigo-600',
    link: '#',
    comingSoon: true,
  },
  
  {
    title: 'Replace Object (Inpainting)',
    description: 'Replace objects in your images using AI inpainting.',
    icon: '🎨',
    color: 'from-teal-400 to-teal-600',
    link: '#',
    comingSoon: true,
  },
  {
    title: 'Avatar / Headshot / FaceGen / Character Generator',
    description: 'Create avatars, headshots, and characters from photos.',
    icon: '👤',
    color: 'from-orange-400 to-orange-600',
    link: '#',
    comingSoon: true,
  },
  {
    title: 'Image Upscaler / Enhancer',
    description: 'Enhance and upscale your images for better quality.',
    icon: '🔍',
    color: 'from-emerald-400 to-emerald-600',
    link: '#',
    comingSoon: true,
  },
  {
    title: 'Sketch to Realistic / Image',
    description: 'Turn sketches into realistic images with AI.',
    icon: '✏️',
    color: 'from-fuchsia-400 to-fuchsia-600',
    link: '#',
    comingSoon: true,
  },
];

const AI: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-surface to-light py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-accent drop-shadow-lg">AI Features</h1>
        <p className="text-lg text-text-secondary mb-10 text-center">
          Explore the power of AI to enhance your memories. Try our background removal tool and discover more features below!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            feature.link && !feature.comingSoon ? (
              <Link
                to={feature.link}
                key={feature.title}
                className={`block bg-gradient-to-br ${feature.color} flex flex-col p-6 text-white rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-200 border-2 border-white/30 relative overflow-hidden group`}
                style={{ minHeight: 210 }}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform duration-200">{feature.icon}</span>
                  <h2 className="text-2xl font-semibold mb-0 drop-shadow-lg">{feature.title}</h2>
                </div>
                <p className="text-white/90 mb-2 text-base">{feature.description}</p>
                <span><p className="inline-block mt-2 text-white font-medium bg-accent/80 px-4 py-1 rounded-lg shadow-md group-hover:bg-accent-600/90 transition-colors">Try Now →</p></span>
                <div className="absolute right-0 bottom-0 opacity-10 text-8xl pointer-events-none select-none">{feature.icon}</div>
              </Link>
            ) : (
              <div
                key={feature.title}
                className={`bg-gradient-to-br ${feature.color} rounded-2xl shadow-md opacity-60 border-2 border-dashed border-white/30 flex flex-col justify-between p-6 relative overflow-hidden group hover:scale-105 hover:shadow-xl transition-transform duration-200`}
                style={{ minHeight: 210 }}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform duration-200">{feature.icon}</span>
                  <h2 className="text-2xl font-semibold mb-0 text-white/80 drop-shadow-lg">{feature.title}</h2>
                </div>
                <p className="text-white/80 mb-2 text-base">{feature.description}</p>
                <span className="inline-block mt-2 text-white/70 font-medium bg-white/20 px-4 py-1 rounded-lg shadow-md">Coming Soon</span>
                <div className="absolute right-0 bottom-0 opacity-10 text-8xl pointer-events-none select-none">{feature.icon}</div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default AI; 