import { useGetMembersQuery } from "../../store/api/memberApi";

const Dashboard = () => {
  const { data: membersData, error } = useGetMembersQuery({
    page: 1,
    limit: 10
  });


  if (error) {
    return <div>Error loading members</div>;
  }

  console.log(membersData);

  return (
    <section className="w-full overflox-x-hidden">
      hello ola
    </section>
  )
}

export default Dashboard