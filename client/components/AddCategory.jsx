import React, { useState } from 'react';

export default function AddCategory(props) {
  const [categoryName, setCategoryName] = useState('CategoryName');

  const clickHandler = e => {
    e.preventDefault();
    console.log(categoryName);

    fetch('/api/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: categoryName })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => error);
  };

  const categoryNameChange = e => {
    setCategoryName(e.target.value);
  };

  return (
    <div id='submitCategory'>
      <input type="text" placeholder="Category" onChange={categoryNameChange} />
      <button id="submitCategory" onClick={clickHandler}>
        Add a Category
      </button>
    </div>
  );
}
