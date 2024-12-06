import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSpotById, getReviewsById } from '../../store/spots';
import './SpotDetails.css';

function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spotDetails = useSelector(state => state.spots.singleSpot);
    const reviewDetails = useSelector(state => state.spots.allReviews)

    useEffect(() => {
        dispatch(getSpotById(spotId));
        dispatch(getReviewsById(spotId));
    }, [dispatch, spotId]);

    if (!spotDetails || !spotDetails.SpotImages) {
        return <div>Loading...</div>;
    }

    const handleReserveClick = () => {
        alert('Feature Coming Soon...')
    };

    return (
        <div className='spot-details-reviews'>
            <h2 className='spot-name'>{spotDetails.name}</h2>
            <h3 className='location'>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</h3>
            {spotDetails.SpotImages.map(image => (
                <div key={spotDetails.id} className='img-container'>
                    <img src={image.url} />
                </div>
            ))}
            <div className='descrip-price'>
                <div>
                    <h2 className='owner-name'>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</h2>
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
                {reviewDetails && reviewDetails.map(review => (
                    <div key={review.id} className='review-item'>
                        <h3>{review.User.firstName}</h3>
                        <p>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                        <p>{review.review}</p>
                    </div>
                ))}
            </div>
        </div >
    );
}

export default SpotDetails;