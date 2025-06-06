import AdCarousel from "../../components/dashboard/free/main/AdCarousel";
// import AdsSection from "../../components/dashboard/free/main/AdsSection"
import UpcomingEvents from "../../components/dashboard/free/main/UpcomingEvents"
import BranchesList from "../../components/dashboard/free/members/BranchesList";
import { useGetAdvertisementsQuery } from "../../store/api/advertisementApi";


const Dashboard = () => {
  const {  data: apiResponse = { data: [], pagination: {} } } = useGetAdvertisementsQuery({});
  const ads = apiResponse!.data;  

  return (
    <section className="w-full overflox-x-hidden">

      <section>
        <AdCarousel ads={ads} />
      </section>

      <section>
        <UpcomingEvents />
      </section>
      <BranchesList/>


      {/* <AdsSection /> */}

    </section>
  )
}

export default Dashboard


