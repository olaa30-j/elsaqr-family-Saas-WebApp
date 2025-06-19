import { useGetAllBranchesQuery } from "../../../../store/api/branchApi";
import { useGetMembersQuery } from "../../../../store/api/memberApi";
import BranchCard from "./BranchCard";

const BranchesList = () => {
    const { data: getAllBranches } = useGetAllBranchesQuery({ page: 1, limit: 30 });

    const visibleBranches = getAllBranches?.data.filter((branch: any) => branch.show === true);
    const branches = visibleBranches?.map((branch: any) => branch.name);

    const { data: allMembers, isLoading, error } = useGetMembersQuery({
        page: 1,
        limit: 500
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">الفروع العائلية</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches?.map((_, index) => (
                        <div key={index} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-500">
                <h1 className="text-3xl font-bold mb-8">حدث خطأ في جلب البيانات</h1>
                <p>⚠️ تعذر تحميل بيانات العائلة. يرجى المحاولة لاحقًا</p>
            </div>
        );
    }

    const branchMembers = branches?.map(branch => {
        const members = allMembers?.data?.filter((member: any) =>
            member.familyBranch.name === branch
        ) || [];

        const husbands = members.filter((member: any) =>
            member.familyRelationship === 'ابن' || 'الجد الأعلى'
        );

        return {
            branchName: branch,
            members,
            husbands,
            mainHusband: husbands[0]
        };
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-14 underline text-cairo text-primary">الفروع العائلية</h1>

            <div className="overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex gap-6 w-max mx-auto px-4">
                    {branchMembers?.map(({ branchName, husbands, mainHusband }, index) => (
                        <BranchCard
                            key={index}
                            familyBranch={branchName}
                            husbands={husbands}
                            mainHusband={mainHusband}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BranchesList;