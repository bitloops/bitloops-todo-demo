// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const a = 'hehehehehe';
export { a };

// import { RootState } from '../';
// import { UserData } from '../../infra/auth';
// // import actions from '../actions';

// export interface IAuthState {
//   userData?: UserData;
//   isAuthenticated: 'pending' | boolean;
// }

// const initialState: IAuthState = {
//   userData: undefined,
//   isAuthenticated: 'pending',
// };

// export const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     authChanged(state: IAuthState, action: PayloadAction<UserData | undefined>) {
//       const userData = action.payload || undefined;
//       if (userData) {
//         console.log('userData in authChanged', userData);
//         state.userData = userData;
//         state.isAuthenticated = true;
//       } else {
//         state.userData = undefined;
//         state.isAuthenticated = false;
//       }
//     },
//     clearedAuth(state: IAuthState) {
//       state.userData = undefined;
//       state.isAuthenticated = false;
//     },
//   },
//   extraReducers: {},
// });

// export const { authChanged, clearedAuth } = authSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectUserData = (state: RootState): UserData | undefined => {
//   const { userData } = state.auth;
//   return userData;
// };

// export const selectIsAuthenticated = (state: RootState): boolean | 'pending' => {
//   const { isAuthenticated } = state.auth;
//   return isAuthenticated;
// };

// export default authSlice.reducer;
