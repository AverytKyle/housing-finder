import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSelector } from 'reselect';
import { getSpots } from '../../store/spots';
import { getReviewsBySpotId } from '../../store/reviews';
import './Spots.css';

const selectSpots = createSelector(
    (state) => state.spots.allSpots,
    (allSpots) => Object.values(allSpots)
);

function Spots() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spots = useSelector(selectSpots);

    useEffect(() => {
        dispatch(getSpots());
    }, [dispatch]);

    return (
        <div className="spots-container">
            {Object.values(spots).map((spot, index) => (
                <div key={index} className="spot-card" onClick={() => navigate(`/spots/${spot.id}`)}>
                    <div className='spot-stuff'>
                        <img className='spot-img' src={spot.previewImage} alt={spot.name} />
                        <div className='spot-info-container'>
                            <p>{spot.city}, {spot.state}</p>
                            <p> {spot.avgRating}</p>
                        </div>
                        <p className='price'>${spot.price} night</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Spots;