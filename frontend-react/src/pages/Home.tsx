import LandingHero from '../components/LandingHero';
import PublicNavbar from '../components/shadcn/PublicNavbar';

const Home = () => {
  localStorage.clear();

  return (
    <div className="overflow-hidden">
      <PublicNavbar />
      <LandingHero />
    </div>
  );
};

export default Home;
