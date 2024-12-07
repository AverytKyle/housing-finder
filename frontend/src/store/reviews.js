// import { csrfFetch } from "./csrf";

const LOAD = 'reviews/LOAD';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';


const loadReviews = reviews => ({
    type: LOAD,
    reviews
});

const createReview = review => ({
    type: CREATE_REVIEW,
    review
});

export const getReviewsBySpotId = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadReviews(reviews));
    }
}

export const createReviewForSpot = (spotId, review) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review)
    });

    if (response.ok) {
        const newReview = await response.json();
        dispatch(createReview(newReview));
        return newReview;
    }
}

const initialState = {
    reviews: {}
}

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD: {
            const newState = { ...state };
            newState.reviews = {};
            const reviewsArray = action.reviews.Reviews;
            reviewsArray.forEach(review => {
                newState.reviews[review.id] = review;
            });
            return newState;
        }
        case CREATE_REVIEW: {
            const newState = { ...state };
            newState.reviews[action.review.id] = action.review;
            return newState;
        }
        default: 
            return state;
    }
}

export default reviewsReducer;