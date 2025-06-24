import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, X, Save, Calendar, Mail, Phone, Home, MapPin, User } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useUpdateAdvertisementMutation, useGetAdvertisementQuery } from "../../../../store/api/advertisementApi";
import type { IAdvertisementForm } from "../../../../types/advertisement";

const EditAd = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [updateAd, { isLoading: isUpdating }] = useUpdateAdvertisementMutation();
    const { data: ad, isLoading, error } = useGetAdvertisementQuery(id!);

    const [formData, setFormData] = useState<IAdvertisementForm>({
        title: '',
        type: 'general',
        content: '',
        status: 'pending',
        image: null
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const quillRef = useRef<ReactQuill>(null);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ],
        clipboard: {
            matchVisual: false,
        }
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'ordered',
        'link',
        'color', 'background'
    ];

    useEffect(() => {
        if (ad) {
            setFormData({
                title: ad.data.title,
                type: ad.data.type,
                content: ad.data.content,
                status: ad.data.status,
                image: null
            });

            if (ad.data.image) {
                setImagePreview(ad.data.image);
            }
        }
    }, [ad]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, image: file }));

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
        try {
            await updateAd({ id: id!, updates: formData }).unwrap();
            navigate(`/advertisement-details/${id}`);
        } catch (error) {
            console.error("Failed to update ad:", error);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="text-center py-12 px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
            <p className="text-gray-600 mb-6">تعذر تحميل بيانات الإعلان</p>
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors"
            >
                العودة
            </button>
        </div>
    );

    const formattedDate = ad ? new Date(ad.data.createdAt).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 mb-10"
        >
            <div className="flex flex-col lg:flex-row lg:justify-between gap-6 md:gap-10">
                {/* الجزء الأيمن - الصورة */}
                <div className="w-full lg:w-1/2 md:pb-20 md:pl-10">
                    <div className="rounded-xl  w-full h-auto aspect-square md:aspect-video lg:aspect-auto lg:h-full overflow-hidden shadow-lg">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400">لا توجد صورة</span>
                            </div>
                        )}
                    </div>

                    {/* زر تغيير الصورة */}
                    <div className="mt-4 flex justify-center">
                        <div className="flex gap-2">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="image"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                            >
                                <Edit size={16} />
                                <span>{imagePreview ? 'تغيير الصورة' : 'إضافة صورة'}</span>
                            </label>
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                >
                                    <X size={16} />
                                    <span>إزالة</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* الجزء الأيسر - المحتوى */}
                <div className="w-full lg:w-1/2">
                    <div className="space-y-4 md:space-y-6">
                        {/* العنوان والنوع */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div>
                                <h6 className="text-xs sm:text-sm font-semibold text-primary mb-1">تعديل الإعلان</h6>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-primary focus:outline-none w-full"
                                    required
                                />
                            </div>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="px-3 py-1 sm:px-4 sm:py-2 bg-primary/5 text-primary text-xs sm:text-sm font-medium rounded-full"
                            >
                                <option value="important">مهم</option>
                                <option value="general">عام</option>
                                <option value="social">اجتماعي</option>
                            </select>
                        </div>

                        {/* التاريخ */}
                        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>نشر في: {formattedDate}</span>
                        </div>

                        {/* محرر المحتوى */}
                        <div className="border rounded-lg overflow-hidden" style={{ height: '300px' }}>
                            <ReactQuill
                                ref={quillRef}
                                theme="snow"
                                value={formData.content}
                                onChange={handleContentChange}
                                modules={modules}
                                formats={formats}
                                placeholder="اكتب محتوى الإعلان هنا..."
                            />
                        </div>

                        {/* معلومات الناشر (للعرض فقط) */}
                        <div className="border-t border-b border-gray-200 py-4 sm:py-6 my-3 sm:my-4">
                            <div className="flex flex-row justify-center gap-4 sm:gap-8 w-full">
                                <div className="text-center">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{ad ? new Date(ad.data.createdAt).getDate() : ''}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        {ad ? new Date(ad.data.createdAt).toLocaleDateString('ar-SA', { month: 'long' }) : ''}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        {ad ? new Date(ad.data.createdAt).getFullYear() : ''}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 border-r border-gray-300 pr-6 pr-10">
                                    <MapPin className="w-4 h-4 w-5 h-5 text-primary" />
                                    <div className="flex gap-2">
                                        <h4 className="text-sm font-semibold text-gray-500">الموقع</h4>
                                        <span className="text-sm text-gray-800">
                                            {ad?.data.userId.address || 'غير محدد'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* معلومات الاتصال (للعرض فقط) */}
                        <div className="space-y-3 sm:space-y-4">
                            <h3 className="flex items-center gap-2 text-base sm:text-lg font-medium text-gray-900">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                معلومات الناشر
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                    <span className="text-sm sm:text-base">{ad?.data?.userId?.email || 'غير متوفر'}</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                    <span className="text-sm sm:text-base">{ad?.data?.userId?.phone || 'غير متوفر'}</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Home className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                    <span className="text-sm sm:text-base">{ad?.data?.userId?.address || 'غير متوفر'}</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <span className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-100 text-gray-800 text-xs sm:text-sm rounded-full">
                                        {ad?.data?.userId?.familyRelationship || 'غير محدد'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* أزرار الحفظ والإلغاء */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-8 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>إلغاء</span>
                            </button>

                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isUpdating}
                                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-8 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                            >
                                {isUpdating ? (
                                    <span className="animate-spin">↻</span>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span>حفظ التغييرات</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EditAd;