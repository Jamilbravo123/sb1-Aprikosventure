import React from 'react';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'AI-Powered Analytics',
    category: 'Artificial Intelligence',
    description: 'Enterprise-grade analytics platform leveraging machine learning for predictive insights.',
    image: 'https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'DeFi Protocol',
    category: 'Blockchain',
    description: 'Decentralized finance protocol enabling seamless cross-chain transactions.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'Nordic Construction',
    category: 'Construction Tech',
    description: 'Digital transformation platform for the construction industry.',
    image: 'https://images.unsplash.com/photo-1590986514371-d1a1429199d0?auto=format&fit=crop&q=80&w=1600',
  },
];

export default function Portfolio() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Portfolio</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Discover our diverse portfolio of innovative ventures across multiple industries.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.title} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="aspect-[16/9]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  {project.category}
                </span>
                <h3 className="mt-4 text-xl font-semibold leading-6 text-gray-900">
                  <span className="absolute inset-0" />
                  {project.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">{project.description}</p>
                <div className="mt-4 flex items-center gap-2 text-purple-600">
                  <span className="text-sm font-medium">Learn more</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}