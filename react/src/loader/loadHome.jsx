import React, { useState, useEffect } from 'react';
import Loader from '../components/loader.jsx';
import axios from 'axios';
import Home from '../pages/home';

import { TMDB_API_KEY } from '../config';

const LoadHome = (props) => {
    const [data, setData] = useState({ fetched: null, isFetching: false });

    useEffect(() => {
        const fetchData = async () => {
            try{
                setData({ fetched: data, isFetching: true});
                const response = await axios.get(`https://api.themoviedb.org/3/movie/27205?api_key=${TMDB_API_KEY}`);
                console.log(response);
                setData({ fetched: response.data, isFetching: false});
            } catch(e) {
                console.log(e);
                setData({ fetched: data.fetched, isFetching: false});
            }
        }
        fetchData();
    }, []);
    
    return data.fetched && !data.isFetching ? (
        <Home data={data.fetched} />
    ) : (
        <Loader size="fullscreen" />
    )
}

export default LoadHome;