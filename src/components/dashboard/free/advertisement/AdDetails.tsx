import { motion } from "framer-motion";
import { Edit, Palette, User, Calendar, Mail, Phone, Home, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useGetAdvertisementQuery } from "../../../../store/api/advertisementApi";
import RichTextRenderer from "../../../shared/RichTextRenderer";
import AdvertisementTypeBadge from "./AdvertisementTypeBadge";
import AdvertisementStatusBadge from "./AdvertisementStatusBadge";
import { usePermission } from "../../../../hooks/usePermission";

const AdDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { data: ad, isLoading, error } = useGetAdvertisementQuery(id!);
    const { hasPermission: canEditAD } = usePermission('AD_EDIT');

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorState />;
    if (!ad) return <NotFoundState />;

    const formattedDate = new Date(ad.data?.createdAt || Date.now()).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 mb-10"
        >
            <div className="flex flex-col lg:flex-row lg:justify-between gap-6 md:gap-10">
                {/* Image Section */}
                <ImageSection image={ad.data.image} title={ad.data.title} />

                {/* Content Section */}
                <div className="w-full lg:w-1/2">
                    <div className="space-y-4 md:space-y-6">
                        {/* Title and Type */}
                        <TitleSection
                            title={ad.data?.title || "لا يوجد عنوان"}
                            type={ad.data?.type || "غير متوفر"}
                        />

                        {/* Date */}
                        <DateSection date={formattedDate} />

                        {/* Content */}
                        <ContentSection content={ad.data?.content || "لا يوجد محتوي"} />

                        {/* Publisher Info */}
                        <PublisherInfoSection
                            createdAt={ad.data?.createdAt || new Date().toISOString()}
                            address={ad.data?.userId?.address || "لا يوجد عنوان"}
                        />

                        {/* Contact Info */}
                        <ContactInfoSection user={ad.data?.userId || {}} />

                        {/* Action Buttons */}
                        <ActionButtons
                            id={id!}
                            status={ad.data?.status || "مقبول"}
                            canEditAD={
                                canEditAD
                            }
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Sub-components
const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
);

const ErrorState = () => (
    <div className="text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
        <p className="text-gray-600 mb-6">تعذر تحميل بيانات الإعلان</p>
        <Link
            to="/"
            className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors"
        >
            العودة للصفحة الرئيسية
        </Link>
    </div>
);

const NotFoundState = () => (
    <div className="text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">الإعلان غير موجود</h2>
        <p className="text-gray-600 mb-6">لا يوجد إعلان بهذا المعرف</p>
        <Link
            to="/"
            className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors"
        >
            العودة للصفحة الرئيسية
        </Link>
    </div>
);

const ImageSection = ({ image, title }: { image: string; title: string }) => (
    <div className="w-full lg:w-1/2 md:pl-20">
        <div className="rounded-xl w-full h-auto aspect-square md:aspect-video lg:aspect-auto lg:h-full overflow-hidden shadow-lg">
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            )}
        </div>
    </div>
);

const TitleSection = ({ title, type }: { title: string; type: any }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
            <h6 className="text-xs sm:text-sm font-semibold text-primary mb-1">إعلان جديد</h6>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                {title}
            </h1>
        </div>
        <AdvertisementTypeBadge type={type} />
    </div>
);

const DateSection = ({ date }: { date: string }) => (
    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
        <Calendar className="w-5 h-5" />
        <span>نشر في: {date}</span>
    </div>
);

const ContentSection = ({ content }: { content: string }) => {
    return (
        <>
            <RichTextRenderer content={content} />
        </>
    );
};

const PublisherInfoSection = ({ createdAt, address }: { createdAt: string; address: string }) => (
    <div className="border-t border-b border-gray-200 py-4 sm:py-6 my-3 sm:my-4">
        <div className="flex flex-row justify-center gap-4 sm:gap-8 w-full">
            <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">{new Date(createdAt).getDate()}</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                    {new Date(createdAt).toLocaleDateString('ar-SA', { month: 'long' })}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                    {new Date(createdAt).getFullYear()}
                </p>
            </div>

            <div className="flex items-center gap-3 border-r border-gray-300 pr-10">
                <MapPin className="w-5 h-5 text-primary" />
                <div className="flex gap-2">
                    <h4 className="text-sm font-semibold text-gray-500">الموقع</h4>
                    <span className="text-sm text-gray-800">
                        {address || 'غير محدد'}
                    </span>
                </div>
            </div>
        </div>
    </div>
);

const ContactInfoSection = ({ user }: { user: any }) => (
    <div className="space-y-3 sm:space-y-4">
        <h3 className="flex items-center gap-2 text-base sm:text-lg font-medium text-gray-900">
            <User className="w-5 h-5 text-primary" />
            معلومات الناشر
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-sm sm:text-base">{user.email || 'مستخدم غير معروف'}</span>
            </div>
            <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-sm sm:text-base">{user.phone || 'مستخدم غير معروف'}</span>
            </div>
            <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-gray-500" />
                <span className="text-sm sm:text-base">{user.address || 'مستخدم غير معروف'}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                    {user.familyRelationship || 'غير محدد'}
                </span>
            </div>
        </div>
    </div>
);

const ActionButtons = ({ id, status, canEditAD }: { id: string; status: any; canEditAD:any }) => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
        {(canEditAD) && (
                <Link
                    to={`/advertisement-edit/${id}`}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-8 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary transition-colors shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                    <Edit className="w-5 h-5" />
                    <span>تعديل الإعلان</span>
                </Link>

            )
        }

        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
            <Palette className="w-5 h-5 text-primary" />
            <span>حالة الإعلان: <AdvertisementStatusBadge status={status} /></span>
        </div>
    </div>
);

export default AdDetails;