import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots';
import { useNavigate } from "react-router-dom";
import { createSelector } from 'reselect';
import DeleteSpotModal from "./DeleteSpotModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

const selectSpots = createSelector(
    (state) => state.spots.allSpots,
    (allSpots) => Object.values(allSpots)
);

const ManageUserSpots = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
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
            <button className="create-spot">Create a New Spot</button>
            <div className="spots-container">
                {Object.values(spots).map((spot, index) => (
                    <div key={index} className="spot-card" onClick={() => navigate(`/spots/${spot.id}`)}>
                        <img src={spot.imageUrl} alt={spot.name} />
                        <h3>{spot.name}</h3>
                        <p>{spot.city}, {spot.state} {spot.avgRating}</p>
                        <p>${spot.price} night</p>
                        <div className="button-container">
                            <button className="update" onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
                            <button className="delete">
                                <OpenModalMenuItem
                                    itemText="Delete"
                                    onItemClick={() => setShowModal(true)}
                                    modalComponent={<DeleteSpotModal spotId={spot.id}/>}
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManageUserSpots;