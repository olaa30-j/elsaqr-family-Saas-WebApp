import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Loader2, Image as ImageIcon, X, SaveIcon } from 'lucide-react';
import type { IAdvertisement, IAdvertisementForm } from '../../../../types/advertisement';

type AdvertisementFormProps = {
    currentAd: IAdvertisement | null;
    onSubmit: (formData: IAdvertisementForm) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
    baseUrl?: string;  
};

const AdvertisementForm = ({
    currentAd,
    onSubmit,
    onCancel,
    isLoading,
    baseUrl = ''  
}: AdvertisementFormProps) => {
    const [formData, setFormData] = useState<IAdvertisementForm>({
        title: '',
        type: 'general',
        content: '',
        status: 'pending',
        image: null
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (currentAd) {
            setFormData({
                title: currentAd.title,
                type: currentAd.type,
                content: currentAd.content,
                status: currentAd.status,
                image: null
            });
            
            if (currentAd.image) {
                setImagePreview(`${baseUrl}${currentAd.image}`);
            }
        }
    }, [currentAd, baseUrl]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, image: file }));
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="important">مهم</option>
                        <option value="general">عام</option>
                        <option value="social">اجتماعي</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="pending">قيد الانتظار</option>
                        <option value="accept">مقبول</option>
                        <option value="reject">مرفوض</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المحتوى</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الصورة</label>
                
                {/* Image upload input */}
                <div className="flex items-center gap-4 mb-2">
                    <label className="flex-1">
                        <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                            <div className="text-center">
                                <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">
                                    {imagePreview ? 'تغيير الصورة' : 'اختر صورة للإعلان'}
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </label>
                    
                    {imagePreview && (
                        <div className="relative flex-shrink-0 w-24 h-24">
                            <img
                                src={imagePreview}
                                alt="معاينة الصورة"
                                className="object-cover w-full h-full rounded-md"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-0 right-0 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
                
                {currentAd?.image && !formData.image && !imagePreview && (
                    <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                        <span>الصورة الحالية:</span>
                        <a 
                            href={`${baseUrl}${currentAd.image}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {currentAd.image}
                        </a>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                    إلغاء
                </button>
                <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin mx-2" size={18} />
                            جاري الحفظ...
                        </>
                    ) : (
                        <>
                            <SaveIcon className="mx-2" size={18} />
                            حفظ
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default AdvertisementForm;