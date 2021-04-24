import React, { useState, useEffect } from 'react';
import { getCompanies } from '../api/graphql/companies';
import { getPeopleByDepartment } from '../api/graphql/people';
import Loader from '../components/loader.jsx';
import Home from '../pages/home';

const LoadHome = (props) => {
    const [data, setData] = useState({ fetched: null, isFetching: false });

    useEffect(() => {
        const fetchData = async () => {
            try{
                setData({ fetched: null, isFetching: true});
                let suggestionData = {}
                getPeopleByDepartment('acting')
                    .then(actRes => {
                        if(actRes) {
                            suggestionData["acting"] = actRes.getPeople
                            getPeopleByDepartment('directing')
                                .then(dirRes => {
                                    if(dirRes) {
                                        suggestionData["directing"] = dirRes.getPeople
                                        getCompanies()
                                            .then(comRes => {
                                                if(comRes) {
                                                    suggestionData["companies"] = comRes.getCompanies
                                                    setData({ fetched: suggestionData, isFetching: false })
                                                }
                                            })
                                    }
                                })
                        }
                    })
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