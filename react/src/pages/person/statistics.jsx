import React, { useEffect, useState } from 'react'

import { 
    Box,
    Heading,
    Text,
    Meter,
    Stack,
    DataTable
} from 'grommet'

const PopularityMeter = (props) => {
    const [active, setActive] = useState(0)
    const [label, setLabel] = useState('')
    const [popValues, setPopValues] = useState()
    const [popAverage, setPopAverage] = useState()
    const [popTotal, setPopTotal] = useState()

    useEffect(() => {
        let vals = props.movies.map(movie => {
            return movie.popularity
        })
        let valObjects = props.movies.map(movie => {
            return {
                value: Math.round(movie.popularity * 100) / 100,
                onHover: over => {
                    setActive(over ? Math.round(movie.popularity * 100) / 100 : 0);
                    setLabel(over ? movie.title : undefined);
                }
            }
        })
        const average = list => list.reduce((prev, curr) => prev + curr) / list.length

        setPopAverage(Math.round(average(vals) * 100) / 100)
        setPopTotal(Math.round(vals.reduce((a, b) => a + b, 0) * 100) / 100)
        setPopValues(valObjects)
    }, [props.movies])

    return (
        <Box background="background-contrast" >
            <Heading level="4" margin="small">Popularity Scores by Movie:</Heading>
            <Box 
                align="center"
                pad="small"
            >
                {popValues && (
                    <Stack anchor="center">
                        <Meter
                            type="circle"
                            values={popValues}
                            max={popTotal}
                            size="medium"
                            thickness="large"
                        />
                        <Box align="center">
                            <Box direction="row" align="center" pad={{ bottom: 'xsmall' }}>
                                <Text size="xxlarge" weight="bold">
                                    {active || popAverage}
                                </Text>
                            </Box>
                            <Text textAlign="center">{label || 'Average'}</Text>
                        </Box>
                    </Stack>
                )}
            </Box>
        </Box>
    )
}

const VotingTable = (props) => {
    const movieData = props.movies
    const [tableData, setTableData] = useState()

    const columns = [
        {
            property: 'title',
            header: <Text weight="bold">Title</Text>,
            primary: true,
            footer: 'Average'
        },
        {
            property: 'voteCount',
            header: <Text weight="bold">Vote Count</Text>,
            align: 'end',
            primary: false
        },
        {
            property: 'voteAverage',
            header: <Text weight="bold">Vote Average</Text>,
            render: val => (
                <Text>{Math.round(val.voteAverage * 10) / 10}</Text>
            ),
            align: 'end',
            sortable: true,
            primary: false,
            aggregate: "avg",
            footer: {"aggregate": true}
        }
    ];

    useEffect(() => {
        let data = props.movies.filter(movie => movie.voteCount !== 0).map(movie => {
            return {
                title: movie.title,
                voteAverage: Math.round(movie.vote * 10) / 10,
                voteCount: movie.voteCount
            }
        })
        console.log(data)
        setTableData(data)
    }, [props.movies])

    return movieData && (
        <Box background="background-contrast" >
            <Heading level="4" margin="small">TMDB Votes per Movie:</Heading>
            <Box 
                align="center"
                pad="small"
            >
                {tableData && (
                    <DataTable
                        columns={columns}
                        data={tableData}
                        sortable={true}
                    />
                )}
            </Box>
        </Box>
    )
}

const FinanceBarCharts = (props) => {
    const [chartValues, setChartValues] = useState()
    let theme = localStorage.getItem('theme')

    useEffect(() => {
        let values = []
        let budgetList = []
        let revenueList = []
        props.movies.map(movie => {
            if(movie.budget > 0 && movie.revenue > 0) {
                budgetList.push(movie.budget)
                revenueList.push(movie.revenue)
                values.push({
                    budget: movie.budget,
                    revenue: movie.revenue,
                    label: movie.title
                })
            }
        })
        const average = list => list.reduce((prev, curr) => prev + curr) / list.length

        values.push({
            budget: Math.round(average(budgetList)),
            revenue: Math.round(average(revenueList)),
            label: "Average"
        })
        setChartValues(values)
    }, props.movies)

    const getBarWidth = (val, comp) => {
        let width = val > comp ? 1 : val/comp
        return `${Math.round(width * 100)}%`
    }

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return (
        <Box 
            fill="horizontal"
            background="background-contrast" 
            direction="column" 
            align="start"
        >   
            <Heading level="4" margin="small">Budget/Revenue of most popular movies:</Heading>
            {chartValues && (
                chartValues.map((chartValue, index) => {
                    let border = index === (chartValues.length - 1) ? {side: "top", size: "medium", color: "black"} : null
                    return (
                        <Box 
                            fill="horizontal"
                            direction="column" 
                            align="start" 
                            pad="xsmall"
                            
                            border={border}
                            key={index}
                        >
                            <Text weight="bold" level="4" margin={{vertical: "xsmall"}}>{chartValue.label}</Text>
                            <Box direction="row" justify="start" align="center" fill="horizontal" pad={{horizontal: "small"}}>
                                <Box width="small">Budget:</Box>
                                <Box fill="horizontal">
                                    <Box 
                                        width={getBarWidth(chartValue.budget, chartValue.revenue)} 
                                        background="neutral-4" 
                                    >
                                        <Text margin={{horizontal: "small"}} color={theme === 'dark' ? "text" : "background"}>{formatNumber(chartValue.budget)}$</Text>
                                    </Box>
                                </Box>
                            </Box>
                            <Box direction="row" justify="start" align="center" fill="horizontal" pad={{horizontal: "small"}}>
                                <Box width="small">Revenue:</Box>
                                <Box fill="horizontal">
                                    <Box 
                                        width={getBarWidth(chartValue.revenue, chartValue.budget)} 
                                        background="neutral-1"
                                    >
                                        <Text margin={{horizontal: "small"}} color={theme === 'dark' ? "text" : "background"}>{formatNumber(chartValue.revenue)}$</Text>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )
                })
            )}
        </Box>
    )
}

const PersonStatistics = (props) => {
    const movieData = props.data

    return movieData && (
        <Box fill="horizontal" direction="row" gap="small">
            <Box width="50%">
                <FinanceBarCharts movies={movieData}/>
            </Box>
            <Box width="50%">
                <Box fill direction="column" gap="small">
                    <PopularityMeter movies={movieData}/>
                    <VotingTable movies={movieData}/>
                </Box>
            </Box>
            
        </Box>
    )
}

export default PersonStatistics