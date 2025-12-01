import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // user: null,//yahi par galati ki hai let's resolve it
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null, 
    loading: false,
}


const profileSlice = createSlice({
    initialState,
    name: 'profile',
    reducers: {
        setUser(state, value){
            state.user = value.payload;
        },
        setLoading(state, value){
            state.loading = value.payload;
        }
    }
})

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;