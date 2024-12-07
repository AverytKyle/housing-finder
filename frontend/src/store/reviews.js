import { csrfFetch } from "./csrf";

const LOAD = 'reviews/LOAD';



const loadReviews = reviews => ({
    type: LOAD,
    reviews
});

export const getReviewsBySpotId = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadReviews(reviews));
    }
}

const initialState = {
    reviews: {}
}

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD: {
            const newState = { ...state };
            const reviewsArray = action.reviews.Reviews;
            reviewsArray.forEach(review => {
                newState.reviews[review.id] = review;
            });
            return newState;
        }
        default: 
            return state;
    }
}

export default reviewsReducer;