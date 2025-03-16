import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { AppRootState, AppDispatch } from '../redux/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;
