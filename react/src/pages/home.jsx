import React from 'react';
import {
    Switch,
    Route,
    useHistory,
    useRouteMatch
} from 'react-router-dom';

import {
    Box, 
    Heading,
    Collapsible
} from 'grommet';

import RevenueCalculator from './homepages/revenueCalc';
import PopularityCalculator from './homepages/popularityCalc';

const ClickBox = (props) => {
    const history = useHistory()

    return (
        <Box 
            fill="horizontal" 
            pad="small"
            onClick={() => history.push(`${props.url}/${props.path}`)}
            hoverIndicator={{color: "brand"}}
        >
            {props.name}
        </Box>
    )
}

const Home = (props) => {
    let {path, url} = useRouteMatch()

    return (
        <Box direction="row" justify="start" height="91vh">
            <Collapsible direction="horizontal" open={props.status}>
                <Box width="medium" background="background-contrast" fill="vertical">
                    <ClickBox 
                        name='Create Revenue Calculation' 
                        path='create-revenue-calc'
                        url={url}
                    />
                    <ClickBox 
                        name='Create Popularity Calculation'
                        path='create-popularity-calc'
                        url={url}
                    />
                </Box>
            </Collapsible>
            <Box margin={{left: "medium"}}>
                <Switch>
                    <Route exact path={path}>
                        <Heading level="5">This is the Clara Page!</Heading>
                    </Route>

                    <Route path={`${path}/create-revenue-calc`}>
                        <RevenueCalculator />
                    </Route>
                    <Route path={`${path}/create-popularity-calc`}>
                        <PopularityCalculator />
                    </Route>
                </Switch>
            </Box>
        </Box>
    )
}

export default Home;