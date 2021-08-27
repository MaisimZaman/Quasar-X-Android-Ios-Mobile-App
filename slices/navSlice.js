import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allUsers: [],
    

}

export const navSlice = createSlice({
    name: "nav",
    initialState,
    reducers: {
        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
        },
       
        
    },

});

export const {setAllUsers } = navSlice.actions;

export const selectAllUsers = (state) => state.nav.allUsers

const navReducer = navSlice.reducer

export default navReducer;