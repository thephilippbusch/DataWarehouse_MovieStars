import React from 'react';

import { 
    Heading,
    Box,
    Collapsible,
    RadioButtonGroup
} from 'grommet';
import {
    Route,
    Switch,
    useHistory,
    useRouteMatch,
} from 'react-router';

import ManagePeople from './managepages/managePeople';
import ManageCompanies from './managepages/manageCompanies';
import {
    Group as GroupIcon,
    Services as ServicesIcon
} from 'grommet-icons';

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
    let history = useHistory();

    return (
        <Box direction="row" justify="start" height="91vh" overflow={{horizontal: "scroll"}}>
            <Collapsible direction="horizontal" open={props.status}>
                <Box width="medium" background="background-contrast" fill="vertical">
                    <ClickBox 
                        name='Manage People' 
                        path='people'
                        url={url}
                    />
                    <ClickBox 
                        name='Manage Companies'
                        path='companies'
                        url={url}
                    />
                </Box>
            </Collapsible>
            <Box fill>
                <Switch>
                    <Route exact path={path}>
                        <RadioButtonGroup
                            name="manageRadio"
                            direction="row"
                            options={['people', 'companies']}
                            gap="medium"
                            pad="medium"
                        >
                            {(option, { checked, hover }) => {
                                let background;
                                if (checked) background = 'brand';
                                else if (hover) background = 'brand';
                                else background = 'background-front';
                                return (
                                    <Box
                                        width="300px" 
                                        height="300px" 
                                        border="all" 
                                        align="center" 
                                        justify="center"
                                        background={background}
                                        onClick={() => history.push(`${url}/${option}`)}
                                    >
                                        {option === 'people' && (
                                            <Box direction="column" justify="center" align="center">
                                                <GroupIcon size="large"/>
                                                <Heading level="4" margin="none">Manage People</Heading>  
                                            </Box>
                                        )}
                                        {option === 'companies' && (
                                            <Box direction="column" justify="center" align="center">
                                                <ServicesIcon size="large"/>
                                                <Heading level="4" margin="none">Manage Companies</Heading>  
                                            </Box>
                                        )}
                                    </Box>
                                    // <Box 
                                    //     background={background}
                                    //     width="xsmall" 
                                    //     height="xsmall" 
                                    //     justify="center" 
                                    //     align="center"
                                    //     onClick={() => {
                                    //         console.log()
                                    //     }}
                                    // >
                                    //     {option === 'home' && 
                                    //         <HomeIcon />
                                    //     }
                                    //     {option === 'manage' && <DatabaseIcon />}
                                    //     {option === 'search' && <SearchIcon />}
                                    // </Box>
                                )
                            }}
                        </RadioButtonGroup>
                        {/* <Box fill pad="medium" gap="medium" direction="row" justify="start">
                            <Box 
                                width="300px" 
                                height="300px" 
                                border="all" 
                                align="center" 
                                justify="center"
                            >
                                <Box direction="column" justify="center">
                                    <ServicesIcon size="large"/>
                                </Box>
                            </Box>
                            <Box
                                width="300px" 
                                height="300px" 
                                border="all" 
                                align="center" 
                                justify="center"
                                onClick={() => history.push(`${props.url}/${props.path}`)}
                            >
                                <Box direction="column" justify="center" align="center" hoverIndicator={{}}>
                                    <GroupIcon size="large"/>
                                    <Heading level="4" margin="none">Manage People</Heading>
                                </Box>
                            </Box>
                        </Box> */}
                    </Route>

                    <Route path={`${path}/people`}>
                        <ManagePeople />
                    </Route>
                    <Route path={`${path}/companies`}>
                        <ManageCompanies />
                    </Route>
                </Switch>
            </Box>
        </Box>
    )
}

export default ManageDB;