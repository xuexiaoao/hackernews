import React, { Component }  from 'react';
import { sortBy } from 'lodash'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button  from '../Button'
import './index.css';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const Sort = ({ sortKey, activeSortKey,onSort,isSortReverse, children }) =>{
  const sortClass = classNames(
   'button-inline',
   { 'button-active': sortKey === activeSortKey }
 );
 let icon;
 if(sortKey === activeSortKey){
   if(isSortReverse){
     icon = <FontAwesomeIcon icon="arrow-up" />
   }else{
     icon = <FontAwesomeIcon icon="arrow-down" />
   }
 }
  return(
  <Button onClick={() => onSort(sortKey)}
  className={sortClass}
  >
    {children}
    {icon}
  </Button>)
}

const largeColumn = {
  width: '40%',
};

const midColumn = {
  width: '30%',
};

const smallColumn = {
  width: '10%',
};

export default class Table extends Component {

  constructor(props) {
      super(props);
      this.state = {
        sortKey: 'NONE',
        isSortReverse: false
      };
      this.onSort = this.onSort.bind(this);
    }

    onSort(sortKey) {
      const isSortReverse  = this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({ sortKey,isSortReverse });
      }

  render() {
     const {list,onDismiss} = this.props;
     const {sortKey,isSortReverse} = this.state;
     const sortedList = SORTS[sortKey](list);
     const reverseSortedList = isSortReverse? sortedList.reverse(): sortedList;
     return(
<div className="table">
<div className="table-header">
      <span style={{ width: '40%' }}>
        <Sort
          sortKey={'TITLE'}
          onSort={this.onSort}
          isSortReverse={isSortReverse}
          activeSortKey={sortKey}
        >
          Title
        </Sort>
      </span>
      <span style={{ width: '30%' }}>
        <Sort
          sortKey={'AUTHOR'}
          onSort={this.onSort}
          isSortReverse={isSortReverse}
          activeSortKey={sortKey}
        >
          Author
        </Sort>
      </span>
      <span style={{ width: '10%' }}>
        <Sort
          sortKey={'COMMENTS'}
          onSort={this.onSort}
          isSortReverse={isSortReverse}
          activeSortKey={sortKey}
        >
          Comments
        </Sort>
      </span>
      <span style={{ width: '10%' }}>
        <Sort
          sortKey={'POINTS'}
          onSort={this.onSort}
          isSortReverse={isSortReverse}
          activeSortKey={sortKey}
        >
          Points
        </Sort>
      </span>
      <span style={{ width: '10%' }}>
        Archive
      </span>
    </div>
  {reverseSortedList.map(item =>
    <div key={item.objectID} className="table-row">
      <span style={largeColumn}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={midColumn}>{item.author}</span>
      <span style={smallColumn}>{item.num_comments}</span>
      <span style={smallColumn}>{item.points}</span>
      <span style={smallColumn}>
      <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
        Dismiss
      </Button>
      </span>
    </div>
  )}
</div>)
}

}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};
