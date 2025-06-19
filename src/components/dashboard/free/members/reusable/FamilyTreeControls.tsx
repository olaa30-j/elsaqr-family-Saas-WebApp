import { ZoomIn, ZoomOut } from 'lucide-react';
import { Link } from 'react-router-dom'; 

interface FamilyTreeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  stats?: {
    wives?: number;
    sons?: number;
    daughters?: number;
    grandChildren?: number;
  } | null;
  backLink?: string;
  title?: string;
  subtitle?: string;
}

export const FamilyTreeControls = ({
  onZoomIn,
  onZoomOut,
  onReset,
  stats,
  backLink,
  title,
  subtitle
}: FamilyTreeControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-4 mb-4 bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
      <div className='flex flex-col md:flex-row justify-between w-full gap-3'>
        <div className="text-right">
          {backLink && (
            <Link to={backLink} className="text-sm text-primary hover:underline mb-2">
              ← العودة إلى الشجرة الرئيسية
            </Link>
          )}
          {title && (
            <h2 className="text-lg sm:text-xl font-bold text-primary">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm sm:text-base text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {stats && (
          <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
            {[
              { label: 'زوجات', value: stats.wives, show: stats.wives !== undefined },
              { label: 'أبناء', value: stats.sons, show: stats.sons !== undefined },
              { label: 'بنات', value: stats.daughters, show: stats.daughters !== undefined },
              { label: 'أحفاد', value: stats.grandChildren, show: stats.grandChildren !== undefined }
            ].filter(stat => stat.show).map((stat, index) => (
              <div key={index} className="text-center min-w-[60px]">
                <p className="text-base sm:text-lg font-semibold text-primary">{stat.value || 0}</p>
                <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-center w-full mt-3">
        <button
          onClick={onZoomIn}
          className="px-2 py-1 sm:px-3 sm:py-1 bg-primary text-white rounded flex items-center gap-1 text-sm"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
          تكبير
        </button>
        <button
          onClick={onZoomOut}
          className="px-2 py-1 sm:px-3 sm:py-1 bg-primary text-white rounded flex items-center gap-1 text-sm"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
          تصغير
        </button>
        <button
          onClick={onReset}
          className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-500 text-white rounded text-sm"
          aria-label="Reset zoom"
        >
          إعادة تعيين
        </button>
      </div>
    </div>
  );
};