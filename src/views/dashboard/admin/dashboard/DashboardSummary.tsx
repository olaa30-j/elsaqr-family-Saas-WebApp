import { Bell, CalendarSearchIcon, Image, Users } from 'lucide-react';
import { useState } from 'react';

const DashboardSummary = () => {
  const [stats] = useState({
    gallery: {
      total: 124,
      recent: 12,
    },
    events: {
      upcoming: 5,
      past: 23,
    },
    announcements: {
      active: 8,
      expired: 15,
    },
    users: {
      total: 342,
      new: 14,
    }
  });

  return (
    <div className=" min-h-screen">
      
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* معرض الصور */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <Image  className="text-2xl" />
            </div>
            <div className="text-right">
              <h3 className="text-gray-500 text-sm">معرض الصور</h3>
              <p className="text-2xl font-bold mt-1">{stats.gallery.total.toLocaleString('ar-EG')}</p>
              <p className="text-green-600 text-xs mt-1">+{stats.gallery.recent} جديد</p>
            </div>
          </div>
        </div>

        {/* الأحداث */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <CalendarSearchIcon className="text-2xl" />
            </div>
            <div className="text-right">
              <h3 className="text-gray-500 text-sm">المناسبات</h3>
              <p className="text-2xl font-bold mt-1">{stats.events.upcoming.toLocaleString('ar-EG')}</p>
              <p className="text-gray-500 text-xs mt-1">{stats.events.past} منتهية</p>
            </div>
          </div>
        </div>

        {/* الإعلانات */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <Bell className="text-2xl" />
            </div>
            <div className="text-right">
              <h3 className="text-gray-500 text-sm">الإعلانات</h3>
              <p className="text-2xl font-bold mt-1">{stats.announcements.active.toLocaleString('ar-EG')}</p>
              <p className="text-gray-500 text-xs mt-1">{stats.announcements.expired} منتهية</p>
            </div>
          </div>
        </div>

        {/* المستخدمون */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <Users className="text-2xl" />
            </div>
            <div className="text-right">
              <h3 className="text-gray-500 text-sm">المستخدمون</h3>
              <p className="text-2xl font-bold mt-1">{stats.users.total.toLocaleString('ar-EG')}</p>
              <p className="text-green-600 text-xs mt-1">+{stats.users.new} جديد</p>
            </div>
          </div>
        </div>
      </div>

      {/* أحدث الإضافات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أحدث الصور */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">أحدث الصور المضافة</h2>
            <Image className="text-gray-400" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                {/* هنا يمكن استبدالها بعنصر صورة حقيقي */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  صورة {item}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
            عرض الكل
          </button>
        </div>

        {/* الأحداث القادمة */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">الأحداث القادمة</h2>
            <CalendarSearchIcon className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {['حفل تخرج', 'معرض فني', 'ندوة ثقافية'].map((event, index) => (
              <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{event}</span>
                <span className="text-xs text-gray-500">٢٥ مايو</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
            عرض الكل
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;