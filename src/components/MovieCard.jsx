import React, { useState } from 'react';
import Modal from './Modal';

const MovieCard = ({ movie }) => {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <div className="movie-card">
            <h3>{movie.title}</h3>
            <button onClick={handleShowModal}>View Trailer</button>
            <Modal show={showModal} handleClose={handleCloseModal}>
                <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${movie.trailerId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                ></iframe>
            </Modal>
        </div>
    );
};

export default MovieCard;
