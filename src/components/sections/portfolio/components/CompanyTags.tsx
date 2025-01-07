import React from 'react';

interface CompanyTagsProps {
  tags: string[];
}

export default function CompanyTags({ tags }: CompanyTagsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-slate-100 text-slate-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}