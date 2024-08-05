import React from 'react';
import Movie from './Movie';


const MovieList = ({ movies, viewTrailer, closeCard }) => {

    return (
        <div className="movie-grid">
            {movies.map((movie) => (
                <Movie key={movie.id} movie={movie} viewTrailer={viewTrailer} closeCard={closeCard} />
            ))}
        </div>
    );
};

export default MovieList;
