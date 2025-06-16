import AboutSection from "../../components/home/AboutSection";
import BoxFeaturesSection from "../../components/home/BoxFeaturesSection";
import ExploreFeaturesSection from "../../components/home/ExploreFeaturesSection";
import FamilyReviewsSection from "../../components/home/FamilyReviewsSection";
import JoinFamilySection from "../../components/home/JoinFamilySection";
import MainHeroSection from "../../components/home/MainSection";
import ContactUs from "../contactus/ContactUs";

const Home = () => {

  return (
    <div>
      <MainHeroSection />
      <BoxFeaturesSection />
      <AboutSection />
      <ExploreFeaturesSection />
      <FamilyReviewsSection />
      <JoinFamilySection />
      <ContactUs/>
    </div>
  )
}

export const ChevronRightIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

export const UserPlusIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" x2="19" y1="8" y2="14"></line>
    <line x1="22" x2="16" y1="11" y2="11"></line>
  </svg>
);

export const ChevronDownIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m6 9 6 6 6-6"></path>
  </svg>
);
export default Home;