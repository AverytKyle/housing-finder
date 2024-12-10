import { csrfFetch } from "./csrf";

const CREATE_IMAGE = 'images/CREATE_IMAGE';

const addImage = image => ({
    type: CREATE_IMAGE,
    image
});

export const createImage = (image, spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        body: JSON.stringify({ image })
    });

    if (response.ok) {
        const image = await response.json();
        dispatch(addImage(image));
        return image;
    }
}

const initialState = {
    images: {}
};

const imageReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_IMAGE: {
            const newState = { ...state };
            const imageArray = action.image.SpotImages;
            imageArray.forEach(image => {
                newState.images[action.image.id] = action.image;
            })
            return newState;
        }
        default:
            return state;
    }
}

export default imageReducer;