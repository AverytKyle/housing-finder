import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/reviews';
import { getReviewsBySpotId } from '../../store/reviews';
import { getSpotById } from '../../store/spots';
import './DeleteReviewModal.css';

function DeleteReviewModal({ reviewId, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleclick = () => {
        dispatch(deleteReview(reviewId))
        .then(() => {
            dispatch(getReviewsBySpotId(spotId));
            dispatch(getSpotById(spotId));
            closeModal();
        });
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div className='confirm-delete-modal'>
            <h1 className='title'>Confirm Delete</h1>
            <p className='delete-confirmation'>Are you sure you want to remove this review?</p>
            <div className='button-container'>
                <button className='yes-button' onClick={handleclick}>Yes (Delete Review)</button>
                <button className='no-button' onClick={handleCancel}>No (Keep Review)</button>
            </div>
        </div>
    );
}

export default DeleteReviewModal;