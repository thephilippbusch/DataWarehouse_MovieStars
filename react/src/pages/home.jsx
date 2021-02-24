import React from 'react';

import {
    Box,
    Heading,
    Text
} from 'grommet';

const Home = (props) => {
    const numFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'});

    return (
        <Box margin={{left: "medium"}}>
            <Heading margin="medium">Result:</Heading>
            <Box direction="row" justify="between" width="medium">
                <Box>
                    <Text margin={{vertical: "small"}}>Title:</Text>
                    <Text margin={{vertical: "small"}}>Budget:</Text>
                    <Text margin={{vertical: "small"}}>Revenue:</Text>
                </Box>
                <Box>
                    <Text margin={{vertical: "small"}} color="text-weak">{props.data.original_title}</Text>
                    <Text margin={{vertical: "small"}} color="text-weak">{numFormatter.format(props.data.budget)}</Text>
                    <Text margin={{vertical: "small"}} color="text-weak">{numFormatter.format(props.data.revenue)}</Text>
                </Box>
            </Box>
        </Box>
    )
}

export default Home;