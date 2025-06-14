import { useState } from "react";
import { useGetUsersQuery } from "../../../../store/api/usersApi";
import UsersTable from "../users/UsersTable";

const Users = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { 
        data: usersData, 
        error, 
        isLoading,
        refetch 
    } = useGetUsersQuery({ 
        page, 
        limit 
    });

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    if (error) {
        return <div>خطأ فى استدعاء المستخدمين</div>;
    }

    return (
        <div>
            <UsersTable 
                currentPage={page}
                itemsPerPage={limit}
                usersData={usersData?.data || []}
                pagination={usersData?.pagination}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                isLoading={isLoading}
                refetchUsers={refetch}
            />
        </div>
    )
}

export default Users;