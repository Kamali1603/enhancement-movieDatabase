import Loader from 'react-loader-spinner'

import MovieCard from '../MovieCard'
import Navbar from '../Navbar'
import Pagination from '../Pagination'

import SearchContext from '../../context/SearchContext'

import './index.css'

const SearchQuery = () => {
  const renderEmptyView = () => (
    <div className="empty-view-container">
      <h1>No results found.</h1>
      <p>Don not get worried, Try to search again.</p>
    </div>
  )

  const renderMoviesList = searchResponse => {
    const {results} = searchResponse

    if (!results.length) {
      return renderEmptyView()
    }
    return (
      <ul className="list-movies">
        {results.map(movie => (
          <MovieCard key={movie.id} movieDetails={movie} />
        ))}
      </ul>
    )
  }

  const renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#032541" />
    </div>
  )

  const renderSearchResultViews = value => {
    const {searchResponse, apiStatus} = value

    switch (apiStatus) {
      case 'IN_PROGRESS':
        return renderLoadingView()
      case 'SUCCESS':
        return renderMoviesList(searchResponse)
      default:
        return renderEmptyView()
    }
  }

  return (
    <SearchContext.Consumer>
      {value => {
        const {searchResponse, onTriggerSearchingQuery} = value

        return (
          <>
            <Navbar />
            <div className="route-page-body">
              {renderSearchResultViews(value)}
            </div>
            <Pagination
              totalPages={searchResponse.totalPages}
              apiCallback={onTriggerSearchingQuery}
            />
          </>
        )
      }}
    </SearchContext.Consumer>
  )
}

export default SearchQuery
