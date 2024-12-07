import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/reviews';
import { getReviewsBySpotId } from '../../store/reviews';
import { getSpotById } from '../../store/spots';

function DeleteReviewModal({ reviewId, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleclick = (e) => {
        dispatch(deleteReview(reviewId))
        .then(() => {
            dispatch(getReviewsBySpotId(spotId));
            dispatch(getSpotById(spotId));
            closeModal();
        });
    };

    const handleCancel = (e) => {
        closeModal();
    };

    return (
        <div className='confirm-delete-modal'>
            <h1 className='title'>Confirm Delete</h1>
            <div className='button-container'>
                <button className='yes-button' onClick={handleclick}>Yes (Delete Review)</button>
                <button className='no-button' onClick={handleCancel}>No (Keep Review)</button>
            </div>
        </div>
    );
}

export default DeleteReviewModal;