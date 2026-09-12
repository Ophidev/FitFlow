import {configureStore} from "@reduxjs/toolkit";
import userSliceReducer from "./userSlice";
import themeSliceReducer from "./themeSlice";

const appStore = configureStore({

    reducer: {
        user: userSliceReducer,
        theme: themeSliceReducer,
    }

});

export default appStore;