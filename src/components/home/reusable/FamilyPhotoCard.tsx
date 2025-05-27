import type { FamilyPhotoCardProps } from "../../../types/home";

const FamilyPhotoCard: React.FC<FamilyPhotoCardProps> = ({ 
  src, 
  alt, 
  caption, 
  className = '', 
  style 
}) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-2xl shadow-lg w-full h-full ${className}`}
      style={style}
    >
      <div className="absolute inset-0 border-4 border-white/20 rounded-2xl z-20 pointer-events-none"></div>
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="object-cover transition-opacity duration-500 opacity-100 h-full w-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent mix-blend-soft-light"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-primary/10 opacity-50"></div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-4 px-4">
        <span className="text-white text-sm font-medium drop-shadow-md">{caption}</span>
      </div>
    </div>
  );
};

export default FamilyPhotoCard;