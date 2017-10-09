import { combineReducers } from "redux";
import menu from "./menu";
import search from "./search";

const rootReducer = combineReducers({
    menu,
    search
  });

export default rootReducer;