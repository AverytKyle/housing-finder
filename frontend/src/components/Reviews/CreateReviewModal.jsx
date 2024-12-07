import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import * as reviewActions from '../../store/reviews';
import * as spotActions from '../../store/spots';

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
        <div className='creatreview-modal'>
            <h1 className='title'>How was your stay?</h1>
            <form className='modal container'>
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
                        />
                    ))}
                </div>
                <button type="submit" disabled={review.length < 10} onClick={handleSubmit}>Submit Your Review</button>
            </form>
        </div>
    );
}

export default CreateReviewModal;