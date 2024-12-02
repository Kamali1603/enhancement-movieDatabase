import {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import Popular from './components/Popular'
import TopRated from './components/TopRated'
import Upcoming from './components/Upcoming'
import SearchQuery from './components/SearchQuery'
import SinglePage from './components/SinglePage'

import SearchContext from './context/SearchContext'

import './App.css'

const API_KEY = '19fcff1f02ab4f9cf26622b2a492f918'

class App extends Component {
  state = {
    searchResponse: {},
    apiStatus: 'INITIAL',
    searchInput: '',
  }

  onChangeSearchInput = text => {
    this.setState({searchInput: text})
  }

  getUpdatedData = responseData => ({
    totalPages: responseData.total_pages,
    totalResults: responseData.total_results,
    results: responseData.results.map(eachMovie => ({
      id: eachMovie.id,
      posterPath: `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`,
      voteAverage: eachMovie.vote_average,
      title: eachMovie.title,
    })),
  })

  onTriggerSearchingQuery = async (page = 1) => {
    this.setState({apiStatus: 'IN_PROGRESS'})
    const {searchInput} = this.state
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchInput}&page=${page}`
    try {
      const response = await fetch(apiUrl)
      const data = await response.json()
      this.setState({
        searchResponse: this.getUpdatedData(data),
        apiStatus: 'SUCCESS',
      })
    } catch (error) {
      console.log('Error fetching search results:', error)
      this.setState({apiStatus: 'FAILURE'})
    }
  }

  render() {
    const {searchResponse, apiStatus, searchInput} = this.state
    return (
      <SearchContext.Provider
        value={{
          searchResponse,
          apiStatus,
          onTriggerSearchingQuery: this.onTriggerSearchingQuery,
          searchInput,
          onChangeSearchInput: this.onChangeSearchInput,
        }}
      >
        <div>
          <Switch>
            <Route exact path="/" component={Popular} />
            <Route exact path="/top-rated" component={TopRated} />
            <Route exact path="/upcoming" component={Upcoming} />
            <Route exact path="/search" component={SearchQuery} />
            <Route exact path="/movie/:id" component={SinglePage} />
          </Switch>
        </div>
      </SearchContext.Provider>
    )
  }
}

export default App
