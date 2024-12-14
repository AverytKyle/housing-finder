import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import * as reviewActions from '../../store/reviews';
import * as spotActions from '../../store/spots';
import './CreateReviewModal.css';

function CreateReviewModal({ spotId }) {
    const sessionUser = useSelector((state) => state.session.user);
    const spot = useSelector(state => state.spots.allSpots);
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        // Check if the user is the owner of the spot
        if (spot.Owner.id === sessionUser.id) {
            // Prevent the form from being submitted
            return;
        }

        return dispatch(reviewActions.createReviewForSpot(spotId, { review, stars }))
            .then(() => {
                closeModal();
                dispatch(spotActions.getSpotById(spotId));
                dispatch(reviewActions.getReviewsBySpotId(spotId));
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

    const modalHeight = errors.review ? '350px' : '300px';

    return (
        <div className='create-review-modal' style={{ height: modalHeight }}>
            <h1 className='title'>How was your stay?</h1>
            <form className='review-form'>
                {errors.review && <p className="errors" style={{ color: 'red', margin: '5px 0' }}>{errors.review}</p>}
                <label>
                    <textarea
                        className='modal-textarea'
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder='Leave your review here...'
                    />
                </label>
                <div className='modal-stars'>
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
                <button className='submit-button' type="submit" disabled={review.length < 10 || stars === 0} onClick={handleSubmit}>Submit Your Review</button>
            </form>
        </div>
    );
}

export default CreateReviewModal;