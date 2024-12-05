import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className='menu-icons'>
      <div className='home-icon'>
        <NavLink to="/">Home</NavLink>
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