import axios from "axios";
import { useSelector } from "react-redux";
import {store} from './src/Store/index';
axios.interceptors.request.use(
  async (config) => {
    const state = store.getState();
     const id = state.authenticationReducer.user.id
    console.log(state)
    // store.subscribe(listener)
    // function select(state) {
    //   return state.authenticationReducer.user
    // }

    // function listener() {
    //   let user = select(store.getState())
    //   console.log({ user })
    //   // axios.defaults.headers.common['Authorization'] = token;
    // }
    // const user = await useSelector(state => state.authenticationReducer.user)

    // const token = await AsyncStorage.getItem("DOCTOR_TOKEN");
    // if (token !== null) {
    // console.log(token, "token in interceptor");
    // config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log(config, "config");
    return config;
  },
  (error) => Promise.reject(error)
);