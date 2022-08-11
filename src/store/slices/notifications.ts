import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

import { RootState } from '..';

// const defaultMessageIndex = {
//   success: 'Congratulations, task completed',
//   warning: 'Warning, something might go wrong!',
//   error: 'Oops, an error occurred',
// };

export type NotificationDataType = {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
};

export type NotificationAssignDataType = {
  type: 'success' | 'warning' | 'error';
  message: string;
};

export interface INotificationsState {
  notificationData: NotificationDataType[];
}

const initialState = {
  notificationData: [],
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state: INotificationsState, action: PayloadAction<NotificationAssignDataType>) {
      const id = uuid();
      const { payload } = action;
      const { message, type } = payload;
      // let { message } = payload;
      // if (!message) message = defaultMessageIndex[type];
      const newNotification: NotificationDataType = {
        id,
        type,
        message,
      };
      state.notificationData = [...state.notificationData, newNotification];
    },
    // popNotification(state: INotificationsState) {
    //   state.notificationData.pop();
    // },
    removeNotification(state: INotificationsState, action: PayloadAction<string>) {
      const deletionId = action.payload;
      console.log('delete');
      const deletionIndex = state.notificationData.findIndex((obj) => {
        return obj.id === deletionId;
      });
      if (deletionIndex === -1) return;
      console.log('deleting', deletionIndex, deletionId);
      const notificationDataCopy: NotificationDataType[] = JSON.parse(JSON.stringify(state.notificationData));
      // console.log('hehehehehe', notificationDataCopy.splice(deletionIndex, 1), notificationDataCopy);
      // state.notificationData = notificationDataCopy.splice(deletionIndex, 1);
      notificationDataCopy.splice(deletionIndex, 1);
      console.log('hehehe', notificationDataCopy);
      state.notificationData = notificationDataCopy;
      // return { ...state, notificationData: state.notificationData };
    },
  },
  extraReducers: {},
});

// export const selectNotifications = (state: RootState): NotificationDataType[] | [] => {
//   const { notificationData } = state.notifications;
//   return notificationData;
// };

export const { addNotification, removeNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;
