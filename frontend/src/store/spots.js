import { csrfFetch } from "./csrf";


const LOAD = 'spots/LOAD';



const load = spots => ({
    type: LOAD,
    spots
});

export const getSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots`);

    if (response.ok) {
        const spots = await response.json();
        dispatch(load(spots));
    }
};

const initialState = {
    allSpots: {},
}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD: {
            const newState = {...state};
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