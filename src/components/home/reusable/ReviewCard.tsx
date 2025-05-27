import React from 'react';
import { Star } from 'lucide-react';
import type { TestimonialCardProps } from '../../../types/home';

const ReviewCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  role,
  avatar,
  rating
}) => {
  return (
    <div className="mb-8 sm:mb-0 w-full max-w-md mx-auto">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full overflow-hidden border-primary/10 relative">        
        {/* المحتوى */}
        <div className="p-8 relative z-10 backdrop-blur-sm">
          {/* علامة الاقتباس */}
          <div className="absolute top-6 left-6 text-5xl text-primary/20 font-serif">❝</div>
          
          {/* التقييم بالنجوم */}
          <div className="flex justify-start mb-5">
            {[...Array(rating)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 text-amber-500 fill-amber-500 mr-1 drop-shadow"
              />
            ))}
          </div>
          
          {/* نص الشهادة */}
          <div className="relative">
            <p className="text-color-2 leading-relaxed text-lg relative z-10 line-clamp-4">
              <span className="text-primary/60 font-medium">" </span>
              {quote}
              <span className="text-primary/60 font-medium">"</span>
            </p>
            <div className="absolute bottom-[-2vh] left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          </div>
          
          {/* معلومات الشخص */}
          <div className="flex items-center mt-8 gap-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary/30 to-amber-500/30 blur-sm"></div>
              <img 
                src={avatar} 
                alt={name} 
                loading="lazy"
                className="relative w-14 h-14 rounded-full object-cover border-2 border-white/70 shadow-lg"
              />
            </div>
            <div>
              <p className="font-bold text-foreground">{name}</p>
              <p className="text-sm text-primary/70">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;