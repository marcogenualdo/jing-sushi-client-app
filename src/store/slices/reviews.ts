import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { Review } from "../../types";

const reviewsInitialState: Review[] | null = null;

export const reviewsSlice = createSlice<
  Review[] | null,
  SliceCaseReducers<Review[] | null>,
  "reviews"
>({
  name: "reviews",
  initialState: reviewsInitialState,
  reducers: {
    setReviews: (state, action: PayloadAction<Review[] | null>) =>
      action.payload,
  },
});
