import { Mail, MapPin } from 'lucide-react';

const contactDetails = [
  {
    title: 'Email',
    details: 'contact@aprikosventure.com',
    icon: Mail,
    link: 'mailto:contact@aprikosventure.com',
  },
  {
    title: 'Office',
    details: 'Lorenveien 73a, Oslo',
    icon: MapPin,
  },
];

export default function ContactInfo() {
  return (
    <div className="flex flex-col justify-between">
      <div className="space-y-8">
        {contactDetails.map((item) => (
          <div key={item.title} className="group flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C9935E]/10 transition-all duration-200 group-hover:bg-[#C9935E]/20">
              <item.icon className="h-6 w-6 text-[#C9935E]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              {item.link ? (
                <a
                  href={item.link}
                  className="mt-1 text-slate-400 hover:text-[#C9935E] transition-colors duration-200"
                  target={item.link.startsWith('http') ? '_blank' : undefined}
                  rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {item.details}
                </a>
              ) : (
                <p className="mt-1 text-slate-400">{item.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
