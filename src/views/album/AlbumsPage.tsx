import { useState } from 'react';
import { useAlbums } from '../../hooks/useAlbums';
import { AlbumGrid } from '../../components/dashboard/free/album/AlbumGrid';
import { PaginationControls } from '../../components/dashboard/free/album/PaginationControls';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { AlbumFormModal } from '../../components/dashboard/free/album/AlbumFormModal';

const AlbumsPage = () => {
    const {
        albums,
        isLoading,
        pagination,
        createAlbum,
        deleteAlbum,
        updateAlbum,
        setPage
    } = useAlbums();

    const [isCreating, setIsCreating] = useState(false);

    if (isLoading) return <LoadingSpinner />;

    return (
        <section className="container mx-auto px-4 -mt-10">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera ml-2 h-6 w-6 text-primary">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                        <circle cx="12" cy="13" r="3" />
                    </svg>
                    <h2 className="text-xl font-heading font-bold">معرض الصور</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:text-white bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-4 w-4">
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                        </svg>
                        <span>إنشاء ألبوم</span>
                    </button>
                </div>
            </div>

            <AlbumGrid
                albums={albums}
                onDelete={deleteAlbum}
                onEdit={updateAlbum}
                onCreate={() => setIsCreating(true)}
                onSelect={function (id: string): void {
                    console.log(id);
                    throw new Error('Function not implemented.');
                }} />

            <PaginationControls
                pagination={pagination}
                onPageChange={setPage}
            />

            {isCreating && (
                <AlbumFormModal
                    onSubmit={createAlbum}
                    onClose={() => setIsCreating(false)}
                />
            )}

            <footer className="py-4 border-t border-muted mt-8">
                <div className="text-center text-xs text-muted-foreground">
                    <p>© 2025 عائلة الصقر الدهمش - جميع الحقوق محفوظة</p>
                    <div className="flex justify-center gap-4 mt-1">
                        <a href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
                        <a href="/terms" className="hover:text-primary transition-colors">شروط الاستخدام</a>
                        <a href="/contact" className="hover:text-primary transition-colors">اتصل بالإدارة</a>
                    </div>
                    <p className="mt-1">الإصدار 1.0.0</p>
                </div>
            </footer>

        </section>
    );
};

export default AlbumsPage