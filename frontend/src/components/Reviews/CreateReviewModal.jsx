import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import * as reviewActions from '../../store/reviews';
import * as spotActions from '../../store/spots';


function CreateReviewModal({ spotId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        return dispatch(reviewActions.createReviewForSpot(spotId, review))
            .then(() => {
                closeModal();
                dispatch(spotActions.getSpotById(spotId));
            });

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
                        icon={stars >= star ? faStarSolid : faStarRegular}
                        onClick={() => setStars(star)}
                      />
                    ))}
                </div>
                <button className='submit-button' onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    );
}

export default CreateReviewModal;