import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import '../styles/MovieList.scss';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);

    const loadMoreMovies = () => {
        // Fetch more movies and append to the existing list
        fetch(`/api/movies?page=${page}`)
            .then(res => res.json())
            .then(newMovies => {
                setMovies(prevMovies => [...prevMovies, ...newMovies]);
                setPage(prevPage => prevPage + 1);
            });
    };

    useInfiniteScroll(loadMoreMovies);

    useEffect(() => {
        loadMoreMovies();
    }, []);

    return (
        <div className="movie-grid">
            {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
};

export default MovieList;