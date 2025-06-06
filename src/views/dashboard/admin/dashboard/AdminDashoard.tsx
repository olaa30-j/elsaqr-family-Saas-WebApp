import { Bell } from "lucide-react";
import SimpleStatsCards from "../../../../components/dashboard/free/financail/SimpleStatsCards"
import { useGetTransactionsQuery } from "../../../../store/api/financialApi";
import { Link } from "react-router-dom";

const AdminDashoard = () => {
  const { data: allTransactionsData } = useGetTransactionsQuery({
    page: 1,
    limit: 1000,
  }, {
    refetchOnMountOrArgChange: true,
  });


  return (
    <div>
      <SimpleStatsCards transactions={allTransactionsData?.transactions || []} />
      {/* أحدث الإعلانات */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">أحدث الإعلانات</h2>
            <Bell className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {['ورشة عمل', 'مسابقة شعر', 'دورة تدريبية'].map((announcement, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                <h3 className="text-md font-medium">{announcement}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  هذا نص وهمي للإعلان يمكن استبداله بالنص الفعلي للإعلان...
                </p>
              </div>
            ))}
          </div>
          <Link to={`/advertisement`} className="w-[50vw] mx-auto text-center px-4 mt-4 py-2 text-md text-primary hover:bg-primary/5 rounded-lg">
            عرض الكل
          </Link>
        </div>
    </div>
  )
}

export default AdminDashoard