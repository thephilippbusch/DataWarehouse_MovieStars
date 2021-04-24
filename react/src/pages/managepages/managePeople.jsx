import React, { useEffect, useState } from 'react'

import {
    Box,
    TextInput,
    Button,
    Heading,
    Text,
    Image,
    Layer,
    Form,
    FormField,
    Select,
    Stack,
    Card
} from 'grommet'

import {
    AddCircle as AddCircleIcon,
    Alert,
    Checkmark,
    Filter as FilterIcon,
    Search as SearchIcon,
    Trash as TrashIcon
} from 'grommet-icons'
import Loader from '../../components/loader'

import { 
    getPersonDetails, 
    searchPeople,
    getMovieCredits
} from '../../api/tmdb/people'

import { 
    getMovieDetails,
    getMovieExternalIDs
} from '../../api/tmdb/movies'

import {
    addPerson as addPersonToES,
    deletePerson as deletePersonFromES,
    checkPersonExists
} from '../../api/graphql/people'

import {
    checkMovie as checkMovieInES,
    addMovie as addMovieToES
} from '../../api/graphql/movies'

const defaultFilterValues = {
    role: "All",
    popularity: 0
}

const Result = (props) => {
    const imgPath = props.person.profile_path ? `https://image.tmdb.org/t/p/w200/${props.person.profile_path}` : null;
    const [existing, setExisting] = useState(false);
    const [loadAdding, setAddLoading] = useState(false);
    const [loadRemoving, setRemoveLoading] = useState(false);
    const [showConfirmationCard, setShowConfirmationCard] = useState({ show: false, msg: '', color: '' })

    useEffect(() => {
        try {
            checkPersonExists(props.person.id)
                .then(res => {
                    if(res) {
                        if(res.checkPerson.doesExist) {
                            setExisting(true)
                        } else {
                            setExisting(false)
                        }
                    }
                })
        } catch(e) {
            console.error(e)
        }
    }, [props.person])

    const addPerson = () => {
        setAddLoading(true)
        try {
            getPersonDetails(props.person.id)
                .then(res => {
                    if(res) {
                        if(res.status === 200) {
                            console.log(res)
                            try {
                                const payload = {
                                    id: res.data.id,
                                    imdbId: res.data.imdb_id,
                                    name: res.data.name,
                                    knownForDep: res.data.known_for_department,
                                    popularity: res.data.popularity,
                                    birthday: res.data.birthday,
                                    deathday: res.data.deathday,
                                    imgPath: imgPath,
                                    gender: res.data.gender
                                }
                                getMovieCredits(payload.id)
                                    .then(res => {
                                        if(res) {
                                            let sortedMovielist = null;
                                            if(payload.knownForDep === "Acting") {
                                                sortedMovielist = res.data.cast.sort((a, b) => {
                                                    return b.popularity - a.popularity
                                                })
                                            } else {
                                                sortedMovielist = res.data.crew.filter(movie => movie.department === payload.knownForDep).sort((a, b) => {
                                                    return b.popularity - a.popularity
                                                })
                                            }
                                            if(sortedMovielist) {
                                                let newMovieList = []
                                                sortedMovielist.map((movie, index) => {
                                                    if(index < 10) {
                                                        newMovieList.push(movie.id)
                                                    }
                                                })
                                                payload.popularMovieIDs = newMovieList
                                                newMovieList.map(movie => {
                                                    getMovieDetails(movie)
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
                                
                                                                getMovieExternalIDs(movie)
                                                                    .then(res => {
                                                                        if(res) {
                                                                            payload.twitter_id = res.data.twitter_id
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
                                                                    })
                                                            }
                                                            
                                                        })
                                                })
                                                addPersonToES(payload)
                                                    .then(gqlres => {
                                                        if(gqlres.addPerson) {
                                                            setExisting(true)
                                                            setShowConfirmationCard({ show: true, msg: `'${payload.name}' was successfully added to the database`, color: 'status-ok' })
                                                            setTimeout(() => {
                                                                setShowConfirmationCard({ show: false, msg: '', color: '' })
                                                            }, 3000)
                                                        } else {
                                                            setShowConfirmationCard({ show: true, msg: `'${payload.name}' already exists in the database`, color: 'status-critical' })
                                                            setTimeout(() => {
                                                                setShowConfirmationCard({ show: false, msg: '', color: '' })
                                                            }, 3000)
                                                        }
                                                        setAddLoading(false)
                                                })
                                            }
                                        }
                                    })
                            } catch(e) {
                                console.error(e)
                                setAddLoading(false)
                            }
                        } else {
                            alert('Something went wrong on our Side!')
                            setAddLoading(false)
                        }
                    }
                })
        } catch(e) {
            console.error(e)
            setAddLoading(false)
        } 
    }

    const removePerson = () => {
        setRemoveLoading(true)
        try{
            deletePersonFromES(props.person.id)
                .then(res => {
                    if(res) {
                        if(res.deletePerson.ok) {
                            setExisting(false)
                            setShowConfirmationCard({ show: true, msg: `'${props.person.name}' was successfully removed from the database`, color: 'status-ok' })
                            setTimeout(() => {
                                setShowConfirmationCard({ show: false, msg: '', color: '' })
                            }, 3000)
                        } else {
                            setShowConfirmationCard({ show: true, msg: `'${props.person.name}' could not be removed from the database`, color: 'status-critical' })
                            setTimeout(() => {
                                setShowConfirmationCard({ show: false, msg: '', color: '' })
                            }, 3000)
                        }
                    }
                    setRemoveLoading(false)
                })
        } catch(e) {
            console.error(e)
            setRemoveLoading(false)
        }
    }

    return (
        <Stack>
            {showConfirmationCard.show && (
                <Box 
                    direction="row" 
                    justify="center" 
                    align="center"
                    height="210px" 
                    gap="small" 
                    pad="small"
                    border="top"
                    animation={{type: "fadeOut", delay: 2000}}
                    width={{min: "large"}}
                >
                    <Card 
                        direction="row" 
                        justify="around" 
                        width="medium"
                        pad="medium"
                        round="small"
                        align="center"
                        background={showConfirmationCard.color}
                    >
                        {showConfirmationCard.color === "status-ok" ? (
                            <Checkmark color="light-1"/>
                        ) : (
                            <Alert color="light-1" />
                        )}
                        <Text margin={{left: "medium"}} color="light-1">{showConfirmationCard.msg}</Text>
                    </Card>
                </Box>
            )}
            <Box 
                direction="row" 
                justify="between" 
                align="center"
                height="210px" 
                gap="small" 
                pad="small"
                border="top"
                width={{min: "large"}}
            >
                <Box direction="row" justify="start">
                    <Box height="small" width="130px" border="all">
                        {imgPath && (
                            <Image
                                fit="contain"
                                src={imgPath}
                            />
                        )}
                    </Box>
                    <Box fill="vertical" >
                        <Heading level="4" margin="small">{props.person.name}</Heading>
                        <Text margin={{horizontal: "small"}}>{props.person.known_for_department}</Text>
                    </Box>
                </Box>
                <Box justify="end" fill="vertical">
                    <Box direction="column" justify="end" gap="small">
                        {loadRemoving ? (
                            <Loader size="component"/>
                        ) : (
                            <Button 
                                primary 
                                icon={<TrashIcon />} 
                                label="Remove"
                                onClick={() => removePerson()}
                                color="status-critical"
                                disabled={!existing}
                            />
                        )}
                        {loadAdding ? (
                            <Loader size="component"/>
                        ) : (
                            <Button 
                                primary 
                                icon={<AddCircleIcon />} 
                                label="Add"
                                onClick={() => addPerson()}
                                disabled={existing}
                            />
                        )}
                    </Box>
                </Box>
            </Box>  
        </Stack>
    )
}

