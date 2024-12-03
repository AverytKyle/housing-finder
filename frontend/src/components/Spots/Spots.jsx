import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots';
import './Spots.css';

function Spots() {
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots.allSpots));
    
    useEffect(() => {
        dispatch(getSpots());
    }, [dispatch])

    return (
        <div className="spots-container">
            {Object.values(spots).map(spot => (
                <div key={spot.id} className="spot-card">
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