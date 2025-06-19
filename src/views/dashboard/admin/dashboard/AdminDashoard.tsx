import { Bell } from "lucide-react";
import SimpleStatsCards from "../../../../components/dashboard/free/financail/SimpleStatsCards";
import { useGetTransactionsQuery } from "../../../../store/api/financialApi";
import { Link } from "react-router-dom";
import { DashboardCharts } from "./DashboardCharts";
import { useGetAlbumStatsQuery, useGetEventOverviewQuery, useGetUsersStatsQuery, useGetAdvertisementStatsQuery } from "../../../../store/api/chartsApi";
import RichTextRenderer from "../../../../components/shared/RichTextRenderer";

const AdminDashoard = () => {
  const { data: allTransactionsData } = useGetTransactionsQuery({
    page: 1,
    limit: 1000,
  }, {
    refetchOnMountOrArgChange: true,
  });

  const { data: albumStats } = useGetAlbumStatsQuery({ days: 7 });
  const { data: eventStats } = useGetEventOverviewQuery();
  const { data: userStats } = useGetUsersStatsQuery();
  const { data: adStats } = useGetAdvertisementStatsQuery();

  const stats = {
    gallery: {
      total: albumStats?.data.counts.totalAlbums || 0,
      recent: albumStats?.data.counts.newAlbums || 0,
    },
    events: {
      upcoming: eventStats?.data.counts.upcoming || 0,
      past: eventStats?.data.counts.ended || 0,
    },
    announcements: {
      active: adStats?.data.totalAdvertisements || 0,
      lastData: adStats?.data.newAdvertisementsLast7Days || [],
      data: adStats?.data.newAdvertisements || [],
      expired: 0,
    },
    users: {
      total: userStats?.data.totalUsers || 0,
      new: userStats?.data.newUsers || 0,
    },
  };

  const chartData = [
    { name: 'يناير', معاملات: 40, مستخدمون: 24, إعلانات: 18 },
    { name: 'فبراير', معاملات: 30, مستخدمون: 13, إعلانات: 29 },
    { name: 'مارس', معاملات: 20, مستخدمون: 8, إعلانات: 22 },
    { name: 'أبريل', معاملات: 27, مستخدمون: 19, إعلانات: 15 },
    { name: 'مايو', معاملات: 18, مستخدمون: 11, إعلانات: 31 },
    { name: 'يونيو', معاملات: 23, مستخدمون: 17, إعلانات: 25 },
  ];

  const pieData = [
    { name: 'المعاملات', value: allTransactionsData?.transactions?.length || 0 },
    { name: 'المستخدمون', value: stats.users.total },
    { name: 'الإعلانات', value: stats.announcements.active },
  ];

  return (
    <div className="space-y-6">
      {/* بطاقات الإحصائيات البسيطة */}
      <SimpleStatsCards transactions={allTransactionsData?.transactions || []} />

      {/* قسم المخططات */}
      <DashboardCharts barData={chartData} pieData={pieData} />

      {/* قسم الإعلانات والمحتوى الجانبي */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* أحدث الإعلانات */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">أحدث الإعلانات</h2>
            <Bell className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.announcements.data && Array.isArray(stats.announcements.data) &&
              stats.announcements.data.map((item, index) => (
                <div key={index} className="flex p-3 ">
                  <div className="hover:bg-gray-50 rounded-lg">
                    <h3 className="text-md font-medium">{item.title || 'لا يوجد عنوان'}</h3>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      <RichTextRenderer content={item.content} />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <Link
            to="/advertisement"
            className="block text-center px-4 mt-4 py-2 text-md text-primary hover:bg-primary/5 rounded-lg"
          >
            عرض الكل
          </Link>
        </div>

        {/* يمكنك إضافة قسم إضافي هنا إذا كنت تريد */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:w-1/2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">محتوى إضافي</h2>
          <p className="text-gray-600">هذا قسم يمكنك إضافة أي محتوى إضافي تريده هنا</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashoard;