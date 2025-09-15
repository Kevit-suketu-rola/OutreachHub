import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import workspaceReducer from "./slices/workspaceSlice";
import workspaceUserReducer from "./slices/workspaceUserSlice";
import userReducer from "./slices/userSlice";
import campaignReducer from "./slices/campaignSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer, PERSIST } from "redux-persist";
import contactReducer from "./slices/contactSlice";
import messageTemplateReducer from "./slices/messageTemplateSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user"],
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
