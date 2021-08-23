import {createStore, compose, applyMiddleware} from 'redux';
import thunk, {ThunkAction} from 'redux-thunk';
import {AppContextType} from '../components/AppContext';
import { Actions } from '../actions';
import rootReduces from "../reducers/index";



export type Action = ValueOf<Actions>;
export type Reducer<S = State, A = Action> = (state: S | undefined, action: A) => S;
export type State = ReturnType<typeof rootReduces>;
export type Thunk<R, S = State> = ThunkAction<R, S,AppContextType, Action>;

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/ban-types
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: Function;
    }
}


const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && process.env.NODE_ENV !== 'production'
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

const configureStore = (ctx: AppContextType) => {
    let store;
    // eslint-disable-next-line prefer-const
    store = createStore(
        rootReduces,
        composeEnhancers(applyMiddleware(thunk.withExtraArgument(ctx)))
    );
    return store;
};
export default configureStore;