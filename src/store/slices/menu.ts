import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuCategoryData } from "../../types";

const menuInitialState: MenuCategoryData[] = [];

export const menuSlice = createSlice({
  name: "menu",
  initialState: menuInitialState,
  reducers: {
    setMenu: (state, action: PayloadAction<MenuCategoryData[]>) =>
      action.payload,
  },
});
