import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSpotById } from '../../store/spots';
import { getReviewsBySpotId } from '../../store/reviews';
import './SpotDetails.css';
import CreateReviewModal from '../Reviews/CreateReviewModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteReviewModal from '../Reviews/DeleteReviewModal';

function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
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

    return (
        <div className='spot-details-reviews'>
            <h2 className='spot-name'>{spotDetails.name}</h2>
            <h3 className='location'>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</h3>
            <div className='img-container'>
                {spotDetails.SpotImages.map((image, index) => (
                    <img key={index} src={image.url} />
                ))}
            </div>
            <div className='descrip-price'>
                <div className='description-container'>
                    <h2 className='owner-name'>Hosted by {spotDetails.Owner?.firstName} {spotDetails.Owner?.lastName}</h2>
                    <p className='description'>{spotDetails.description}</p>
                </div>
                <div key={spotDetails.id} className='price-reserve-box'>
                    <div className='price-reviews'>
                        <p className='price'>${spotDetails.price} per night</p>
                        <p className='raiting-reviews'>{spotDetails.avgStarRating} Stars &#x2022; {spotDetails.numReviews} reviews</p>
                    </div>
                    <div className='button'>
                        <button className='reserve-button' onClick={handleReserveClick} type='submit'>Reserve</button>
                    </div>
                </div>
            </div>
            <div className='review-container'>
                <h2>{spotDetails.avgStarRating} Stars &#x2022; {spotDetails.numReviews} reviews</h2>
                {sessionUser &&
                    (sessionUser.id !== spotDetails.Owner.id && reviewDetails.userId !== sessionUser.id) &&
                    <button className='create-review-button'>
                        <OpenModalMenuItem
                            itemText="Post a Review"
                            onItemClick={() => setShowModal(true)}
                            modalComponent={<CreateReviewModal spotId={spotId} />}
                        />
                    </button>}
                {Object.values(reviewDetails) && Object.values(reviewDetails).map((review, index) => (
                    <div key={index} className='review-item'>
                        <h3>{review.User?.firstName}</h3>
                        <p>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                        <p>{review.review}</p>
                        <button className='delete-button'>
                            <OpenModalMenuItem
                                itemText="Delete"
                                onItemClick={() => setShowModal(true)}
                                modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotDetails.id} />}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div >
    );
}

export default SpotDetails;