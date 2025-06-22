import { useState } from "react";
import { useGetMembersQuery } from "../../../../store/api/memberApi";
import MembersTable from "../members/MemberTable";

const Member = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [familyBranch, setFamilyBranch] = useState("");

    const { 
        data: membersData, 
        error, 
        isLoading 
    } = useGetMembersQuery({
        page,
        limit,
        familyBranch: familyBranch || undefined
    });

    
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleBranchChange = (branch: string) => {
        setFamilyBranch(branch);
        setPage(1);  
    };

    if (error) {
        return <div>خطأ فى استدعاء المستخدمين</div>;
    }

    return (
        <div>
            <MembersTable 
                currentPage={page}
                itemsPerPage={limit}
                membersData={membersData?.data || []}
                pagination={membersData?.pagination}
                onPageChange={handlePageChange}
                onBranchChange={handleBranchChange}
                isLoading={isLoading}
                selectedBranch={familyBranch}
            />
        </div>
    )
}

export default Member;