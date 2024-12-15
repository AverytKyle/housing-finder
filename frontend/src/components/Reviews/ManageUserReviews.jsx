import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/reviews';
import * as spotActions from '../../store/spots';
import { createSelector } from 'reselect';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteReviewModal from "./DeleteReviewModal";
import UpdateReviewModal from "./UpdateReviewModal";

const selectReviews = createSelector(
    (state) => state.reviews.reviews,
    (state) => state.session.user?.id,
    (reviews, userId) => Object.values(reviews).filter(review => review.userId === userId)
);

const selectSpots = (state) => state.spots.allSpots;

const ManageUserReviews = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [, setShowModal] = useState(false);
    const reviews = useSelector(selectReviews);
    const spots = useSelector(selectSpots);

    useEffect(() => {
        dispatch(reviewActions.getCurrentUserReviews())
            .then(() => dispatch(spotActions.getSpots()))
            .then(() => setIsLoading(false));
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Manage Reviews</h1>
            <div>
                {Object.values((reviews))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((review, index) => (
                        <div key={index} className="review-card">
                            <h2>{spots[review.spotId]?.name}</h2>
                            <p>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                            <p className="review-text">{review.review}</p>
                            <div className="button-container">
                                <button className="delete-button">
                                    <OpenModalMenuItem
                                        itemText="Update"
                                        onItemClick={() => setShowModal(true)}
                                        modalComponent={<UpdateReviewModal reviewId={review.id} />}
                                    />
                                </button>
                                <button className="delete-button">
                                    <OpenModalMenuItem
                                        itemText="Delete"
                                        onItemClick={() => setShowModal(true)}
                                        modalComponent={<DeleteReviewModal reviewId={review.id} spotId={review.spotId} />}
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default ManageUserReviews;