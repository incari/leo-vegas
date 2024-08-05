import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import '../styles/MovieList.scss';
import { ENDPOINT_DISCOVER } from '../constants';
import Movie from './Movie';

const MovieList = ({ initialMovies, viewTrailer, closeCard, load }) => {

    const [movies, setMovies] = useState(initialMovies?.movies?.results);
    const [page, setPage] = useState(1);

    const loadMoreMovies = async () => {
        try {
            const response = await fetch(`${ENDPOINT_DISCOVER}&page=${page}`);
            const data = await response.json();
            const newMovies = data.results;

            setMovies(prevMovies => [...prevMovies, ...newMovies]);
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error('Error fetching more movies:', error);
        }
    };

    useInfiniteScroll(loadMoreMovies);

    useEffect(() => {
        loadMoreMovies();
    }, []);

    return (
        <div className="movie-grid">
            {movies?.map((movie) => (
                <Movie key={movie.id} movie={movie} viewTrailer={viewTrailer} closeCard={closeCard} />
            ))}
        </div>
    );
};

export default MovieList;
