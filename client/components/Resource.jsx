import React, { Component, useState, useEffect} from 'react';

//TODO Hook refactor

const Resource = props => {
  const [vote, setVote] = useState(null);
  const [lameEmail, setLameEmail] = useState('lameEmail@gmail.com');
  const [hasVoted, setHasVoted] = useState(props.hasVoted);
  // console.log(`UPVOTED: ${upvoted} \n DOWNVOTED: ${downvoted}`);
  const handleUpVote = event => {
    let voteCopy;
    if (vote === null) voteCopy = true;
    else if (vote === true) voteCopy = null;
    else if (vote === false) voteCopy = null;
    setHasVoted('1');
    fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceid: props.id, useremail: lameEmail, upvote: voteCopy }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Resource.js => handleUpVote => data', voteCopy, data);
        setVote(voteCopy);
      })
      .catch(error => error);
  };

  const handleDownVote = event => {
    let voteCopy;
    if (vote === null) voteCopy = false;
    else if (vote === true) voteCopy = null;
    else if (vote === false) voteCopy = null;
    setHasVoted('-1');

    fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceid: props.id, useremail: lameEmail, upvote: voteCopy }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Resource.js => handleDownVote => data', voteCopy, data);
        setVote(voteCopy);
      })
      .catch(error => error);
  };

  const upVote = vote === true ? 1 : 0;
  const downVote = vote === false ? 1 : 0;

  return (
    <div className="resourceDiv">
      {/* <p>TEST: {props.hasVoted}</p> */}
      <div className="resourceLinks">{props.link}</div>
      <div className="mathing">
        <div className="adding" style={hasVoted==='1' ? {backgroundColor:'orange'}:{}}>
          <a className="things" href="#" onClick={handleUpVote}>
            upvote
          </a>
          {Number(props.sumupvote) + upVote}
        </div>
        <div className="subtracting" style={hasVoted==='-1' ? {backgroundColor:'purple'}:{}}>
          <a className="things" href="#" onClick={handleDownVote}>
            downvote
          </a>
          {Number(props.sumdownvote) + downVote}
        </div>
      </div>
    </div>
  );
};

export default Resource;
