import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { PERSIST, persistReducer, persistStore } from 'redux-persist';
import createTransform from 'redux-persist/es/createTransform';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import campaignReducer from './slices/campaignSlice';
import contactReducer from './slices/contactSlice';
import messageTemplateReducer from './slices/messageTemplateSlice';
import userReducer from './slices/userSlice';
import workspaceReducer from './slices/workspaceSlice';
import workspaceUserReducer from './slices/workspaceUserSlice';

const userTransform = createTransform<Record<string, any>, Partial<Record<string, any>>>(
  (inboundState) => ({ currentWorkspace: inboundState.currentWorkspace }),
  (outboundState) => ({ currentWorkspace: outboundState.currentWorkspace }),
  { whitelist: ['user'] },
);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'],
  transforms: [userTransform],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  workspaceUser: workspaceUserReducer,
  workspace: workspaceReducer,
  campaign: campaignReducer,
  contact: contactReducer,
  messageTemplate: messageTemplateReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

export default store;
