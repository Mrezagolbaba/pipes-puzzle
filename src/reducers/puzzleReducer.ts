import {Reducer} from '../store';
import {
    SET_LEVEL_REQUEST,
    SET_LEVEL_SUCCESS,
    SET_LEVEL_WAIT,
} from '../actions/action-type';

type initialState = {
    title: string;
    level: Level;
    levelSwitching: boolean;
};

const initialState: initialState = {
    title: 'Pipes puzzle',
    level: 1,
    levelSwitching: false,
};

export const puzzleReducer: Reducer<initialState> = (state = initialState, action) => {
    switch (action.type) {
        case SET_LEVEL_REQUEST:
            return state;
        case SET_LEVEL_WAIT:
            return {...state, levelSwitching: true};
        case SET_LEVEL_SUCCESS:
            return {...state, levelSwitching: false, level: action.payload};
        default:
            return state;
    }
};