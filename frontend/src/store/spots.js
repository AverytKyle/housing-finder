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
    console.log('Creating image with:', { imageData, spotId });
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        body: JSON.stringify({
            url: imageData.url,
            preview: imageData.preview
        })
    });

    if (response.ok) {
        const image = await response.json();
        console.log('Received image from backend:', image);
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
        if (spotData.imageUrls) {
            console.log('imageUrls:', spotData.imageUrls);
            for (let i = 0; i < spotData.imageUrls.length; i++) {
                const imageUrl = spotData.imageUrls[i];
                if (imageUrl) {
                    await dispatch(addSpotImage({
                        url: imageUrl,
                        preview: i === 0
                    }, spot.id));
                }
            }
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
            console.log('Current spot before update:', newState.allSpots[spotId]);


            if (newState.allSpots[spotId]) {
                if (!newState.allSpots[spotId].SpotImages) {
                    newState.allSpots[spotId].SpotImages = [];
                }
                newState.allSpots[spotId].SpotImages.push(image);
                console.log('SpotImages after update:', newState.allSpots[spotId].SpotImages);

            }
            return newState;
        }
        default:
            return state;
    }
}

export default spotsReducer;