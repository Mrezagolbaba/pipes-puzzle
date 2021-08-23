import { combineReducers } from "redux";
import {puzzleReducer} from "./puzzleReducer";

const rootReduces = combineReducers({
    puzzlePage:puzzleReducer,

});
export default rootReduces;