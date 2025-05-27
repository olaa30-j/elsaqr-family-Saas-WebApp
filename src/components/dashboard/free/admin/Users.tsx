import MembersTable from "../MembersTable"

const Users = () => {
    return (
        <div>
            <MembersTable currentPage={1} itemsPerPage={10} />
        </div>
    )
}

export default Users