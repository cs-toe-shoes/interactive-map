import React, { Component, useState, useEffect } from 'react';
import Resource from './Resource.jsx';

//What are we creating?
//A component that has a button element
//When that button is clicked, it will reveal resources associated with that category
const Category = props => {
  const [resources, setResources] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const clickHandler = event => {
    event.preventDefault();
    //we use the .setState to update a piece of state
    //we use the 'bang' operator to on the buttonClicked property value to toggle
    setButtonClicked(!buttonClicked);

    //make a fetch request to our API
    fetch(`/api/resources/${props.id}`)
      .then(response => response.json())
      //we will update our resources value stored in this.state
      .then(data => setResources(data))
      .catch(err => console.log(err));

    ;
  };

  
  const updatedResources = resources.map(resource => {
    return (
      <Resource
        id={resource.resourceid}
        link={resource.link}
        key={`${resource.resourceid}${props.id}`}
        sumdownvote={resource.sumdownvote}
        sumupvote={resource.sumupvote}
        score={resource.score}
        hasVoted={resource.hasvoted}
      />
      
      );
      
    });

    let render = 'Sorry, no resources';
      if (updatedResources.length > 0) render = updatedResources;

    return (
    <div className="categoryDiv">
      <div className={`cat${props.id} categoryBtn`} onClick={clickHandler}>
        {props.categoryName}
      </div>
      <div className="resourcesList">
        {buttonClicked ? render : ''}
      </div>
    </div>
  );
};

export default Category;
