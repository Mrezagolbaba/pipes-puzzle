import React, { useRef,useLayoutEffect, FC }from 'react';
import {AppContext, AppContextType} from './components/AppContext';
import { Provider } from "react-redux";
import PuzzlePage from './containers/puzzle'
import './App.scss';
import { Puzzle } from './api/puzzle';
import configureStore from './store';


function App() {
    const ctx = useRef<AppContextType>({
        puzzleApi: new Puzzle(),
    });

    useLayoutEffect(() => {
        // initialise api before all other effects
        ctx.current.puzzleApi.init().then(r => console.log(r));
        ctx.current.puzzleApi.setLevel(1).then(r => console.log(r));
    }, []);

    const store = configureStore(ctx.current);

    return(
        <AppContext.Provider value={ctx.current}>
            <Provider store={store}>
                <PuzzlePage/>
            </Provider>
      </AppContext.Provider>
    )
}

export default App;
