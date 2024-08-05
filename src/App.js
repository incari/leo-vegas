import { useEffect, useRef, useState } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import 'reactjs-popup/dist/index.css'
import { clearMovies, fetchMovies, incrementPage, setSearchQuery } from './data/moviesSlice'
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from './constants'
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import YouTubePlayer from './components/YoutubePlayer'
import './app.scss'
import MovieList from './components/MovieList'
import useInfiniteScroll from './hooks/useInfiniteScroll'

const App = () => {


  const { movies, page, searchQuery: currentQuery } = useSelector((state) => state.movies)
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [videoKey, setVideoKey] = useState()
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate()

  const closeModal = () => setOpen(false)

  const closeCard = () => {

  }

  const getSearchResults = (query) => {
    if (query !== '') {
      dispatch(fetchMovies({ url: `${ENDPOINT_SEARCH}&query=` + query }))
      setSearchParams(createSearchParams({ search: query }))
    } else {
      dispatch(fetchMovies({ url: ENDPOINT_DISCOVER }))
      setSearchParams()
    }
  }

  const searchMovies = (query) => {
    navigate('/')
    getSearchResults(query)
  }

  const getMovies = () => {
    if (searchQuery) {
      dispatch(fetchMovies({ url: `${ENDPOINT_SEARCH}&query=` + searchQuery + '&page=' + page, append: false }))
    } else {
      dispatch(fetchMovies({ url: ENDPOINT_DISCOVER + '&page=' + page, append: false }))
    }
  }

  const viewTrailer = (movie) => {
    getMovie(movie.id)
    if (!videoKey) setOpen(true)
    setOpen(true)
  }

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`

    setVideoKey(null)
    const videoData = await fetch(URL)
      .then((response) => response.json())

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(vid => vid.type === 'Trailer')
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key)
    }
  }


  useEffect(() => {
    getMovies();
  }, []);

  const prevQueryRef = useRef();

  useEffect(() => {
    prevQueryRef.current = currentQuery;
  });

  const prevQuery = prevQueryRef.current;

  const loadMoreMovies = () => {
    try {
      let url = '';
      if (!searchQuery) {
        url = `${ENDPOINT_DISCOVER}&page=${page}`;
      } else {
        url = `${ENDPOINT_SEARCH}&page=${page}&query=${searchQuery}`;
      }

      dispatch(fetchMovies({ url, append: true }));
      dispatch(incrementPage());
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
      dispatch(clearMovies());
      dispatch(setSearchQuery(searchQuery));
      dispatch(incrementPage());
    }
    loadMoreMovies();
  }, [searchQuery]);

  return (
    <div className="App">
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />
      {videoKey && isOpen ? (
        <div className='modal'>
          <div className='modal-content'>
            <button className='close' onClick={closeModal}>X</button>

            <YouTubePlayer
              videoKey={videoKey}
            />
          </div>
        </div>
      ) : (
        <div style={{ padding: "30px" }}><h6>no trailer available. Try another movie</h6></div>
      )}
      <div className="container">
        <Routes>
          <Route path="/" element={
            <MovieList movies={movies} viewTrailer={viewTrailer} closeCard={closeCard} />
          } />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
