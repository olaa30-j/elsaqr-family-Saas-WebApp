import { Album } from 'lucide-react';
import { useAppSelector } from '../../../../store/store';
import { useGetAlbumsQuery } from '../../../../store/api/albumApi';
import { Link } from 'react-router-dom';

const AlbumsList = () => {
    const user = useAppSelector((state) => state.auth.user);
    const { data: albumsData, isLoading, isError } = useGetAlbumsQuery({ page: 1, limit: 10 });
    const filteredAlbums = user?.role[0] === "مستخدم"
        ? albumsData?.data?.filter((album: any) => album.createdBy.familyBranch === user.familyBranch)
        : albumsData?.data;

    return (
        <div className="bg-white mx-4 rounded-lg border border-gray-300 shadow-sm h-full flex flex-col mb-16">
            <div className="px-4 py-3 border-b border-gray-300">
                <h2 className="font-semibold text-primary flex items-center text-xl">
                    <Album className="w-5 h-5 mx-2 text-primary" />
                    ألبومات الصور
                    {user?.role[0] === "مستخدم" && (
                        <span className="text-sm text-gray-500 mr-2">({user.familyBranch})</span>
                    )}
                </h2>
            </div>

            {isLoading ? (
                <div className="p-4 text-center">جاري التحميل...</div>
            ) : isError ? (
                <div className="p-4 text-center text-red-500">حدث خطأ أثناء جلب البيانات</div>
            ) : (
                <div className="p-4 overflow-y-auto flex-grow">
                    {filteredAlbums?.length ? (
                        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 flex overflow-x-auto gap-4">
                            {filteredAlbums.map((album, index) => (
                                <Link to={`/albums/${album._id}`}  key={index} >
                                    <div className="border rounded-lg p-3 hover:shadow-md transition-shadow flex justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-lg">{album.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                منشئ بواسطة:
                                                <span className="ml-1">
                                                    {album.createdBy.email}
                                                </span>
                                            </p>
                                            {album.createdBy.familyBranch && (
                                                <p className="text-gray-500 text-xs mt-1">
                                                    الفرع العائلي: {album.createdBy.familyBranch}
                                                </p>
                                            )}
                                            <div className="mt-2 text-sm text-primary">
                                                {album.images.length} صورة
                                            </div>
                                        </div>
                                        {album.images.length > 0 && (
                                            <div className="ml-3 w-48 h-28 flex-shrink-0">
                                                <img
                                                    src={album.images[0].image || "https://cdn.prod.website-files.com/6469e2294ac68c3d5caea372/65ca83d97a2c75ae48200fc7_65b4bf4950658bb8410bd877_images_and_gifs.webp"}
                                                    alt={`صورة ${album.name}`}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            {user?.role[0] === "مستخدم"
                                ? "لا توجد ألبومات متاحة لفرعك العائلي"
                                : "لا توجد ألبومات متاحة"}
                        </div>
                    )}
                </div>

            )}
        </div>
    );
};

export default AlbumsList;