import { useGetMemberQuery } from "../../../store/api/memberApi";

const BranchOwnerName = ({ ownerId }: { ownerId: string }) => {
    const { data: memberData, isLoading, isError } = useGetMemberQuery(ownerId, {
        skip: !ownerId
    });
    
    if (!ownerId) return <span>غير محدد</span>;
    if (isLoading) return <span>جاري التحميل...</span>;
    if (isError) return <span>خطأ في التحميل</span>;

    const owner = memberData?.data?._id === ownerId;
    return <span>{owner ? (memberData?.data?.fname && memberData?.data?.lname) : 'غير محدد'}</span>;
};


export default BranchOwnerName 