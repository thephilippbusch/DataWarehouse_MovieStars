import React, { useState } from 'react'
import styled from 'styled-components'

import {
    Box,
    TextInput,
    Button,
    Heading,
    Text,
    Image
} from 'grommet'

import {
    AddCircle as AddCircleIcon,
    Search as SearchIcon,
    Trash as TrashIcon
} from 'grommet-icons'
import Spinner from '../../components/spinner'

import { searchCompanies } from '../../api/tmdb/companies'

const ResultContainer = styled.div`
    width: 80%; 
    height: 79vh; 
    align-items: center; 
    overflow-y: auto;
`;

const Result = (props) => {
    const logoPath = `https://image.tmdb.org/t/p/w200/${props.company.logo_path}`;
    const [notExisting, setNotExisting] = useState(true);

    const addCompany = () => {
        console.log(props.company.id);
    }

    const removeCompany = () => {
        console.log(props.company.id);
    }

    return (
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
                    <Image
                        fit="contain"
                        src={logoPath}
                    />
                </Box>
                <Box fill="vertical" >
                    <Heading level="4" margin="small">{props.company.name}</Heading>
                    <Text margin={{horizontal: "small"}}>{props.company.id}</Text>
                </Box>
            </Box>
            <Box justify="end" fill="vertical">
                <Box direction="column" justify="end" gap="small">
                <Button 
                        primary 
                        icon={<TrashIcon />} 
                        label="Remove"
                        onClick={() => removeCompany()}
                        color="status-critical"
                        disabled={notExisting}
                    />
                    <Button 
                        primary 
                        icon={<AddCircleIcon />} 
                        label="Add"
                        onClick={() => addCompany()}
                    />
                </Box>
            </Box>
        </Box>  
    )
}

const SearchResults = (props) => {
    return (
        <Box fill="horizontal">
            {props.data.map((company, index) => {
                return(
                    <Result key={index} company={company} />
                )
            })}
        </Box>
    )
}

const ManageCompanies = () => {
    const [searchEntry, setSearchEntry] = useState({search: ''});
    const [loadingResult, setLoadingResult] = useState(false);
    const [resultContainer, setResultContainer] = useState();
    const [loadError, setLoadError] = useState("");

    const handleSearchSubmit = () => {
        setLoadingResult(true);
        if(searchEntry !== "") {
            searchCompanies(searchEntry, '1')
                .then(data => {
                    if(data) {
                        if(data.status === 200) {
                            if(data.data.results.length > 0) {
                                setResultContainer(<SearchResults data={data.data.results}/>)
                            } else {
                                setResultContainer(
                                    <Box fill="vertical" align="center">
                                        <Heading level="5" color="status-warning" textAlign="center">No Company with the name '{searchEntry}' was found!</Heading>
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
                        placeholder={"Lucasfilm"}
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
            <ResultContainer>
                {loadingResult ? (
                    <Spinner size="component"/>
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
            </ResultContainer>
        </Box>
    )
}

export default ManageCompanies;