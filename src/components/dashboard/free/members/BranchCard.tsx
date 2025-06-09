import { Calendar1Icon, Skull } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEFAULT_IMAGE } from '../../../auth/RegisterationForm';

interface BranchCardProps {
    familyBranch: string;
    husbands: any[];
    mainHusband?: any;
}

const BranchCard = ({ familyBranch, mainHusband }: BranchCardProps) => {
    return (
        <Link to={`/family-tree/${encodeURIComponent(familyBranch)}`}>
            <div className="w-72 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="h-54 w-full bg-gray-200 relative overflow-hidden">
                    {mainHusband?.image ? (
                        <img
                            src={mainHusband.image}
                            alt={`صورة ${mainHusband.fname}`}
                            className="h-[45vh] w-full object-cover"
                        />
                    ) : (
                        <div className="text-center">
                            <img
                                src={DEFAULT_IMAGE}
                                alt={`صورة مستخدم`}
                                className="h-[45vh] w-full object-cover"
                            />
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="text-xl font-bold text-primary mb-3 text-center">
                        {mainHusband ? `${mainHusband.fname} ${mainHusband.lname}` : 'اسم مستخدم'}
                    </h3>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="font-medium">الفرع:</span>
                            <span>{familyBranch}</span>
                        </div>

                        {mainHusband ? (
                            <>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="flex items-center gap-1">
                                        <Calendar1Icon className="w-4 h-4" />
                                        <span>الميلاد:</span>
                                    </span>
                                    <span>{new Date(mainHusband.birthday).toLocaleDateString('ar-EG')}</span>
                                </div>

                                {mainHusband.deathDate && (
                                    <div className="flex justify-between items-center text-red-600">
                                        <span className="flex items-center gap-1">
                                            <Skull className="w-4 h-4" />
                                            <span>الوفاة:</span>
                                        </span>
                                        <span>{new Date(mainHusband.deathDate).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="flex items-center gap-1">
                                    <Calendar1Icon className="w-4 h-4" />
                                    <span>الميلاد:</span>
                                </span>
                                <span> لايوجد</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>

    );
};

export default BranchCard;