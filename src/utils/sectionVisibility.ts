import { PortfolioSectionId, ProfileData } from '../types';

export const portfolioSections: { id: PortfolioSectionId; label: string }[] = [
  { id: 'hero', label: 'Home / Hero' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];

export function isSectionVisible(profile: ProfileData, id: PortfolioSectionId): boolean {
  return profile.sectionVisibility?.[id] ?? id !== 'blog';
}
