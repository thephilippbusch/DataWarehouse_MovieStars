import React from 'react';

import {
    Route,
    Switch,
    useHistory,
    useRouteMatch
} from 'react-router-dom';

import { 
    Heading,
    Box,
    Collapsible,
 } from 'grommet';

import SearchAll from './searchpages/searchAll';
import SearchActing from './searchpages/searchActing';

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

const Search = (props) => {
    let {path, url} = useRouteMatch()

    return (
        <Box direction="row" justify="start" height="91vh">
            <Collapsible direction="horizontal" open={props.status}>
                <Box width="medium" background="background-contrast" fill="vertical">
                    <ClickBox 
                        name='Search All' 
                        path='search-all'
                        url={url}
                    />
                    <ClickBox 
                        name='Search Acting'
                        path='search-acting'
                        url={url}
                    />
                </Box>
            </Collapsible>
            <Box margin={{left: "medium"}}>
                <Switch>
                    <Route exact path={path}>
                        <Heading level="5">On this page you can Search the DB!</Heading>
                    </Route>

                    <Route path={`${path}/search-all`}>
                        <SearchAll />
                    </Route>
                    <Route path={`${path}/search-acting`}>
                        <SearchActing />
                    </Route>
                </Switch>
            </Box>
        </Box>
    )
}

export default Search;