const SearchResults = (props) => {
    return (
        <Box fill="horizontal">
            {props.data.filter(person =>
                person.popularity > parseFloat(props.filter.popularity)
            ).filter(person =>
                props.filter.role === "All" ? (
                    person
                ) : (
                    person.known_for_department === props.filter.role
                )
            ).map((person, index) => {
                return(
                    <Result key={index} person={person} />
                )
            })}
        </Box>
    )
}

const ManagePeople = () => {
    const [searchEntry, setSearchEntry] = useState({search: ''});
    const [loadingResult, setLoadingResult] = useState(false);
    const [resultContainer, setResultContainer] = useState();
    const [loadError, setLoadError] = useState("");
    const [showFilterLayer, setShowFilterLayer] = useState(false);
    const [filterValues, setFilterValues] = useState(defaultFilterValues);

    const handleSearchSubmit = () => {
        setLoadingResult(true);
        if(searchEntry !== "") {
            searchPeople(searchEntry, '1')
                .then(data => {
                    if(data) {
                        if(data.status === 200) {
                            if(data.data.results.length > 0) {
                                setResultContainer(<SearchResults data={data.data.results} filter={filterValues}/>)
                            } else {
                                setResultContainer(
                                    <Box fill="vertical" align="center">
                                        <Heading level="5" color="status-warning" textAlign="center">No Person with the name '{searchEntry}' was found!</Heading>
                                    </Box>
                                )
                            }
                            setLoadError("");
                            setLoadingResult(false);
                        } else {
                            setLoadError("Something went wrong while searching! Don't worry, that's on us!");
                            setLoadingResult(false);
                        }
                    }
                });
        } else {
            setLoadError("Enter a Search Value!");
            setLoadingResult(false);
        }
    }

    // const loadNextPage = () => {
    //     console.log(resultData)

    //     currentPage++;
    //     searchPeople(searchEntry, currentPage)
    //         .then(data => {
    //             if(data) {
    //                 if(data.status === 200) {
    //                     resultData.push.apply(resultData, data.data.results);
    //                     console.log(resultData)
    //                     if(data.data.results.length > 0) {
    //                         setResultContainer(<SearchResults data={resultData} filter={filterValues}/>)
    //                     } else {
    //                         setResultContainer(
    //                             <Box fill="vertical" align="center">
    //                                 <Heading level="5" color="status-warning" textAlign="center">No Actor/Actress with the name '{searchEntry}' was found!</Heading>
    //                             </Box>
    //                         )
    //                     }
    //                     setLoadError("");
    //                     setLoadingResult(false);
    //                 } else {
    //                     setLoadError("Something went wrong while searching! Don't worry, that's on us!");
    //                     setLoadingResult(false);
    //                 }
    //             }
    //         })
    // }

    return (
        <Box fill="horizontal" height="91vh" align="center" pad={{top: "medium"}}>
            <Box height="12vh" fill="horizontal" align="center" gap="small">
                <Box
                    width="80%"
                    direction="row"
                    align="center"
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    round="medium"
                    border={{
                        side: 'all',
                    }}
                >
                    <SearchIcon color="brand" />
                    <TextInput
                        plain
                        placeholder={"Adam Driver"}
                        onChange={e => setSearchEntry(e.target.value)}
                    />
                </Box>
                <Box direction="row" justify="center" gap="small">
                    <Button 
                        primary
                        disabled={loadingResult}
                        type="submit"
                        label="Search"
                        icon={<SearchIcon />}
                        onClick={() => handleSearchSubmit()}
                    />
                    <Button 
                        secondary
                        label="Filter"
                        icon={<FilterIcon />}
                        onClick={() => setShowFilterLayer(true)}
                    />
                </Box>
                {showFilterLayer && (
                    <Layer
                        onEsc={() => setShowFilterLayer(false)}
                        onClickOutside={() => setShowFilterLayer(false)}
                    >
                        <Box width="medium" pad="small">
                            <Form
                                value={filterValues}
                                onChange={newVal => setFilterValues(newVal)}
                                onSubmit={() => {
                                    setShowFilterLayer(false)
                                    console.log(filterValues)
                                }}
                                onReset={() => setFilterValues(defaultFilterValues)}
                            >
                                <FormField fill="horizontal" name="role" label="Role">
                                    <Select
                                        name="role"
                                        options={['All', 'Acting', 'Directing']}
                                    />
                                </FormField>
                                <FormField fill="horizontal" name="popularity" label="Min. Popularity Score">
                                    <TextInput name="popularity" type="number" />
                                </FormField>
                                <Box fill="horizontal" direction="row" justify="between">
                                    <Button primary type="submit" label="Save"/>
                                    <Button secondary type="reset" label="Reset"/>
                                </Box>
                            </Form>
                        </Box>
                    </Layer>
                )}
            </Box>

            <Box fill="horizontal" align="center">
                <Text color="status-critical">{loadError}</Text>
            </Box>
            <Box width="80%" height="79vh" align="center" overflow={{vertical: "auto"}}>
                {loadingResult ? (
                    <Loader size="component"/>
                ) : (
                    resultContainer ? (
                        resultContainer
                    ) : (
                        <Box fill="vertical" align="center">
                            <Heading level="5" textAlign="center">No Results Yet!</Heading>
                        </Box>
                    )
                )}
                {/* {totalPages > 1 && (
                    <Box direction="row" justify="center" margin={{vertical: "small"}}>
                        <Button label="Load More" onClick={() => loadNextPage()}/>
                    </Box>
                )} */}
            </Box>
        </Box>
    )
}

export default ManagePeople;