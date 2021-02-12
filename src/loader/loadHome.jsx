import React, { useState } from 'react';
import Loader from '../components/loader.jsx';



const LoadHome = (props) => {
    const [data, setData] = useState({ fetched: null, isFetching: false });

    useEffect(() => {
        const fetchData = async () => {
            try{
                setData({ fetched: data, isFetching: true});
                const response = await axios.get(`https://api.themoviedb.org/3/movie/27205?api_key=3927e4a3b15d07fa33a892e671cb385f`);
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
        <LoaderWrap>
            <Loader />
        </LoaderWrap>
    )
}

export default LoadHome;