import { csrfFetch } from "./csrf";



const LOAD = 'spots/LOAD';
const LOAD_BY_ID = 'spots/LOAD_BY_ID';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';
const REMOVE_SPOT = 'spots/REMOVE_SPOT';


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

const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId
})

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
    console.log('Creating spot:', spot);
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
    } = spot;

    try{
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

    if (response.ok) {
        const spot = await response.json();
        dispatch(addNewSpot(spot));
        return spot;
      } else {
        console.error('Error creating spot:', response);
      }
    } catch (error) {
      console.error('Error creating spot:', error);
    }
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
    // if (imageUrl) {
    //     await csrfFetch(`/api/spots/${spotId}/images`, {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             url: imageUrl,
    //             preview: true
    //         })
    //     });
    // }

    dispatch(update(data));
    return response;
}

export const deleteSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });
    dispatch(removeSpot(spotId));
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
        case REMOVE_SPOT: {
            const newState = { ...state };
            delete newState.allSpots[action.spotId];
            return newState;
        }
        default:
            return state;
    }
}

export default spotsReducer;