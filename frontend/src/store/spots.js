import { csrfFetch } from "./csrf";



const LOAD = 'spots/LOAD';
const LOAD_BY_ID = 'spots/LOAD_BY_ID';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const REVIEWS_BY_ID = 'spots/REVIEWS_BY_ID';
const LOAD_USER_SPOTS = 'spots/LOAD_USER_SPOTS';


const load = spots => ({
    type: LOAD,
    spots
});

const loadById = spot => ({
    type: LOAD_BY_ID,
    spot
})

const addNewSpot = (spot) => ({
    type: CREATE_SPOT,
    payload: spot
})

const loagReviewsById = reviews => ({
    type: REVIEWS_BY_ID,
    reviews
})

const loadUserSpots = spots => ({
    type: LOAD_USER_SPOTS,
    spots
});

export const getSpots = () => async dispatch => {
    const response = await fetch(`/api/spots`);

    if (response.ok) {
        const spots = await response.json();
        dispatch(load(spots));
    }
};

export const getSpotById = (id) => async dispatch => {
    const spotId = parseInt(id, 10);

    if (isNaN(spotId)) return;

    const response = await fetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadById(spot));
        return spot;
    }
}

export const createSpot = (spot) => async dispatch => {
    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    } = spot;

    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
    })

    const data = await response.json();
    dispatch(addNewSpot(data.spot));
    return response;
}

export const getReviewsById = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loagReviewsById(reviews));
    }
}

export const getCurrentUserSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/current');

    if (response.ok) {
        const spots = await response.json();
        dispatch(loadUserSpots(spots));
        return spots;
    }
};

const initialState = {
    allSpots: {},
    singleSpot: {},
    allReviews: []
}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD: {
            const newState = { ...state };
            const spotsArray = action.spots.Spots;
            spotsArray.forEach(spot => {
                newState.allSpots[spot.id] = spot;
            });
            return newState;
        }
        case LOAD_BY_ID: {
            const newState = { ...state };
            newState.singleSpot = { ...action.spot };
            return newState;
        }
        case REVIEWS_BY_ID: {
            const newState = { ...state };
            const reviewsArray = action.reviews.Reviews;
            reviewsArray.forEach(review => {
                newState.allReviews[review.id] = review;
            });
            return newState
        }
        case LOAD_USER_SPOTS: {
            const newState = { ...state };
            const spotsArray = action.spots.Spots;
            spotsArray.forEach(spot => {
                newState.allSpots[spot.id] = spot;
            });
            return newState;
        }
        default:
            return state;
    }
}

export default spotsReducer;