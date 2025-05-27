import * as LucideIcons from 'lucide-react';
import React from 'react';
import type { FeatureCardProps } from '../../../types/home';

const DetailsFeaturesCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  features,
  image
}) => {
  const IconComponent = LucideIcons[icon] as React.ComponentType<{
    className?: string;
    size?: number;
    strokeWidth?: number;
  }>;

  if (!IconComponent) {
    console.warn(`Icon ${icon} not found in lucide-react`);
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-center pt-6 justify-center px-10">
      <div>
        <div className="flex items-center mb-4">
          <IconComponent
            className="w-12 h-12 text-primary"
            strokeWidth={1.5}
          />
          <h3 className="text-2xl font-bold mr-3 font-heading">{title}</h3>
        </div>
        <p className="text-color-2 mb-8 px-2">{description}</p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex">
              <div className="mx-3 mt-1 bg-primary/10 rounded-full p-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6.66674 10.1147L4.47207 7.92004L3.52808 8.8627L6.66674 12.0014L13.1374 5.5307L12.1947 4.58671L6.66674 10.1147Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative w-[95%]">
        <div className="overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-auto object-cover shadow-lg rounded-xl"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default DetailsFeaturesCard;