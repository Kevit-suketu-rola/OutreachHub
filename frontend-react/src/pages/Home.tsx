import { useEffect } from 'react';
import LandingHero from '../components/LandingHero';
import PublicNavbar from '../components/shadcn/PublicNavbar';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user-token')) {
      navigate('/user');
    }
  }, []);

  return (
    <div className="overflow-hidden">
      <PublicNavbar />
      <LandingHero />
    </div>
  );
};

export default Home;
