import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as spotActions from '../../store/spots';


function DeleteSpotModal({ spotId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleclick = () => {
        dispatch(spotActions.deleteSpot(spotId))
            .then(() => {
                dispatch(spotActions.getCurrentUserSpots());
            });
        closeModal();
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div className='confirm-delete-modal'>
            <h1 className='title'>Confirm Delete</h1>
            <div className='button-container'>
                <button className='yes-button' onClick={handleclick}>Yes (Delete Spot)</button>
                <button className='no-button' onClick={handleCancel}>No (Keep Spot)</button>
            </div>
        </div>
    );
}

export default DeleteSpotModal;