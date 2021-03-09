import React from 'react';

import { 
    Heading,
    Box,
    Collapsible
} from 'grommet';
import {
    Route,
    Switch,
    useHistory,
    useRouteMatch
} from 'react-router';

import AddActing from './managepages/addActing';
import UpdateActing from './managepages/updateActing';

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

const ManageDB = (props) => {
    let {path, url} = useRouteMatch();

    return (
        <Box direction="row" justify="start" height="91vh">
            <Collapsible direction="horizontal" open={props.status}>
                <Box width="medium" background="background-contrast" fill="vertical">
                    <ClickBox 
                        name='Add new Acting' 
                        path='add-acting'
                        url={url}
                    />
                    <ClickBox 
                        name='Update Acting'
                        path='update-acting'
                        url={url}
                    />
                </Box>
            </Collapsible>
            <Box margin={{left: "medium"}}>
                <Switch>
                    <Route exact path={path}>
                        <Heading level="5">On this page you can Manage the DB!</Heading>
                    </Route>

                    <Route path={`${path}/add-acting`}>
                        <AddActing />
                    </Route>
                    <Route path={`${path}/update-acting`}>
                        <UpdateActing />
                    </Route>
                </Switch>
            </Box>
        </Box>
    )
}

export default ManageDB;