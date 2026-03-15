export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  shortBio?: string;
  social: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    email?: string;
  };
}