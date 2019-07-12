import React, { Component, useState, useEffect } from 'react';
import '../styles.css';
import { toast, ToastContainer, cssTransition } from 'react-toastify';
import Category from './Category';
import AddResource from './AddResource';
import io from 'socket.io-client';
import AddCategory from './AddCategory';
import { resolveObject } from 'url';

// toast.configure({ autoClose: 2000, draggable: true });

const App = () => {
  // const [categories, setCategories] = useState([]);
  // const [imageLink, setImageLink] = useState([
  //   'https://whatsthatanimal.files.wordpress.com/2014/03/goblin-shark.png',
  // ]);
  const [state, setState] = useState({
    categories: [],
    imageLink: 'https://whatsthatanimal.files.wordpress.com/2014/03/goblin-shark.png',
    loaded: false,
  });
  // const [imageLink, setImageLink] = useState([
  //   'https://whatsthatanimal.files.wordpress.com/2014/03/goblin-shark.png',
  // ]);
  // const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/verify')
      .then(result => result.json())
      .then(({ verified }) => {
        if (!verified) window.location.replace('/');
      });
  });

  useEffect(() => {
    const fetchCategory = new Promise(resolve => {
      fetch('/api/category')
        .then(response => response.json())
        .then(data => {
          // setState({ categories: data });
          console.log('useeffect', data);
          resolve(data);
        })
        .catch(err => console.log(err));
    });
    const fetchImage = new Promise(resolve => {
      fetch('/api/GooglePicture')
        .then(response => response.json())
        .then(data => {
          if (data.picture.length > 0) {
            return resolve(data.picture);
          }
          resolve('https://whatsthatanimal.files.wordpress.com/2014/03/goblin-shark.png');
        });
    });
    Promise.all([fetchCategory, fetchImage]).then(values => {
      console.log(values);
      setState({ categories: values[0], imageLink: values[1], loaded: true });
    });
  }, []);

  // useEffect(() => {
  // fetch('/api/GooglePicture')
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(data);
  //     if (data.picture.length > 0) {
  //       setImageLink(data.picture);
  //     }
  //   });
  // }, []);
  //we will map over the categories array in the state object
  //we will create a react component for each element in the categories array

  const categoryComponents = state.categories.map(category => {
    return (
      <Category
        key={`catid_${category.categoryid}`}
        categoryName={category.category}
        id={category.categoryid}
      />
    );
  });

  // open socket connection
  if (state.loaded === false) {
    const socket = io(
      'http://localhost:3000',
      // {
      //   transports: ['websocket'],
      //   upgrade: false,
      // }
    );
    socket.on('vote', data => {
      console.log('message from voted middleware', data);
      notifyA(data);
    });
    socket.on('disconnect', () => {
      socket.removeAllListeners();
    });
  }

  const notifyA = data => {
    const vote = data.vote ? 'upvoted' : 'downvoted';
    toast.success(`${data.votedBy} ${vote} ${data.resource}`, {
      containerId: 'A',
    });
  };

  return (
    <div>
      <div id="navbar">
        <img id="logo" src={state.imageLink} />
        <h5>Goblin Sharks!!!</h5>

        <a
          className="login"
          href="https://github.com/login/oauth/authorize?client_id=13defefbd00cf6ce9fbf&scope=user:email"
        >
          <i className="fa fa-github fa-3x" />
        </a>
        <a className="login">
          <i className="fa fa-google fa-3x" />
        </a>
      </div>
      Notification Center
      <ToastContainer
        enableMultiContainer
        className="notification-center"
        containerId={'A'}
        position={toast.POSITION.TOP_RIGHT}
      />
      <div id="addCategory">
        <h2>Submit Categories Here</h2>
        <AddCategory categories={state.categories} />
      </div>
      <div className="categoryParent">{categoryComponents}</div>
      <div id="addResource">
        <h2>Submit Resources Here</h2>
        <AddResource categories={state.categories} />
      </div>
    </div>
  );
};

export default App;
