import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Spots from './components/Spots/Spots';
import CreateSpotForm from './components/Spots/CreateSpotForm';
import * as sessionActions from './store/session';
import SpotDetails from './components/Spots/SpotDetails';
import ManageUserSpots from './components/Spots/ManageUserSpots';
import UpdateSpot from './components/Spots/UpdateSpot';
import ManageUserReviews from './components/Reviews/ManageUserReviews';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Spots />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />
      },
      {
        path: '/spots',
        element: <CreateSpotForm />
      },
      {
        path: '/spots/current',
        element: <ManageUserSpots />
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpot />
      },
      {
        path: '/reviews/current',
        element: <ManageUserReviews />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;