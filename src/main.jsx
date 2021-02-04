import React from 'react';
import axios from "axios";

const options = {
  method: 'GET',
  url: 'https://movie-database-imdb-alternative.p.rapidapi.com/',
  params: {i: 'tt4154796', r: 'json'},
  headers: {
    'x-rapidapi-key': '39eb07b247msh5a360614c8c1fa7p168871jsn8fc6c6c0765b',
    'x-rapidapi-host': 'movie-database-imdb-alternative.p.rapidapi.com'
  }
};

const Main = () => {
  const handleDataFetch = () => {
    axios.request(options).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }

  return (
    <div className="App">
      <button onClick={() => handleDataFetch()}>Get Movie Data</button>
    </div>
  );
}

export default Main;
