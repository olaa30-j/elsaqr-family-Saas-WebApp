import { useGetMembersQuery } from "../../../../store/api/memberApi";
import MembersTable from "../members/MemberTable";

const Member = () => {
    const { data: membersData, error } = useGetMembersQuery({
        page: 1,
        limit: 10
    });    

    const users = membersData?.data    

    if (error) {
        return <div>خطأ فى استدعاء المستخدمين</div>;
    }

    return (
        <div>
            <MembersTable currentPage={1} itemsPerPage={10} membersData={users}/>
        </div>
    )
}

export default Member