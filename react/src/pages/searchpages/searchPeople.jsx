import React, { useState } from 'react'
import { getPeopleByKey } from '../../api/graphql/people'
import Loader from '../../components/loader'
import { useHistory } from 'react-router'

import {
    Anchor,
    Heading,
    Box,
    TextInput,
    Button,
    Text
} from 'grommet'

import {
    Search as SearchIcon
} from 'grommet-icons'

const defaultFilterValues = {
    role: "All",
    popularity: 0
}

const Result = props => {
    let history = useHistory()

    return (
        <Box 
            fill="horizontal" 
            direction="row" 
            justify="between"
            border={{side: "bottom", size: "small"}}
            pad={{vertical: "small"}}
        >
            <Box width="small">
                <Text level="4" margin="none">
                    <Anchor onClick={() => history.push(`/person/${props.person.imdbId}`)} color="text">{props.person.name}</Anchor>
                </Text>
            </Box>
            <Box width="small">
                <Text level="4" margin="none">
                    {props.person.knownForDep}
                </Text>
            </Box>
            <Box width="small">
                <Text level="4" margin="none">
                    {props.age}
                </Text>
            </Box>
            <Box width="small">
                <Text level="4" margin="none">
                    {props.person.imdbId}
                </Text>
            </Box>
        </Box>
    )
}

const SearchResults = (props) => {
    return (
        <Box fill="horizontal">
            {props.data.map((person, index) => {
                let today = new Date()
                let bday = new Date(person.birthday)
                let ageDate = new Date(today - bday)
                let age = Math.abs(ageDate.getUTCFullYear() - 1970)
                return(
                    <Result key={index} person={person} age={age}/>
                )
            })}
        </Box>
    )
}

const SearchActing = () => {
    const [searchEntry, setSearchEntry] = useState({search: ''});
    const [loadingResult, setLoadingResult] = useState(false);
    const [resultContainer, setResultContainer] = useState();
    const [loadError, setLoadError] = useState("");
    const [showFilterLayer, setShowFilterLayer] = useState(false);
    const [filterValues, setFilterValues] = useState(defaultFilterValues);

    const handleSearchSubmit = () => {
        setLoadingResult(true);
        if(searchEntry !== "") {
            let payload = {
                name: searchEntry
            }
            getPeopleByKey(payload)
                .then(data => {
                    if(data) {
                        console.log(data)

                        if(data.getPeople) {
                            if(data.getPeople.length > 0) {
                                setResultContainer(<SearchResults data={data.getPeople}/>)
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
                </Box>
            </Box>

            <Box fill="horizontal" align="center">
                <Text color="status-critical">{loadError}</Text>
            </Box>
            <Box width="80%" height="79vh" align="center" overflow={{vertical: "auto"}}>
                <Box 
                    fill="horizontal" 
                    direction="row" 
                    justify="between"
                    border={{side: "bottom", size: "small"}}
                    pad={{vertical: "small"}}
                >
                    <Box width="small">
                        <Heading level="4" margin="none">
                            Name
                        </Heading>
                    </Box>
                    <Box width="small">
                        <Heading level="4" margin="none">
                            Department
                        </Heading>
                    </Box>
                    <Box width="small">
                        <Heading level="4" margin="none">
                            Age
                        </Heading>
                    </Box>
                    <Box width="small">
                        <Heading level="4" margin="none">
                            imdbID
                        </Heading>
                    </Box>
                </Box>
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
            </Box>
        </Box>
    )
}

export default SearchActing;