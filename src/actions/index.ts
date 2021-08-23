import {
    SET_TITLE,
    SET_LEVEL_REQUEST,
    SET_LEVEL_WAIT, SET_LEVEL_SUCCESS,
} from './action-type';
import {Thunk} from '../store';

export const setTitle = (title: string) => ({type: SET_TITLE, payload: title});

export const setLevelRequest = () => ({type: SET_LEVEL_REQUEST});
export const setLevelWait = () => ({type: SET_LEVEL_WAIT});
export const setLevelSuccess = (level: Level) => ({type: SET_LEVEL_SUCCESS, payload: level});

export const setLevel = (level: Level, makeApiRequest= true): Thunk<void> =>
    async (dispatch, _,{puzzleApi}) => {
    if (!makeApiRequest) {
        dispatch(setLevelSuccess(level));

        return;
    }

    dispatch(setLevelRequest());
    dispatch(setLevelWait());

    await puzzleApi.setLevel(level);

    dispatch(setLevelSuccess(level));
};


    export interface Actions {
        SetSTitle: ReturnType<typeof setTitle>;
        SetLevelRequest: ReturnType<typeof setLevelRequest>;
        SetLevelWait: ReturnType<typeof setLevelWait>;
        SetLevelSuccess: ReturnType<typeof setLevelSuccess>;
    }

