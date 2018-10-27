import axios from "axios";
import jwt_decode from "jwt-decode";
import store from "../store/configureStore";
import { refreshToken } from "../actions/auth";

axios.defaults.baseURL = "http://localhost:5000/api/";

axios.interceptors.request.use(
  config => {
    if (
      config.headers.common.Authorization &&
      config.url !== "users/refreshToken"
    ) {
      const token = config.headers.common.Authorization.split(" ")[1];
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        return store.dispatch(refreshToken({ token })).then(() => {
          return Promise.resolve(config);
        });
      } else {
        return Promise.resolve(config);
      }
    } else {
      return Promise.resolve(config);
    }
  },
  error => {
    return Promise.reject(error);
  }
);
