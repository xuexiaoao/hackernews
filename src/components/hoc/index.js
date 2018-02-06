import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'


const Loading = () =>
  <FontAwesomeIcon icon="spinner" />

export const withLoading  = (Component) => ({isLoading, ...rest}) =>
  isLoading ?
  <Loading />:
 <Component {...rest}/>

export const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];

  const updatedHits = [
    ...oldHits,
    ...hits
  ];
  return {
  results: {
    ...results,
    [searchKey]: { hits: updatedHits, page }
  },
  isLoading: false
};
};

export const dismissState = (id) => (prevState) => {
  const { searchKey, results } = prevState;
  const {hits,page} = results[searchKey]

  const isNotId = item => item.objectID !== id;
  const updatedHits = hits.filter(isNotId);

  return {
  results: {
    ...results,
    [searchKey]: { hits: updatedHits, page }
  },
  isLoading: false
};
};
