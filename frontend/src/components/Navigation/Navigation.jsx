import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className='menu-icons'>
      <div className='home-icon'>
        <Link to="/" className="logo">
          <img src="https://png.pngtree.com/element_our/png/20181214/real-estate-house-logo-graphic-design-template-vector-illustration-png_269519.jpg" alt="logo" />
          <span className='logo-text'>Housing Finder</span>
        </Link>
      </div>
      <div className='profile'>
        {isLoaded && sessionUser && (
          <div className='create-spot'>
            <NavLink to="/spots">Create a New Spot</NavLink>
          </div>
        )}
        {isLoaded && (
          <div className='profile-icon'>
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;