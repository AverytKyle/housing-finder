import { csrfFetch } from "./csrf";

// Contains all the actions specific to the session user's information and the session user's Redux reducer.

const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';

export const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

export const removeUser = () => ({
    type: REMOVE_USER
})

export const login = (user) => async dispatch => {
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({ credential, password })
    });

    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export const signup = (user) => async dispatch => {
    const { username, firstName, lastName, email, password } = user;
    
    const response = await csrfFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ username, firstName, lastName, email, password })
    });

    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export const logout = () => async dispatch => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE'
    });
    const data = await response.json();
    dispatch(removeUser());
    return response;
}

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload }
        case REMOVE_USER:
            return { ...state, user: null }
        default:
            return state;
    }
}

export default sessionReducer;