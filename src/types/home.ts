import * as LucideIcons from 'lucide-react';

export interface FamilyFeature {
  id: number;
  title: string;
  description: string;
  icon: string;
  href?: string;
}

export type LucideIconName = keyof typeof LucideIcons;

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIconName;
  features: string[];
  image: string;
}

export interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

export interface FamilyPhotoCardProps {
  src: string;
  alt: string;
  caption: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface TabBarProps {
  setShowMoreOptions: () => void
}

export interface OptionLinkProps{
    href: string;
    title: string;
    icon: React.ReactNode;
    bgColor?: string;
    borderColor?: string;
    hoverColor?: string;
}