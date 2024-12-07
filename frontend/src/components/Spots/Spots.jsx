import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSelector } from 'reselect';
import { getSpots } from '../../store/spots';
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
                    <img src={spot.previewImage} alt={spot.name} />
                    <h3>{spot.name}</h3>
                    <p>{spot.city}, {spot.state} {spot.avgRating}</p>
                    <p>${spot.price} night</p>
                </div>
            ))}
        </div>
    )
}

export default Spots;