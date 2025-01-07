import React from 'react';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&h=528&q=80',
    alt: 'Modern office building'
  },
  {
    src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&h=528&q=80',
    alt: 'Business meeting'
  },
  {
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&h=528&q=80',
    alt: 'Innovation workspace'
  }
];

export default function HeroImageGrid() {
  return (
    <div className="mt-14 flex justify-end gap-8 sm:-mt-24 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
      <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
        <div className="relative">
          <img
            src={images[0].src}
            alt={images[0].alt}
            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
        </div>
      </div>
      <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
        <div className="relative">
          <img
            src={images[1].src}
            alt={images[1].alt}
            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
        </div>
        <div className="relative">
          <img
            src={images[2].src}
            alt={images[2].alt}
            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
        </div>
      </div>
    </div>
  );
}