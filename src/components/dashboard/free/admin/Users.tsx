import { useGetMembersQuery } from "../../../../store/api/memberApi";
import MembersTable from "../MembersTable"

const Users = () => {
    const { data: membersData, error } = useGetMembersQuery({
        page: 1,
        limit: 10
    });

    const members = membersData?.data

    if (error) {
        return <div>Error loading members</div>;
    }

    return (
        <div>
            <MembersTable currentPage={1} itemsPerPage={10} usersData={members}/>
        </div>
    )
}

export default Users