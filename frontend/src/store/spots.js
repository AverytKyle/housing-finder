import { csrfFetch } from "./csrf";


const LOAD = 'spots/LOAD';
const LOAD_BY_ID = 'spots/LOAD_BY_ID';


const load = spots => ({
    type: LOAD,
    spots
});

const loadById = spot => ({
    type: LOAD_BY_ID,
    spot
})

export const getSpots = () => async dispatch => {
    const response = await fetch(`/api/spots`);

    if (response.ok) {
        const spots = await response.json();
        dispatch(load(spots));
    }
};

export const getSpotById = (id) => async dispatch => {
    console.log('Original ID:', id);
    const spotId = parseInt(id, 10);
    console.log('ID after parseInt:', spotId);
    
    if (isNaN(spotId)) return;
    
    const response = await fetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadById(spot));
        return spot;
    }
}

const initialState = {
    allSpots: {},
    singleSpot: {}
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
            newState.singleSpot = {...action.spot};
            return newState;
        }
        default:
            return state;
    }
}

export default spotsReducer;