import { csrfFetch } from "./csrf";



const LOAD = 'spots/LOAD';
const LOAD_BY_ID = 'spots/LOAD_BY_ID';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const REVIEWS_BY_ID = 'spots/REVIEWS_BY_ID';
const LOAD_USER_SPOTS = 'spots/LOAD_USER_SPOTS';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';


const load = spots => ({
    type: LOAD,
    spots
});

const loadById = spot => ({
    type: LOAD_BY_ID,
    spot
});

const addNewSpot = (spot) => ({
    type: CREATE_SPOT,
    payload: spot
})

const loagReviewsById = reviews => ({
    type: REVIEWS_BY_ID,
    reviews
});

const loadUserSpots = spots => ({
    type: LOAD_USER_SPOTS,
    spots
});

const update = (spot) => ({
    type: UPDATE_SPOT,
    payload: spot
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
        price,
        imageUrl
    } = spot;

    //First create the spot
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
    });

    const data = await response.json();
    
    // Then add the image to the spot
    if (imageUrl) {
        await csrfFetch(`/api/spots/${data.spot.id}/images`, {
            method: 'POST',
            body: JSON.stringify({
                url: imageUrl,
                preview: true
            })
        });
    }

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

export const updateSpot = (spotId, spot) => async dispatch => {
    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        imageUrl
    } = spot;

    // Update spot details
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
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
    });

    const data = await response.json();

    // Add new image if provided
    if (imageUrl) {
        await csrfFetch(`/api/spots/${spotId}/images`, {
            method: 'POST',
            body: JSON.stringify({
                url: imageUrl,
                preview: true
            })
        });
    }

    dispatch(updateExistingSpot(data));
    return response;
}

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
        case UPDATE_SPOT: {
            const newState = { ...state };
            newState.singleSpot = action.payload;
            newState.allSpots[action.payload.id] = action.payload;
            return newState;
        }
        default:
            return state;
    }
}

export default spotsReducer;