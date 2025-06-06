import { motion } from 'framer-motion';
import { type LucideIcon, Newspaper, Megaphone, Image, Mail, Clock } from 'lucide-react';
import { useGetAdvertisementsQuery } from '../../../../store/api/advertisementApi';
import { fadeIn, staggerContainer } from '../../../../utils/motion';

const AdsSection = () => {
    const { data } = useGetAdvertisementsQuery({});
    
    const getIconByType = (type: string): LucideIcon => {
        switch (type.toLowerCase()) {
            case 'news':
                return Newspaper;
            case 'promotion':
                return Megaphone;
            case 'image':
                return Image;
            case 'email':
                return Mail;
            default:
                return Newspaper;
        }
    };

    return (
        <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="container mx-auto px-4"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data && data.data.map((ad: any, index: number) => {
                    getIconByType(ad.type);
                    const date = new Date(ad.createdAt).toLocaleDateString('ar-EG');

                    return (
                        <motion.div
                            key={ad._id}
                            variants={fadeIn('up', 'spring', index * 0.1, 0.5)}
                            className="relative w-full my-6 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
                            whileHover={{ scale: 1.02 }}
                        >
                            {/* صورة الإعلان */}
                            {ad.image && (
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img
                                        src={ad.image}
                                        alt={ad.title}
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                </div>
                            )}

                            {/* محتوى الإعلان */}
                            <div className={`p-6 ${!ad.image ? 'pt-8' : ''}`}>
                                <div className="mb-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-gray-800 font-arabic">{ad.title}</h3>
                                    </div>
                                    {/* <p className="mt-3 text-gray-600 leading-relaxed font-arabic text-justify">{ad.content}</p> */}
                                </div>

                                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock size={16} className="ml-1 text-gold" />
                                        <span className="font-arabic">{date}</span>
                                    </div>
                                    
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                        {ad.type}
                                    </span>
                                </div>
                            </div>

                            {/* زاوية زخرفية */}
                            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                <div className="absolute top-0 right-0 w-full h-full bg-gold transform rotate-45 origin-bottom-left -translate-y-1/2 translate-x-1/2"></div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* زخرفة أسفل القسم */}
            <motion.div 
                variants={fadeIn('up', 'spring', 0.5, 1)}
                className="mt-16 text-center"
            >
                <p className="text-gray-500 font-arabic text-lg">
                    "أسرة واحدة.. قلب واحد"
                </p>
            </motion.div>
        </motion.div>
    );
};

export default AdsSection;