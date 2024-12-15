import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSpotById } from '../../store/spots';
import { getReviewsBySpotId } from '../../store/reviews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import './SpotDetails.css';
import CreateReviewModal from '../Reviews/CreateReviewModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteReviewModal from '../Reviews/DeleteReviewModal';

function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spotDetails = useSelector(state => state.spots.allSpots);
    const reviewDetails = useSelector(state => state.reviews.reviews)
    const sessionUser = useSelector((state) => state.session.user);
    const [, setShowModal] = useState(false);

    useEffect(() => {
        dispatch(getSpotById(spotId));
        dispatch(getReviewsBySpotId(spotId));
    }, [dispatch, spotId]);

    if (!(spotDetails && reviewDetails) || !spotDetails.SpotImages) {
        return <div>Loading...</div>;
    }

    const handleReserveClick = () => {
        alert('Feature Coming Soon...')
    };

    const handleUpdateClick = () => {
        navigate('/reviews/current');
    }

    const ratingAndButtonLogic = () => {
        const userHasReview = Object.values(reviewDetails).some(review => review.userId === sessionUser?.id);

        if (spotDetails.numReviews === 0 && sessionUser && sessionUser.id !== spotDetails.Owner.id && !userHasReview) {
            return (
                <div>
                    <h2><FontAwesomeIcon icon={faStarSolid} /> New</h2>
                    <p style={{ fontSize: '15pt' }}>Be the first to post a review!</p>
                    <button className='create-review-button'>
                        <OpenModalMenuItem
                            itemText="Post a Review"
                            onItemClick={() => setShowModal(true)}
                            modalComponent={<CreateReviewModal spotId={spotId} />}
                        />
                    </button>
                </div>
            );
        } else if (spotDetails.numReviews === 0) {
            return (
                <h2><FontAwesomeIcon icon={faStarSolid} /> New</h2>
            );
        } else {
            return (
                <div>
                    <h2>
                        <FontAwesomeIcon icon={faStarSolid} />
                        {spotDetails.avgStarRating} &#x2022;
                        {spotDetails.numReviews === 1 ?
                            `${spotDetails.numReviews} review` :
                            `${spotDetails.numReviews} reviews`}
                    </h2>
                    {sessionUser &&
                        sessionUser.id !== spotDetails.Owner.id &&
                        !userHasReview && (
                            <button className='create-review-button'>
                                <OpenModalMenuItem
                                    itemText="Post a Review"
                                    onItemClick={() => setShowModal(true)}
                                    modalComponent={<CreateReviewModal spotId={spotId} />}
                                />
                            </button>
                        )}
                </div>
            );
        }
    };

    return (
        <div className='spot-details-reviews'>
            <h2 className='spot-name'>{spotDetails.name}</h2>
            <h3 className='location'>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</h3>
            <div className="image-container">
                <div className="main-image">
                    <img src={spotDetails.SpotImages[0].url} alt="Main spot view" />
                </div>
                <div className="image-grid">
                    {spotDetails.SpotImages.slice(1, 5).map((image, index) => (
                        <img key={index} src={image.url} alt={`Spot view ${index + 2}`} />
                    ))}
                </div>
            </div>
            <div className='descrip-price'>
                <div className='description-container'>
                    <h2 className='owner-name'>Hosted by {spotDetails.Owner?.firstName} {spotDetails.Owner?.lastName}</h2>
                    <p className='description'>{spotDetails.description}</p>
                </div>
                <div key={spotDetails.id} className='price-reserve-box'>
                    <div className='price-reviews'>
                        <p className='price'>${spotDetails.price} night</p>
                        <p className='raiting-reviews'>{spotDetails.avgStarRating} Stars &#x2022; {spotDetails.numReviews === 1 ? `${spotDetails.numReviews} review` : `${spotDetails.numReviews} reviews`}</p>
                    </div>
                    <div className='button'>
                        <button className='reserve-button' onClick={handleReserveClick} type='submit'>Reserve</button>
                    </div>
                </div>
            </div>
            <div className='review-container'>
                {ratingAndButtonLogic()}
                {Object.values(reviewDetails) && Object.values(reviewDetails)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((review, index) => (
                        <div key={index} className='review-item'>
                            <h3>{review.User?.firstName}</h3>
                            <p className='date'>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                            <p className='review-text'>{review.review}</p>
                            {sessionUser && sessionUser.id === review.User.id &&
                                <div className='update-delete'>
                                    <button className="delete-button" onClick={handleUpdateClick}>
                                        Update
                                    </button>
                                    <button className='delete-button'>
                                        <OpenModalMenuItem
                                            itemText="Delete"
                                            onItemClick={() => setShowModal(true)}
                                            modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotDetails.id} />}
                                        />
                                    </button>
                                </div>
                            }
                        </div>
                    ))}
            </div>
        </div >
    );
}

export default SpotDetails;