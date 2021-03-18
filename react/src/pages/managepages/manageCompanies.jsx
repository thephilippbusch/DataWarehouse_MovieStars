import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import {
    Box,
    TextInput,
    Button,
    Heading,
    Text,
    Image,
    Card,
    Stack
} from 'grommet'

import {
    AddCircle as AddCircleIcon,
    Search as SearchIcon,
    Trash as TrashIcon,
    Alert,
    Checkmark
} from 'grommet-icons'

import Loader from '../../components/loader'
import { searchCompanies, checkCompanyExists, addCompany as addCompanyToES } from '../../api/tmdb/companies'

const ResultContainer = styled.div`
    width: 80%; 
    height: 79vh; 
    align-items: center; 
    overflow-y: auto;
`;

const Result = (props) => {
    const logoPath = `https://image.tmdb.org/t/p/w200/${props.company.logo_path}`;
    const [existing, setExisting] = useState(false);
    const [loadAdding, setAddLoading] = useState(false);
    const [showConfirmationCard, setShowConfirmationCard] = useState({ show: false, msg: '', color: ''});

    useEffect(() => {
        try {
            checkCompanyExists(props.company.id)
                .then(res => {
                    console.log(res)
                    if(res) {
                        if(res.checkCompany) {
                            setExisting(true)
                        } else {
                            setExisting(false)
                        }
                    }
                })
        } catch(e) {
            console.error(e)
        }
    }, [props.company])

    const addCompany = () => {
        setAddLoading(true)
        try {
            const payload = {
                id: props.company.id,
                name: props.company.name,
            }

            addCompanyToES(payload)
                .then(gqlres => {
                    if(gqlres.addCompany) {
                        setExisting(true)
                        setShowConfirmationCard({ show: true, msg: `'${payload.name}' was successfully added to the database`, color: 'status-ok' })
                        setTimeout(() => {
                            setShowConfirmationCard({ show: false, msg: '', color: '' })
                        }, 10000)
                    } else {
                        setShowConfirmationCard({ show: true, msg: `'${payload.name}' already exists in the database`, color: 'status-critical' })
                        setTimeout(() => {
                            setShowConfirmationCard({ show: false, msg: '', color: '' })
                        }, 3000)
                    }
                    setAddLoading(false)
                })
        } catch(e) {
            console.error(e)
            setAddLoading(false)
        } 
    }

    const removeCompany = () => {
        console.log(props.company.id);
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
                            disabled={!existing}
                        />
                        {loadAdding ? (
                            <Loader size="component"/>
                        ) : (
                            <Button 
                                primary 
                                icon={<AddCircleIcon />} 
                                label="Add"
                                onClick={() => addCompany()}
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
    const companies = props.data.sort((a, b) => {return(a.id - b.id)})

    return (
        <Box fill="horizontal">
            {companies.map((company, index) => {
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
            </ResultContainer>
        </Box>
    )
}

export default ManageCompanies;