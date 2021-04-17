import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuCategoryData } from "../../types";
import store from "../store";

const menuInitialState: MenuCategoryData[] = [];

export const menuSlice = createSlice({
  name: "menu",
  initialState: menuInitialState,
  reducers: {
    setMenu: (state, action: PayloadAction<MenuCategoryData[]>) =>
      action.payload,
  },
});

export const updateMenu = (menuData: MenuCategoryData[]) =>
  store.dispatch(menuSlice.actions.setMenu(menuData));
