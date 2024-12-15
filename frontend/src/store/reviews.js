import { csrfFetch } from "./csrf";

const LOAD = 'reviews/LOAD';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS';

const loadReviews = reviews => ({
    type: LOAD,
    reviews
});

const createReview = review => ({
    type: CREATE_REVIEW,
    review
});

const deleteReviewById = reviewId => ({
    type: DELETE_REVIEW,
    reviewId
});

const updateReview = review => ({
    type: UPDATE_REVIEW,
    review
});

const loadUserReviews = reviews => ({
    type: LOAD_USER_REVIEWS,
    reviews
});

export const getReviewsBySpotId = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadReviews(reviews));
        return reviews;
    }
}

export const getCurrentUserReviews = () => async dispatch => {
    const response = await csrfFetch(`/api/reviews/current`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadUserReviews(reviews));
        return reviews;
    }
}

export const createReviewForSpot = (spotId, { review, stars }) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ review, stars })
    });
   
    if (response.ok) {
        const newReview = await response.json();
        dispatch(createReview(newReview));
        return newReview;
    } else {
        const error = await response.json();
        throw new Error(error.message);
      }
}

export const updateReviewById = (reviewId, { review, stars }) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify({ review, stars })
    });

    if (response.ok) {
        const updatedReview = await response.json();
        dispatch(updateReview(updatedReview));
        return updatedReview;
    }
    return response.json().then(error => {
        throw new Error(error.message)
    })
}

export const deleteReview = reviewId => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });   
    if (response.ok) {
        dispatch(deleteReviewById(reviewId));
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
        case DELETE_REVIEW: {
            const newState = { ...state };
            delete newState.reviews[action.reviewId];
            return newState;
        }
        case UPDATE_REVIEW: {
            const newState = { ...state };
            newState.reviews[action.review.id] = action.review;
            return newState;
        }
        case LOAD_USER_REVIEWS: {
            const newState = { ...state };
            newState.reviews = {};
            action.reviews.Reviews.forEach(review => {
                newState.reviews[review.id] = review;
            });
            return newState;
        }
        default: 
            return state;
    }
}

export default reviewsReducer;