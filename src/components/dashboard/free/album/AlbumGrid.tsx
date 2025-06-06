import { AlbumCard } from './AlbumCard';
import type { Album } from '../../../../types/album';

interface AlbumGridProps {
  albums: Album[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Pick<Album, 'name' | 'description'>) => void;
  onCreate: () => void;
}

export const AlbumGrid = ({ albums, onCreate, onSelect, onDelete, onEdit }: AlbumGridProps) => {
  if (albums.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="mb-6 p-4 bg-blue-50 rounded-full">
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        <p className="text-lg">لا يوجد البومات متاحة</p>
        <p className="mt-2">قم بأنشاء اول البوم للعائلة</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album) => (
        <AlbumCard
          key={album._id}
          album={album}
          onSelect={onSelect}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}

      <div 
        onClick={onCreate} 
        className="rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/30 h-full flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors" 
        style={{ minHeight: 250 }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="lucide lucide-plus h-12 w-12 text-muted-foreground mb-2"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        <p className="text-muted-foreground font-medium">إنشاء ألبوم جديد</p>
      </div>
    </div>
  );
};