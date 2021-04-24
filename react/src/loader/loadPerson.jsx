import React, { useState, useEffect } from 'react'
import { getPeopleByKey } from '../api/graphql/people'
import { useHistory } from 'react-router'

import { 
    Heading,
    Box, 
    Button
} from 'grommet'

import Loader from '../components/loader'
import Person from '../pages/person'

const LoadPerson = (props) => {
    const [data, setData] = useState({ fetched: null, isFetching: false })
    const [loadError, setLoadError] = useState(null)
    let history = useHistory()

    useEffect(() => {
        try {
            setData({ fetched: data, isFetching: true })
            const fetchPersonData = async () => {
                let imdbId = props.match.params.id
                getPeopleByKey({imdbId: imdbId})
                    .then(res => {
                        if(res) {
                            if(res.hasOwnProperty("getPeople")) {
                                if(res.getPeople.length === 0) {
                                    setData({ fetched: null, isFetching: false})
                                    setLoadError(`No Person with ImdbID ${imdbId} found! Check the database if this entry really exists.`)
                                } else {
                                    let data = res.getPeople[0]
                                    setLoadError(null)
                                    setData({ fetched: data, isFetching: false })
                                }
                            }
                        }
                    })
            }
            fetchPersonData()
        } catch(e) {
            console.error(e)
            setData({ fetched: null, isFetching: false })
            setLoadError(`Something went wrong, that's on us!`)
        }
    }, [])

    return data.fetched && !data.isFetching ? (
        <Person data={data.fetched}/>
    ) : (
        loadError ? (
            <Box fill align="center" pad={{vertical: "medium"}}>
                <Heading level="5" color="status-critical" textAlign="center">{loadError}</Heading>
                <Button 
                    label="Manage Database" 
                    onClick={() => history.push('/manage/people')}
                />
            </Box>
        ) : (
            <Loader />
        )
    )
}

export default LoadPerson