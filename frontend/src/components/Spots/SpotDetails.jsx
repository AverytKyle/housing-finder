import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSpotById } from '../../store/spots';
import './Spots.css';

function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spotDetails = useSelector(state => state.spots.singleSpot);

    useEffect(() => {
        dispatch(getSpotById(spotId));
    }, [dispatch, spotId]);

    return (
        <div className='spot-details'>
            <h2>{spotDetails.name}</h2>
            <h3>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</h3>
        </div>
    );
}

export default SpotDetails;