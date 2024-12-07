import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots';
import { useNavigate } from "react-router-dom";

const ManageUserSpots = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spots = useSelector(state => Object.values(state.spots.allSpots));

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
                {Object.values(spots).map(spot => (
                    <div key={spot.id} className="spot-card">
                        <img src={spot.imageUrl} alt={spot.name} />
                        <h3>{spot.name}</h3>
                        <p>{spot.city}, {spot.state} {spot.avgRating}</p>
                        <p>${spot.price} night</p>
                        <div className="button-container">
                            <button className="update" onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
                            <button className="delete">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManageUserSpots;