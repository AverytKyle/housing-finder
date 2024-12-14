import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/reviews';
import { createSelector } from 'reselect';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteReviewModal from "./DeleteReviewModal";
import UpdateReviewModal from "./UpdateReviewModal";

const selectReviews = createSelector(
    (state) => state.reviews.reviews,
    (reviews) => Object.values(reviews)
);

const ManageUserReviews = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [, setShowModal] = useState(false);
    const reviews = useSelector(selectReviews);

    useEffect(() => {
        dispatch(reviewActions.getCurrentUserReviews())
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
                            <h2>{review.Spot.name}</h2>
                            <p>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                            <p>{review.review}</p>
                            <div className="button-container">
                                <button className="delete-button">
                                    <OpenModalMenuItem
                                        itemText="Update"
                                        onItemClick={() => setShowModal(true)}
                                        modalComponent={<UpdateReviewModal reviewId={review.id} spotId={review.Spot.id} />}
                                    />
                                </button>
                                <button className="delete-button">
                                    <OpenModalMenuItem
                                        itemText="Delete"
                                        onItemClick={() => setShowModal(true)}
                                        modalComponent={<DeleteReviewModal reviewId={review.id} spotId={review.Spot.id} />}
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