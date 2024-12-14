import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots';
import { useNavigate } from "react-router-dom";
import { createSelector } from 'reselect';
import DeleteSpotModal from "./DeleteSpotModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import './ManageUserSpots.css';

const selectSpots = createSelector(
    (state) => state.spots.allSpots,
    (allSpots) => Object.values(allSpots)
);

const ManageUserSpots = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [, setShowModal] = useState(false);
    const spots = useSelector(selectSpots);

    useEffect(() => {
        dispatch(spotActions.getCurrentUserSpots());
    }, [dispatch])

    if (!spots) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2> Manage Your Spots</h2>
            <button className="create-new-spot" onClick={() => navigate('/spots')}>Create a New Spot</button>
            <div className="spots-container">
                {Object.values(spots).map((spot, index) => (
                    <div key={index} className="spot-card" onClick={(e) => {
                        if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                            navigate(`/spots/${spot.id}`)
                        }
                    }}>
                        <div className="tool-tip">
                            <div className='spot-stuff'>
                                <img className='spot-img' src={spot.previewImage} alt={spot.name} />
                                <div className='spot-info-container'>
                                    <p>{spot.city}, {spot.state}</p>
                                    <p> {spot.avgRating}</p>
                                </div>
                                <p className='price'>${spot.price} night</p>
                            </div>
                            <div className="button-container">
                                <button className="update" onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
                                <button className="delete">
                                    <OpenModalMenuItem
                                        itemText="Delete"
                                        onItemClick={() => setShowModal(true)}
                                        modalComponent={<DeleteSpotModal spotId={spot.id} />}
                                    />
                                </button>
                            </div>
                            <span className="tool-tip-text">{spot.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManageUserSpots;