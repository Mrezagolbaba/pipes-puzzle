import { useSelector } from 'react-redux'

type RootState = {
    puzzlePage: {
        title: string;
        level: Level;
        levelSwitching: boolean;
    }
}

// const State: RootState = {
//     auth: {
//         title: string
//         level: Level;
//         levelSwitching: boolean;
//     }
// }

export function useSelectorTyped<T>(fn: (state: RootState) => T): T {
    return useSelector(fn)
}