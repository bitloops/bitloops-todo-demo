import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/';

// Use throughout your app instead of plain `useDispatch`
// TODO replace any with appropriate type/interface
const useAppDispatch = (): any => useDispatch<AppDispatch>();

export default useAppDispatch;
