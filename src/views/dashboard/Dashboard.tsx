import AlbumsList from "../../components/dashboard/free/album/AlbumsList";
import AdCarousel from "../../components/dashboard/free/main/AdCarousel";
import UpcomingEvents from "../../components/dashboard/free/main/UpcomingEvents";
import BranchesList from "../../components/dashboard/free/members/BranchesList";
import { useGetAdvertisementsQuery } from "../../store/api/advertisementApi";
import { useAppSelector } from "../../store/store";

const Dashboard = () => {
  const { data: apiResponse = { data: [], pagination: {} } } = useGetAdvertisementsQuery({});
  const ads = apiResponse!.data;
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section className="w-full overflow-x-hidden">
      {/* Header ترحيبي */}
      <header className="bg-white -mt-8 mb-8 px-4 pb-4 shadow-sm border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary">
          مرحباً بك، {user?.email} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {user?.role[0] === "مستخدم" 
            ? `عضو في ${user?.memberId.familyBranch.name}`
            : "مسؤول النظام"}
        </p>
      </header>

      <AdCarousel ads={ads} />

      <section>
        <UpcomingEvents />
      </section>

      <AlbumsList />

      <BranchesList />
    </section>
  )
}

export default Dashboard;