// import { csrfFetch } from "./csrf";

// export const CREATE_IMAGE = 'images/CREATE_IMAGE';

// const addImage = (image) => ({
//     type: CREATE_IMAGE,
//     payload: image
// });

// export const createImage = (image, spotId) => async dispatch => {
//     const response = await csrfFetch(`/api/spots/${spotId}/images`, {
//         method: 'POST',
//         body: JSON.stringify({
//             url: image.url,
//             preview: image.preview
//         })
//     });

//     if (response.ok) {
//         const newImage = await response.json();
//         dispatch(addImage({
//             ...newImage,
//             spotId
//         }));
//         return newImage;
//     }
// }

// const initialState = {
//     images: {}
// };

// const imageReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case CREATE_IMAGE: {
//             const newState = { ...state };
//             // Update SpotImages array
//             newState.SpotImages = [...(newState.SpotImages || []), action.payload];
//             // Update images object with ID as key
//             newState.images[action.payload.id] = action.payload;
//             return newState;
//         }
//         default:
//             return state;
//     }
// }

// export default imageReducer;