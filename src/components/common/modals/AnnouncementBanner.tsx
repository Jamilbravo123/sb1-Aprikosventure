import React from 'react';
import { gradients } from '../../../constants/colors';

interface AnnouncementBannerProps {
  title: string;
  message: string;
}

export default function AnnouncementBanner({ title, message }: AnnouncementBannerProps) {
  return (
    <div className={`rounded-xl ${gradients.background.primary} p-6 text-white`}>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-slate-100">{message}</p>
    </div>
  );
}