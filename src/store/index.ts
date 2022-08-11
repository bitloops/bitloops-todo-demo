import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { IToDosService } from '../services/todos';
import todosReducer from './slices/todos';
import MockToDosService from '../services/todos/mock';

// console.log('Loading Redux store...', process.env.REACT_APP_ENVIRONMENT);

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // notifications: notificationsSlice,
    todos: todosReducer,
    // business: businessReducer,
    // rides: ridesReducer,
    // scheduledRides: scheduledRidesReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          // repositories: {
          //   business: process.env.REACT_APP_ENVIRONMENT === 'mock' ? new MockBusinessRepository() : new FirebaseRealtimeBusinessRepository(),
          //   rides: process.env.REACT_APP_ENVIRONMENT === 'mock' ? new MockRidesRepository() : new FirebaseRealtimeRidesRepository(),
          //   scheduledRides: process.env.REACT_APP_ENVIRONMENT === 'mock' ? new MockScheduledRidesRepository() : new FirebaseRealtimeScheduledRidesRepository(),
          // },
          services: {
            todos: new MockToDosService(),
            // rides: process.env.REACT_APP_ENVIRONMENT === 'mock' ? new MockRidesService() : new FirebaseRidesService(),
            // vehicles: process.env.REACT_APP_ENVIRONMENT === 'mock' ? new MockVehiclesService() : new FirebaseVehiclesService(),
            // geofences: process.env.REACT_APP_ENVIRONMENT === 'mock' ? new MockGeofencesService() : new FirebaseGeofencesService(),
          },
        },
      },
      serializableCheck: false,
    }), // .concat(logger),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export type MyKnownError = {
  errorMessage: string;
};

export type AsyncThunkConfig = {
  /** return type for `thunkApi.getState` */
  state: RootState;
  /** type for `thunkApi.dispatch` */
  dispatch: AppDispatch;
  /** type of the `extra` argument for the thunk middleware,
   *  which will be passed in as `thunkApi.extra` */
  extra: {
    services: {
      todos: IToDosService;
    };
  };
  /** type to be passed into `rejectWithValue`'s first argument
   *  that will end up on `rejectedAction.payload` */
  rejectValue: MyKnownError;
  /** return type of the `serializeError` option callback */
  serializedErrorType?: unknown;
  /** type to be returned from the `getPendingMeta` option callback
   *  & merged into `pendingAction.meta` */
  pendingMeta?: unknown;
  /** type to be passed into the second argument of `fulfillWithValue`
   * to finally be merged into `fulfilledAction.meta` */
  fulfilledMeta?: unknown;
  /** type to be passed into the second argument of `rejectWithValue`
   *  to finally be merged into `rejectedAction.meta` */
  rejectedMeta?: unknown;
};
