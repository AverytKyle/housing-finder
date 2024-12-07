import { csrfFetch } from "./csrf";



const LOAD = 'spots/LOAD';
const LOAD_BY_ID = 'spots/LOAD_BY_ID';
const CREATE_SPOT = 'spots/CREATE_SPOT';
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

const update = (spot) => ({
    type: UPDATE_SPOT,
    payload: spot
});

export const getSpots = () => async dispatch => {
    const response = await fetch(`/api/spots`);

    if (response.ok) {
        const spots = await response.json();
        dispatch(load(spots));
        return spots;
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

export const getCurrentUserSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/current');

    if (response.ok) {
        const spots = await response.json();
        dispatch(load(spots));
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

    dispatch(update(data));
    return response;
}

const initialState = {
    allSpots: {},
}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD: {
            const newState = { ...state };
            newState.allSpots = {};
            const spotsArray = action.spots.Spots;
            spotsArray.forEach(spot => {
              newState.allSpots[spot.id] = spot;
            });
            return newState;
        }
        case LOAD_BY_ID: {
            const newState = { ...state };
            newState.allSpots = { ...action.spot };
            return newState;
        }
        case UPDATE_SPOT: {
            const newState = { ...state };
            newState.allSpots[action.payload.id] = action.payload;
            return newState;
        }
        default:
            return state;
    }
}

export default spotsReducer;