import React, { useState, useEffect, useRef } from 'react';
import Movie from './Movie';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { ENDPOINT_DISCOVER, ENDPOINT_SEARCH } from '../constants';

const MovieList = ({ initialMovies, viewTrailer, closeCard, searchQuery }) => {
    const [movies, setMovies] = useState(initialMovies?.movies?.results || []);
    const [page, setPage] = useState(1);
    const [currentQuery, setCurrentQuery] = useState(searchQuery);
    const prevQueryRef = useRef();

    useEffect(() => {
        prevQueryRef.current = currentQuery;
    });

    const prevQuery = prevQueryRef.current;

    const loadMoreMovies = async () => {

        try {
            let newMovies = [];
            if (!searchQuery) {
                const response = await fetch(`${ENDPOINT_DISCOVER}&page=${page}}`);
                const data = await response.json();
                newMovies = data.results;
            } else {
                const response = await fetch(`${ENDPOINT_SEARCH}&page=${page}&query=${searchQuery}`);
                const data = await response.json();
                newMovies = data.results;
            }

            if (currentQuery === searchQuery) {
                setMovies(prevMovies => [...prevMovies, ...newMovies]);
                setPage(prevPage => prevPage + 1);
            } else {
                setMovies(newMovies);
                setPage(2); // since the first page has already been fetched
                setCurrentQuery(searchQuery);
            }
        } catch (error) {
            console.error('Error fetching more movies:', error);
        }
    };

    useInfiniteScroll(() => {
        if (searchQuery === currentQuery) {
            loadMoreMovies();
        }
    });

    useEffect(() => {
        if (searchQuery !== prevQuery) {
            setMovies([]);
            setPage(1);
            setCurrentQuery(searchQuery);
        }
        loadMoreMovies();
    }, [searchQuery]);

    return (
        <div className="movie-grid">
            {movies.map((movie) => (
                <Movie key={movie.id} movie={movie} viewTrailer={viewTrailer} closeCard={closeCard} />
            ))}
        </div>
    );
};

export default MovieList;
