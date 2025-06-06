import { Calendar1Icon, Skull, User } from 'lucide-react';
import { useGetMembersQuery } from '../../../../store/api/memberApi';
import { Link } from 'react-router-dom';

interface BranchCardProps {
    familyBranch: string;
}

const BranchCard = ({ familyBranch }: BranchCardProps) => {
    const { data: membersData, isLoading, error } = useGetMembersQuery({
        page: 1,
        limit: 10,
        familyBranch: familyBranch
    });
    
    const members = membersData?.data || [];
    console.log(members);
    
    const hasHusband = members.some((member: any) => member.familyRelationship === 'زوج');
    const member = members.find((member: any) => member.familyRelationship === 'زوج');

    if (isLoading) return (
        <div className="w-72 h-96 bg-gray-100 rounded-lg p-4 animate-pulse flex flex-col gap-4">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    );

    if (error) return (
        <div className="w-72 p-6 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center justify-center">
            <span>⚠️ حدث خطأ أثناء جلب البيانات</span>
        </div>
    );

    return (
        <Link to={`/family-tree/${encodeURIComponent(familyBranch)}`}>
            <div className="w-72 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="h-54 bg-gray-200 relative overflow-hidden">
                    {hasHusband && member?.image ? (
                        <img
                            src={member.image}
                            alt={`صورة ${member.fname}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center gap-3">
                            <User className="w-16 h-16 text-gray-400" />
                            <span className="text-gray-500">لا يوجد زوج مسجل</span>
                        </div>
                    )}
                </div>

                <div className="p-4 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {hasHusband ? `${member?.fname} ${member?.lname}` : 'لا يوجد زوج'}
                    </h3>

                    <div className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2 justify-center">
                            <span className="font-medium">الفرع:</span>
                            <span>{familyBranch}</span>
                        </div>

                        {hasHusband && member && (
                            <>
                                <div className="flex items-center gap-2 justify-center">
                                    <Calendar1Icon className="w-4 h-4 text-primary" />
                                    <span>تاريخ الميلاد: {new Date(member.birthday).toLocaleDateString('ar-EG')}</span>
                                </div>

                                {member.deathDate && (
                                    <div className="flex items-center gap-2 text-red-600 justify-center">
                                        <Skull className="w-4 h-4" />
                                        <span>تاريخ الوفاة: {new Date(member.deathDate).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BranchCard;