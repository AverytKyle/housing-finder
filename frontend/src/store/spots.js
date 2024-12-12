import { csrfFetch } from "./csrf";

const LOAD = 'spots/LOAD';
const LOAD_BY_ID = 'spots/LOAD_BY_ID';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';
const REMOVE_SPOT = 'spots/REMOVE_SPOT';
const ADD_SPOT_IMAGE = 'spots/ADD_SPOT_IMAGE';


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

const addImage = (image, spotId) => ({
    type: ADD_SPOT_IMAGE,
    payload: {image, spotId}
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

export const addSpotImage = (imageData, spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        body: JSON.stringify({
            url: imageData.url,
            preview: imageData.preview
        })
    });

    if (response.ok) {
        const image = await response.json();
        dispatch(addImage(image, spotId));
        return image;
    }
};

export const createSpot = (spotData) => async dispatch => {
    
    const formattedData = {
        address: spotData.address,
        city: spotData.city,
        state: spotData.state,
        country: spotData.country,
        lat: Number(spotData.lat),
        lng: Number(spotData.lng),
        name: spotData.name,
        description: spotData.description,
        price: Number(spotData.price)
    };

    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(formattedData)
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(addNewSpot(spot));

        // Handle multiple images
        if (spotData.imageUrls && spotData.imageUrls.length > 0) {
            await Promise.all(spotData.imageUrls.map((imageUrl, index) => {
                if (imageUrl) {
                    return dispatch(addSpotImage({
                        url: imageUrl,
                        preview: index === 0
                    }, spot.id));
                }
            }));
        }

        return spot;
    }
};

export const getCurrentUserSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/current');

    if (response.ok) {
        const spots = await response.json();
        dispatch(load(spots));
        return spots;
    }
};

export const updateSpot = (spotId, spot) => async dispatch => {
    // Get current spot data to access correct image IDs
    const currentSpotResponse = await csrfFetch(`/api/spots/${spotId}`);
    const currentSpot = await currentSpotResponse.json();

    // Update spot details
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        body: JSON.stringify({
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price
        })
    });

    const data = await response.json();

    // Delete existing images using correct IDs from currentSpot
    if (currentSpot.SpotImages && currentSpot.SpotImages.length > 0) {
        await Promise.all(currentSpot.SpotImages.map(image => 
            csrfFetch(`/api/spot-images/${image.id}`, {
                method: 'DELETE'
            })
        ));
    }

    // Add new images
    if (spot.imageUrls && spot.imageUrls.length > 0) {
        await Promise.all(spot.imageUrls.map((imageUrl, index) => {
            if (imageUrl) {
                return dispatch(addSpotImage({
                    url: imageUrl,
                    preview: index === 0
                }, spotId));
            }
        }));
    }

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
                // Ensure SpotImages array is properly set from backend data
                newState.allSpots[spot.id] = {
                    ...spot,
                    SpotImages: spot.SpotImages || []
                };
            });
            return newState;
        }
        
        case CREATE_SPOT: {
            const newState = { ...state };
            newState.allSpots[action.payload.id] = action.payload;
            newState.allSpots[action.payload.id].SpotImages = [];
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
        case ADD_SPOT_IMAGE: {
            const newState = { ...state };
            const { image, spotId } = action.payload;

            if (newState.allSpots[spotId]) {
                if (!newState.allSpots[spotId].SpotImages) {
                    newState.allSpots[spotId].SpotImages = [];
                }
                newState.allSpots[spotId].SpotImages.push(image);
            }
            return newState;
        }
        default:
            return state;
    }
}

export default spotsReducer;