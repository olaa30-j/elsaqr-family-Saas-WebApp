import { Bell, CalendarSearchIcon, Image, Users } from 'lucide-react';
import { useGetAlbumStatsQuery, useGetEventOverviewQuery, useGetUsersStatsQuery, useGetAdvertisementStatsQuery } from '../../../../store/api/chartsApi';
import { Link } from 'react-router-dom';

const DashboardSummary = () => {
  const { data: albumStats, isLoading: albumLoading } = useGetAlbumStatsQuery({ days: 7 });
  const { data: eventStats, isLoading: eventLoading } = useGetEventOverviewQuery();
  const { data: userStats, isLoading: userLoading } = useGetUsersStatsQuery();
  const { data: adStats, isLoading: adLoading } = useGetAdvertisementStatsQuery();

  const isLoading = albumLoading || eventLoading || userLoading || adLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen p-4">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div> */}
      </div>
    );
  }

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
      expired: 0,
    },
    users: {
      total: userStats?.data.totalUsers || 0,
      new: userStats?.data.newUsers || 0,
    },
  };

  return (
    <div className="min-h-screen p-4">
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* معرض الصور */}
        <StatCard
          icon={<Image className="w-5 h-5" />}
          title="معرض الصور"
          value={stats.gallery.total}
          change={stats.gallery.recent}
          color="blue"
          isPositive
        />

        {/* الأحداث */}
        <StatCard
          icon={<CalendarSearchIcon className="w-5 h-5" />}
          title="المناسبات"
          value={stats.events.upcoming}
          secondaryValue={stats.events.past}
          secondaryLabel="منتهية"
          color="purple"
        />

        {/* الإعلانات */}
        <StatCard
          icon={<Bell className="w-5 h-5" />}
          title="الإعلانات"
          value={stats.announcements.active}
          secondaryValue={stats.announcements.expired}
          secondaryLabel="منتهية"
          color="amber"
        />

        {/* المستخدمون */}
        <StatCard
          icon={<Users className="w-5 h-5" />}
          title="المستخدمون"
          value={stats.users.total}
          change={stats.users.new}
          color="green"
          isPositive
        />
      </div>

      {/* أحدث الإضافات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أحدث الصور */}
        <RecentSection
          title="أحدث الصور المضافة"
          icon={<Image className="w-5 h-5 text-gray-400" />}
          items={albumStats?.data.recentAlbums || []}
          type="images"
          link="/albums"
        />

        {/* الأحداث القادمة */}
        <RecentSection
          title="الأحداث القادمة"
          icon={<CalendarSearchIcon className="w-5 h-5 text-gray-400" />}
          items={eventStats?.data.nextEvent ? [eventStats.data.nextEvent] : []}
          type="events"
          link="/events"
        />
      </div>
    </div>
  );
};

// مكون بطاقة الإحصائيات المساعد
const StatCard = ({
  icon,
  title,
  value,
  change,
  secondaryValue,
  secondaryLabel,
  color,
  isPositive = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  change?: number;
  secondaryValue?: number;
  secondaryLabel?: string;
  color: string;
  isPositive?: boolean;
}) => {
  const colorClasses: any = {
    blue: {
      bg: 'bg-primary/5',
      text: 'text-primary',
      border: 'border-primary/10'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-100'
    },
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border  hover:shadow-md transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${colorClasses[color].bg} ${colorClasses[color].text}`}>
          {icon}
        </div>
        <div className="text-right">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-800">{value.toLocaleString('ar-EG')}</p>
          {change !== undefined ? (
            <p className={`${isPositive ? 'text-green-600' : 'text-red-600'} text-xs mt-1 flex items-center justify-end gap-1`}>
              <span className={`inline-block w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></span>
              +{change} جديد
            </p>
          ) : (
            <p className="text-gray-500 text-xs mt-1 flex items-center justify-end gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
              {secondaryValue} {secondaryLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// مكون القسم الأخير المساعد
const RecentSection = ({
  title,
  icon,
  items,
  type,
  link,
}: {
  title: string;
  icon: React.ReactNode;
  items: any[];
  type: 'images' | 'events';
  link:string;
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <Link to={link} className="text-md text-primary hover:text-primary/90 transition-colors">
          عرض الكل
        </Link>
      </div>

      {type === 'images' ? (
        <div className="grid grid-cols-3 gap-3">
          {items.slice(0, 6).map((item, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative group"
            >
              {/* هنا يمكنك استخدام صورة حقيقية */}
              <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:opacity-90 transition-opacity">
                <img src={item.images[item.images.length -1].image} className='w-full h-full' alt="ablum" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:justify-between md:items-center p-4 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors"
            >
              <div className="mb-2 md:mb-0">
                <h3 className="text-sm font-medium text-gray-800">{item.address}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                  {item.status === 'active' ? 'نشط' : 'غير مفعل'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(item.startDate).toLocaleDateString('ar-EG')} - {new Date(item.endDate).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">لا توجد عناصر لعرضها</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardSummary;