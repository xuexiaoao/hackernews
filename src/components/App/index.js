import React, { Component } from 'react';
import fontawesome from '@fortawesome/fontawesome'
import brands from '@fortawesome/fontawesome-free-brands'
import { faCoffee, faCog, faSpinner, faQuoteLeft, faSquare, faCheckSquare } from '@fortawesome/fontawesome-free-solid'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Search from '../Search'
import Table from '../Table'
import Button from '../Button'
import './index.css';
import {withLoading,updateSearchTopStoriesState,dismissState} from '../hoc'
import {DEFAULT_QUERY,DEFAULT_HPP,PATH_BASE,PATH_SEARCH,PARAM_SEARCH,PARAM_PAGE,PARAM_HPP} from '../../constants';

fontawesome.library.add(brands, faCoffee, faCog, faSpinner, faQuoteLeft, faSquare, faCheckSquare)
const ButtonWithLoading = withLoading(Button);


class App extends Component {

constructor(props){
  super(props);
  this.state = {
    results:null,
    searchKey:'',
    searchTerm: DEFAULT_QUERY,
    error:null,
    isLoading: false
  }
  this.onDismiss=this.onDismiss.bind(this);
  this.onSearchChange = this.onSearchChange.bind(this);
  this.setSearchTopStories = this.setSearchTopStories.bind(this);
  this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  this.onSearchSubmit = this.onSearchSubmit.bind(this);
  this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
}

onDismiss(id){
  this.setState(dismissState(id));
}

onSearchChange(event) {
  this.setState({
    searchTerm : event.target.value
  });
  }

setSearchTopStories(result){
  const {hits,page} = result;
  this.setState(updateSearchTopStoriesState(hits, page));
}

fetchSearchTopStories(searchTerm,page=0){
  this.setState({ isLoading: true });
  fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response=>response.json())
    .then(result=>this.setSearchTopStories(result))
    .catch(e=>this.setState({error:e}));
}

onSearchSubmit(event){
  const {searchTerm} = this.state;
  this.setState({ searchKey: searchTerm });
  if(this.needsToSearchTopStories(searchTerm)){
    this.fetchSearchTopStories(searchTerm);
  }
  event.preventDefault();
}

needsToSearchTopStories(searchTerm){
  return !this.state.results[searchTerm];
}


componentDidMount(){
  const {searchTerm} = this.state;
  this.setState({searchKey:searchTerm});
  this.fetchSearchTopStories(searchTerm);
}

  render() {
    const {searchTerm,results,searchKey,error,isLoading} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
          >
          Search
          </Search>
        </div>
        {error?
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>:
          <Table
          list={list}
          onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={()=>this.fetchSearchTopStories(searchKey,page+1)} >
          More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;
