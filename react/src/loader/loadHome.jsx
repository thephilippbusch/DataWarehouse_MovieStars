import React from 'react';
// import Loader from '../components/loader.jsx';
// import axios from 'axios';
import Home from '../pages/home';

const LoadHome = (props) => {
    // const [data, setData] = useState({ fetched: null, isFetching: false });
    // const apiKey = TMDB_API_KEY;

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try{
    //             setData({ fetched: data, isFetching: true});
    //             const response = await axios.get(`https://api.themoviedb.org/3/movie/27205?api_key=${apiKey}`);
    //             console.log(response);
    //             setData({ fetched: response.data, isFetching: false});
    //         } catch(e) {
    //             console.log(e);
    //             setData({ fetched: data.fetched, isFetching: false});
    //         }
    //     }
    //     fetchData();
    // }, [apiKey]);
    
    // return data.fetched && !data.isFetching ? (
    //     <Home data={data.fetched} />
    // ) : (
    //     <Loader size="fullscreen" />
    // )

    return (
        <Home status={props.status}/>
    )
}

export default LoadHome;