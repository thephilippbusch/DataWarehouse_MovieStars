import React, { useState, useEffect } from 'react'

import { getMovieDetails, getMovieExternalIDs } from '../api/tmdb/movies'
import { 
    addMovie as addMovieToES,
    checkMovie as checkMovieInES
} from '../api/graphql/movies'

import PersonStatistics from '../pages/person/statistics'
import Loader from '../components/loader'

const LoadPersonStatistics = (props) => {
    const [data, setData] = useState({ fetched: null, isFetching: false })

    useEffect(() => {
        try {
            setData({ fetched: null, isFetching: true })
            const fetchStatisticData = async () => {
                const movieDetails = []
                props.movies.map(movie => {
                    getMovieDetails(movie.id)
                        .then(res => {
                            if(res) {
                                let productionComps = res.data.production_companies.map(company => {
                                    return {
                                        id: company.id,
                                        name: company.name
                                    }
                                })

                                let payload = {
                                    title: res.data.title,
                                    id: res.data.id,
                                    imdbId: res.data.imdb_id,
                                    budget: res.data.budget,
                                    revenue: res.data.revenue,
                                    runtime: res.data.runtime,
                                    popularity: res.data.popularity,
                                    vote: res.data.vote_average,
                                    voteCount: res.data.vote_count,
                                    genres: res.data.genres,
                                    productionCompanies: productionComps
                                }

                                getMovieExternalIDs(movie.id)
                                    .then(res => {
                                        if(res) {
                                            payload.twitter_id = res.data.twitter_id
                                            movieDetails.push(payload)

                                            checkMovieInES(payload.id)
                                                .then(res => {
                                                    if(res) {
                                                        if(!res.checkMovie.doesExist) {
                                                            addMovieToES(payload)
                                                                .then(res => {
                                                                    if(res) {
                                                                        console.log(res)
                                                                    } else {
                                                                        console.error("Something went wrong!")
                                                                    }
                                                                })
                                                        } else {
                                                            console.log("Movie already exists in ES")
                                                        }
                                                    }
                                                })
                                        }
                                        if(props.movies.length === movieDetails.length) {
                                            setData({ fetched: movieDetails, isFetching: false })
                                        }
                                    })
                            }
                            
                        })
                })
            }
            let result = fetchStatisticData()
        } catch(e) {
            console.error(e)
            setData({ fetched: null, isFetching: false })
        }
    }, [])

    return data.fetched && !data.isFetching ? (
        <PersonStatistics data={data.fetched} person={props.person}/>
    ) : (
        <Loader size="component"/>
    )
}

export default LoadPersonStatistics