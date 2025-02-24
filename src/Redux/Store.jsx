import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/userSlice"
import themeReducer from './Slice/themeSlice'
import servicesReducer from "./Slice/servicesSlice";
import cartReducer from "./Slice/cartSlice";
import orderReducer from "./Slice/orderSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
    user:userReducer,
    theme:themeReducer,
    services: servicesReducer,
    cart: cartReducer,
    order:orderReducer
})

// Configuration for redux-persist
const persistConfig = {
    key:"root",
    storage,
    version:1

}

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig,rootReducer)

// Configure the Redux store
export const store = configureStore({
    reducer: persistedReducer,
    middleware:(getDefaultMiddleware)=>{
       return getDefaultMiddleware({serializableCheck:false})
    }
});

// Create a persistor for the store
export const persistor = persistStore(store);