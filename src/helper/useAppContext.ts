import {useContext} from 'react';
import {AppContext, AppContextType} from '../components/AppContext';

export const useAppContext = () => useContext<AppContextType>(AppContext);
