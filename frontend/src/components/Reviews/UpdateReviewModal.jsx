import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import * as reviewActions from '../../store/reviews';
import './CreateReviewModal.css';

function UpdateReviewModal({ reviewId }) {
    const review = useSelector(state => state.reviews.reviews[reviewId]);
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [reviewText, setReviewText] = useState(review.review);
    const [stars, setStars] = useState(review.stars);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [errors, setErrors] = useState({});

    if (!review || !review.Spot) {
        return <div>Loading...</div>;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        return dispatch(reviewActions.updateReviewById(reviewId, { review: reviewText, stars }))
            .then(() => {
                closeModal();
                dispatch(reviewActions.getCurrentUserReviews());
            })
            .catch((error) => {
                if (error.errors) {
                    setErrors(error.errors);
                } else {
                    setErrors({ review: 'Review already exists for this spot' });
                }
            });
    };

    const handleStarMouseEnter = (star) => {
        setHoveredStar(star);
    };

    const handleStarMouseLeave = () => {
        setHoveredStar(0);
    };

    const handleStarClick = (star) => {
        setStars(star);
    };

    return (
        <div className="create-review-modal">
            <h2 className='title'>How was your stay at {review.Spot.name}?</h2>
            <form className='review-form'>
                {errors.review && <p className="errors" style={{ color: 'red', margin: '5px 0' }}>{errors.review}</p>}
                <label>
                    <textarea
                        className='modal-textarea'
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder='Leave your review here...'
                    />
                </label>
                <div className="modal-stars">
                    {[1, 2, 3, 4, 5].map((star, index) => (
                        <FontAwesomeIcon
                            key={index}
                            icon={star <= stars || star <= hoveredStar ? faStarSolid : faStarRegular}
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarMouseEnter(star)}
                            onMouseLeave={handleStarMouseLeave}
                            className={(star <= stars || star <= hoveredStar) ? 'star-hover' : ''}
                            required
                        />
                    ))}
                </div>
                <button className='submit-button' type="submit" disabled={reviewText.length < 10 || stars === 0} onClick={handleSubmit}>Update Your Review</button>
            </form>
        </div>
    );
}

export default UpdateReviewModal;