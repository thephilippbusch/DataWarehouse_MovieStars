import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { createCalculation } from '../api/graphql/calculation'

import {
    Box, 
    Button, 
    Form,
    FormField, 
    Heading,
    TextInput,
    Text
} from 'grommet';

import {
    AddCircle,
    Services as ServicesIcon,
    Trash
} from 'grommet-icons'

import Loader from '../components/loader'

// const ActingInput = (props) => {
//     const onChange = useCallback(event => {
//         const { value: newValue } = event.target;
//         setValue(newValue);
    
//         if (!newValue.trim()) {
//           setSuggestedFolks([]);
//         } else {
//           setTimeout(() => setSuggestedFolks(folks), 300);
//         }
//       }, []);

//     return (
//         <Box>

//         </Box>
//     )
// }

const Home = (props) => {
    const [result, setResult] = useState({ fetched: null, isFetching: false })
    const [isError, setIsError] = useState()
    const [budget, setBudget] = useState(0)
    const [acting, setActing] = useState([{name: "", id: null}])
    const [actingSuggestions, setActingSuggestions] = useState(props.data.acting.map(sugg => {
        return ({
            label: <Box pad="medium"><strong>{sugg.name}</strong></Box>,
            value: {name: sugg.name, id: sugg.id}
        })
    }))
    const [directing, setDirecting] = useState([{name: "", id: null}])
    const [directingSuggestions, setDirectingSuggestions] = useState(props.data.directing.map(sugg => {
        return ({
            label: <Box pad="medium"><strong>{sugg.name}</strong></Box>,
            value: {name: sugg.name, id: sugg.id}
        })
    }))
    const [companies, setCompanies] = useState([{name: "", id: null}])
    const [companySuggestions, setCompanySuggestions] = useState(props.data.companies.map(sugg => {
        return ({
            label: <Box pad="medium"><strong>{sugg.name}</strong></Box>,
            value: {name: sugg.name, id: sugg.id}
        })
    }))

    const submit = () => {
        try {
            setIsError()
            if(budget !== 0) {
                setResult({ fetched: null, isFetching: true })
                let creation_date = new Date()
                let acting_ids = acting.map(act => act.id)
                let directing_ids = directing.map(direct => direct.id)
                let companies_ids = companies.map(company => company.id)

                if(
                    acting_ids[0] &&
                    directing_ids[0] &&
                    companies_ids[0]
                ) {
                    const payload = {
                        used_budget: budget,
                        creation_date: creation_date.toISOString(),
                        acting: acting_ids,
                        directing: directing_ids,
                        companies: companies_ids
                    }
    
                    console.log(payload)
        
                    createCalculation(payload)
                        .then(res => {
                            if(res) {
                                console.log(res)
                                setResult({ fetched: res.createCalculation.calculation, isFetching: false })
                            } else {
                                setIsError("Something went wrong while fetching result data")
                                setResult({ fetched: null, isFetching: false })
                            }
                        })
                } else {
                    setIsError("Please fill out every input field")
                    setResult({ fetched: null, isFetching: false })
                }
            } else {
                setIsError("Please enter a budget greater than 0")
                setResult({ fetched: null, isFetching: false })
            }
        } catch(e) {
            setIsError("Something went wrong! Maybe check your input data!")
            console.error(e)
            setResult({ fetched: null, isFetching: false })
        }
    }

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const resetData = () => {
        setBudget(0)
        setActing([{name: "", id: null}])
        setDirecting([{name: "", id: null}])
        setCompanies([{name: "", id: null}])
        setResult({ fetched: null, isFetching: false })
        setIsError()
    }

    const handleActingInputChange = (index, event) => {
        if(!event.target.value.trim()) {
            setActingSuggestions(props.data.acting.map(sugg => {
                return ({
                    label: <Box pad="medium"><strong>{sugg.name}</strong></Box>,
                    value: {name: sugg.name, id: sugg.id}
                })
            }))
        } else {
            setActingSuggestions(actingSuggestions.filter(sugg => 
                sugg.value.name.toLowerCase().includes(event.target.value.toLowerCase()))
            )
        }
        let newActing = [...acting]
        newActing[index].name = event.target.value
        setActing(newActing)
    }

    const handleActingSelect = (index, event) => {
        let newActing = [...acting]
        newActing[index] = event.suggestion.value
        setActing(newActing)
    }

    const handleRemoveActingField = (index) => {
        let actingFields = [...acting]
        actingFields.splice(index, 1)
        setActing(actingFields)
    }

    const handleAddActingField = () => {
        let actingFields = [...acting]
        actingFields.push({ name: '', id: null })
        setActing(actingFields)
    }

    const handleDirectingInputChange = (index, event) => {
        if(!event.target.value.trim()) {
            setDirectingSuggestions(props.data.directing.map(sugg => {
                return ({
                    label: <Box pad="medium"><strong>{sugg.name}</strong></Box>,
                    value: {name: sugg.name, id: sugg.id}
                })
            }))
        } else {
            setDirectingSuggestions(directingSuggestions.filter(sugg => 
                sugg.value.name.toLowerCase().includes(event.target.value.toLowerCase()))
            )
        }
        let newDirecting = [...directing]
        newDirecting[index].name = event.target.value
        setDirecting(newDirecting)
    }

    const handleDirectingSelect = (index, event) => {
        let newDirecting = [...directing]
        newDirecting[index] = event.suggestion.value
        resetDirectingSuggestions()
        setDirecting(newDirecting)
    }

    const resetDirectingSuggestions = () => {
        setDirectingSuggestions(props.data.directing.map(sugg => {
            return ({
                label: <Box pad="medium"><strong>{sugg.name}</strong></Box>,
                value: sugg
            })
        }))
    }

    const handleRemoveDirectingField = (index) => {
        let directingFields = [...directing]
        directingFields.splice(index, 1)
        setDirecting(directingFields)
    }
    
    const handleAddDirectingField = () => {
        let directingFields = [...directing]
        directingFields.push({ name: '', id: null })
        setDirecting(directingFields)
    }

    const handleCompanyInputChange = (index, event) => {
        if(!event.target.value.trim()) {
            setCompanySuggestions(props.data.companies.map(sugg => {
                return ({
                    label: <Box pad="medium"><strong>{sugg.name}</strong></Box>,
                    value: {name: sugg.name, id: sugg.id}
                })
            }))
        } else {
            setCompanySuggestions(companySuggestions.filter(sugg => 
                sugg.value.name.toLowerCase().includes(event.target.value.toLowerCase()))
            )
        }
        let newCompany = [...companies]
        newCompany[index].name = event.target.value
        setCompanies(newCompany)
    }

    const handleCompanySelect = (index, event) => {
        let newCompany = [...companies]
        newCompany[index] = event.suggestion.value
        setCompanies(newCompany)
    }

    const resetCompanySuggestions = () => {
        setCompanySuggestions(props.data.companies.map(sugg => {
            return ({
                label: <Box pad="medium"><strong>{sugg.name}</strong></Box>,
                value: sugg
            })
        }))
    }

    const handleRemoveCompanyField = (index) => {
        let companyFields = [...companies]
        companyFields.splice(index, 1)
        setCompanies(companyFields)
    }
    
    const handleAddCompanyField = () => {
        let companyFields = [...companies]
        companyFields.push({ name: '', id: null })
        setCompanies(companyFields)
    }

    return (
        <Box height="91vh" align="center">
            <Box 
                width="large" 
                direction="column"
                align="center"
            >
                <Heading level="2">Revenue Calculator</Heading>
                <Box fill="horizontal" pad="medium">
                    <Heading margin="none" level="4">Budget</Heading>
                    <Box pad={{vertical: "small"}}>
                        <TextInput 
                            type="number"
                            onChange={e => setBudget(e.target.value)}
                            value={budget}
                        />
                    </Box>
                    <Heading margin="none" level="4">Acting</Heading>
                    {acting.map((actingField, index) => {
                        return(
                            <Box key={index} direction="row" gap="small" align="center" pad={{vertical: "small"}}>
                                <TextInput
                                    type="text"
                                    value={actingField.name}
                                    onChange={e => handleActingInputChange(index, e)}
                                    suggestions={actingSuggestions}
                                    onSelect={e => handleActingSelect(index, e)}
                                />
                                <Button
                                    plain={false}
                                    disabled={acting.length == 1 ? true : false}
                                    icon={<Trash />}
                                    onClick={() => handleRemoveActingField(index)}
                                />
                                <Button
                                    plain={false}
                                    icon={<AddCircle />}
                                    onClick={() => handleAddActingField()}
                                />
                            </Box>
                        )
                    })}
                    <Heading margin="none" level="4">Directing</Heading>
                    {directing.map((directingField, index) => {
                        return(
                            <Box key={index} direction="row" gap="small" align="center" pad={{vertical: "small"}}>
                                <TextInput
                                    type="text"
                                    value={directingField.name}
                                    onChange={e => handleDirectingInputChange(index, e)}
                                    suggestions={directingSuggestions}
                                    onSelect={e => handleDirectingSelect(index, e)}
                                    onSuggestionsClose={() => resetDirectingSuggestions()}
                                />
                                <Button
                                    plain={false}
                                    icon={<Trash />}
                                    disabled={directing.length == 1 ? true : false}
                                    onClick={() => handleRemoveDirectingField(index)}
                                />
                                <Button
                                    plain={false}
                                    icon={<AddCircle />}
                                    onClick={() => handleAddDirectingField()}
                                />
                            </Box>
                        )
                    })}
                    <Heading margin="none" level="4">Company</Heading>
                    {companies.map((companyField, index) => {
                        return(
                            <Box key={index} direction="row" gap="small" align="center" pad={{vertical: "small"}}>
                                <TextInput
                                    type="text"
                                    value={companyField.name}
                                    onChange={e => handleCompanyInputChange(index, e)}
                                    suggestions={companySuggestions}
                                    onSelect={e => handleCompanySelect(index, e)}
                                    onSuggestionsClose={() => resetCompanySuggestions()}
                                />
                                <Button
                                    plain={false}
                                    disabled={companies.length == 1 ? true : false}
                                    icon={<Trash />}
                                    onClick={() => handleRemoveCompanyField(index)}
                                />
                                <Button
                                    plain={false}
                                    icon={<AddCircle />}
                                    onClick={() => handleAddCompanyField()}
                                />
                            </Box>
                        )
                    })}
                    <Box fill="horizontal" direction="row" justify="center" pad={{vertical: "small"}}>
                        {result.fetched ? (
                            <Box>
                                <Heading level="3" margin="none">Calculated Revenue: {formatNumber(result.fetched.calculatedRevenue)}$</Heading>
                                <Button 
                                    primary
                                    onClick={() => resetData()}
                                    label="New Calculation"
                                />
                            </Box>
                        ) : (
                            result.isFetching ? (
                                <Loader size="component"/>
                            ) : (
                                <Button 
                                    primary
                                    reverse
                                    onClick={() => submit()}
                                    label="Create Calculation"
                                    icon={<ServicesIcon />}
                                />
                            )
                        )}
                    </Box>
                    {isError && (
                        <Text textAlign="center" color="status-critical">{isError}</Text>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default Home;