import { createStore } from "redux";
import rootReducer from "./Reducers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
const persitConfig = {
    key: 'root',
    storage: AsyncStorage
}
const persistedReducer= persistReducer(persitConfig,rootReducer)
// export const store = createStore(rootReducer)
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);