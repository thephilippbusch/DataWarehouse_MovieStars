import React, { useEffect, useState } from 'react'
import { getMovieCredits } from '../api/tmdb/people'
import { updateMovieList } from '../api/graphql/people'
import styled from 'styled-components'

import { 
    Avatar,
    Box, Heading, Text, Tip
 } from 'grommet'

import { 
    UserFemale as UserFemaleIcon 
} from 'grommet-icons'

import LoadPersonStatistics from '../loader/loadPersonStatistics'

const ScrollBox = styled.div`
    width: 100%;
    height: 91vh;
    overflow-y: auto;
`

const Person = (props) => {
    const [popularMovies, setPopularMovies] = useState()

    const getAge = () => {
        let lower = new Date(props.data.birthday)
        let upper = props.data.deathday ? new Date(props.data.deathday) : new Date()
        let ageDate = new Date(upper - lower)
        return ageDate.getUTCFullYear() - 1970
    }

    const formatDate = (dateString) => {
        let date = new Date(dateString)
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        let result = date.toLocaleDateString('de-DE', options) 
        return result
    }

    const getGenderString = (genderInt) => {
        switch(genderInt) {
            case 0:
                return "Undefined"
            case 1:
                return "Female"
            case 2:
                return "Male"
            case 3:
                return "Non-Binary"
        }
    }

    useEffect(() => {
        try {
            let popMovies = []
            getMovieCredits(props.data.id)
                .then(res => {
                    if(res) {
                        let sortedMovielist = null;
                        if(props.data.knownForDep === "Acting") {
                            console.log(props.data.knownForDep)
                            sortedMovielist = res.data.cast.sort((a, b) => {
                                return b.popularity - a.popularity
                            })
                        } else {
                            console.log(props.data.knownForDep)
                            sortedMovielist = res.data.crew.filter(movie => movie.department === props.data.knownForDep).sort((a, b) => {
                                return b.popularity - a.popularity
                            })
                        }
                        if(sortedMovielist) {
                            let newMovieList = []
                            sortedMovielist.map((movie, index) => {
                                if(index < 10) {
                                    popMovies.push({
                                        title: movie.title,
                                        id: movie.id
                                    })
                                    newMovieList.push(movie.id)
                                }
                            })
                            setPopularMovies(popMovies)
                            updateMovieList(props.data.id, newMovieList)
                                .then(res => {
                                    if(res) {
                                        console.log(`Successfully updated movie list of ${props.data.name}`)
                                    } else {
                                        console.error("Could not update movie list, something went wrong")
                                    }
                                })
                        }
                    }
                })
        } catch(e) {
            console.error(e)
            setPopularMovies(null)
        }
        
    }, [props.data])

    return (
        <ScrollBox>
            <Box 
                align="center"
                pad="small"
                gap="small"
            >
                <Box 
                    fill="horizontal"
                    background="background-contrast"
                    direction="row"
                    justify="between"
                    align="center"
                >
                    <Box 
                        width="50%" 
                        direction="column" 
                        align="center" 
                        justify="center"
                        pad={{vertical: "large"}}
                    >
                        {props.data.imgPath ? (
                            <Avatar src={props.data.imgPath} size="200px"/>
                        ) : (
                            <Avatar size="large">
                                <UserFemaleIcon size="large"/>
                            </Avatar>
                        )}
                        <Heading level="2" margin={{bottom: "small", top: "xsmall"}}>{props.data.name}</Heading>
                        <Text>{props.data.imdbId}</Text>
                    </Box>
                    <Box width="50%">
                        <Heading level="4" margin={{vertical: "xsmall"}}>General Information:</Heading>
                        <Box
                            direction="row"
                            justify="start"
                            align="start"
                            pad="small"
                        >
                            <Box width="small">
                                <Text weight="bold">Birthday:</Text>
                                {props.data.deathday && (
                                    <Text weight="bold">Deathday:</Text>
                                )}
                                <Text weight="bold">Age:</Text>
                                <Text weight="bold">Gender:</Text>
                                <Text weight="bold">Department:</Text>
                                <Tip content={<Text background="background-contrast" color="text">Popularity score retrieved by TMDB</Text>}>
                                    <Text weight="bold">Popularity*:</Text>
                                </Tip>
                            </Box>
                            <Box width="medium">
                                <Text>{formatDate(props.data.birthday)}</Text>
                                {props.data.deathday && (
                                    <Text>{formatDate(props.data.deathday)}</Text>
                                )}
                                <Text>{getAge()}</Text>
                                <Text>{getGenderString(props.data.gender)}</Text>
                                <Text>{props.data.knownForDep}</Text>
                                <Text>{props.data.popularity}</Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box fill="horizontal">
                    {popularMovies && (
                        <LoadPersonStatistics movies={popularMovies} person={props.data}/>
                    )}
                </Box>
            </Box>
        </ScrollBox>
    )
}

export default Person