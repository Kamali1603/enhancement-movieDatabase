import {Component} from 'react'
import Navbar from '../Navbar'

import './index.css'

class SinglePage extends Component {
  state = {
    movieDetails: null,
    castDetails: [],
  }

  componentDidMount() {
    this.fetchMovieDetails()
    this.fetchCastDetails()
  }

  getUpdatedCastData = data =>
    data.cast.map(castMember => ({
      id: castMember.id,
      image: castMember.profile_path,
      name: castMember.name,
      character: castMember.character,
    }))

  getUpdatedData = data => ({
    title: data.original_title,
    image: data.belongs_to_collection.poster_path,
    ratings: data.vote_average,
    duration: data.runtime,
    genres: data.genres,
    releaseDate: data.release_date,
    overview: data.overview,
  })

  fetchMovieDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const API_KEY = '19fcff1f02ab4f9cf26622b2a492f918'
    const apiUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
    try {
      const response = await fetch(apiUrl)
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        const newData = this.getUpdatedData(data)
        this.setState({
          movieDetails: newData,
        })
      } else {
        console.log('Failed to fetch movie details')
      }
    } catch (error) {
      console.log('Error fetching movie details:', error)
    }
  }

  fetchCastDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const API_KEY = '19fcff1f02ab4f9cf26622b2a492f918'
    const apiUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
    try {
      const response = await fetch(apiUrl)
      const data = await response.json()
      this.setState({
        castDetails: this.getUpdatedCastData(data),
      })
    } catch (error) {
      console.log('Error fetching cast details:', error)
    }
  }

  render() {
    const {movieDetails, castDetails} = this.state
    if (!movieDetails) {
      return <p>Loading...</p>
    }

    const {title, image, ratings, duration, genres, releaseDate, overview} =
      movieDetails

    return (
      <>
        <Navbar />
        <div className="details">
          <div className="img-container">
            <h1>{title}</h1>
            <img
              src={`https://image.tmdb.org/t/p/w300${image}`}
              alt={title}
              className="movie-poster"
            />
          </div>
          <div className="details-container">
            <p>
              <b>Rating:</b> {ratings}
            </p>
            <p>
              <b>Duration:</b> {duration} mins
            </p>
            <p>
              <b>Genre:</b> {genres.map(genre => genre.name).join(', ')}
            </p>
            <p>
              <b>Release Date:</b> {releaseDate}
            </p>
            <p>
              <b>Overview:</b> {overview}
            </p>
          </div>
        </div>
        <div className="cast-details">
          <h2>Cast</h2>
          <ul className="cast-grid">
            {castDetails.map(cast => (
              <li key={cast.id} className="cast-card">
                <img
                  src={
                    cast.image
                      ? `https://image.tmdb.org/t/p/w200${cast.image}`
                      : 'https://via.placeholder.com/300x450?text=No+Image'
                  }
                  alt={cast.name}
                  className="cast-image"
                />
                <p><b>{cast.name}</b></p>
                <p><i>{cast.character}</i></p>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }
}

export default SinglePage
