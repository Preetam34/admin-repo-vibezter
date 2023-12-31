import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { axiosMiddleware } from "../../axiosSettings";
import HomePageBannerSlice from "../Slices/HomePageBanner/HomePageBannerSlice";
import CategorySlice from "Redux/Slices/Category/CategorySlice";
import ProductsByCaregoryIdSlice from "Redux/Slices/Products/ProductsSlice";
import authReducer from "Redux/Slices/Login/auth.slice";
import TagsSlice from "Redux/Slices/Tags/TagsSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  HomePageBanner: HomePageBannerSlice,
  CategoryList: CategorySlice,
  ProductsByCatId: ProductsByCaregoryIdSlice,
  tagList: TagsSlice,
});

const initializeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        axiosMiddleware
      ),
    devTools: true,
  });

export default initializeStore;
