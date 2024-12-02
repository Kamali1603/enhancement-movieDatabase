import {createContext} from 'react'

const SearchContext = createContext({
  searchResponse: {},
  onTriggerSearchingQuery: () => {},
})

export default SearchContext
