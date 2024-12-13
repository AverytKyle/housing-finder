import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSelector } from 'reselect';
import { getSpots } from '../../store/spots';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
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
                    <div className="tool-tip">
                        <div className='spot-stuff'>
                            <img className='spot-img' src={spot.previewImage} alt={spot.name} />
                            <div className='spot-info-container'>
                                <p>{spot.city}, {spot.state}</p>
                                <div className='star-rating'>
                                    <FontAwesomeIcon icon={faStarSolid} />
                                    <p>{spot.avgRating === '0.0' ? 'New' : spot.avgRating}</p>
                                </div>
                            </div>
                            <p className='price'>${spot.price} night</p>
                        </div>
                        <span className="tool-tip-text">{spot.name}</span>
                    </div>
                </div>
            ))}
        </div>

    )
}

export default Spots;