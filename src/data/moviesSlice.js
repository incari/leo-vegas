import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchMovies = createAsyncThunk(
    'fetch-movies',
    async ({ url, append }, { getState }) => {
        const response = await fetch(url);
        const data = await response.json();
        return { movies: data.results, append };
    }
);
const moviesSlice = createSlice({
    name: 'movies',
    initialState: {
        movies: [],
        fetchStatus: '',
        searchQuery: '',
        page: 1,
    },
    reducers: {
        clearMovies(state) {
            state.movies = []
            state.page = 1
        },
        incrementPage(state) {
            state.page += 1;
        },
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            console.log("state", state.status)
            state.status = 'succeeded';

            if (action.payload.append) {

                state.movies = [...state.movies, ...action.payload.movies];
            } else {
                console.log(action.payload.movies)
                state.movies = action.payload.movies;
            }
        })
            .addCase(fetchMovies.pending, (state) => {
                state.fetchStatus = 'loading'
            }).addCase(fetchMovies.rejected, (state) => {
                state.fetchStatus = 'error'
            })

    }
})
export const { clearMovies, incrementPage, setSearchQuery } = moviesSlice.actions;

export default moviesSlice
