import { useGetUsersQuery } from "../../../../store/api/usersApi";
import UsersTable from "../users/UsersTable";

const Users = () => {
    const { data: usersData, error } = useGetUsersQuery({
        page: 1,
        limit: 10
    });

    const users = usersData?.data    

    if (error) {
        return <div>خطأ فى استدعاء المستخدمين</div>;
    }

    return (
        <div>
            <UsersTable currentPage={1} itemsPerPage={10} usersData={users}/>
        </div>
    )
}

export default Users