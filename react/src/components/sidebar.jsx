import React, { useEffect } from 'react';

import {
    Heading,
    Sidebar,
    Collapsible,
    Box,
    Anchor,
    Avatar
} from 'grommet';

import {
    AddCircle as AddIcon,
    Trash as TrashIcon,
    Calculator as CalcIcon,
    UserFemale as UserFemaleIcon
} from 'grommet-icons';

const SideBar = (props) => {

    return(
        <Box direction="row" justify="start">
            <Box background="background-front" direction="column" fill="vertical" justify="between">
                <Box>
                    <Box width="xsmall" height="xsmall" justify="center" align="center">
                        <Anchor onClick={() => console.log("Calculate Movie outcome")}><CalcIcon color="brand"/></Anchor>
                    </Box>
                    <Box width="xsmall" height="xsmall" justify="center" align="center">
                        <Anchor onClick={() => console.log("Add Element")}><AddIcon color="brand"/></Anchor>
                    </Box>
                    <Box width="xsmall" height="xsmall" justify="center" align="center">
                        <Anchor onClick={() => console.log("Delete Element")}><TrashIcon color="brand"/></Anchor>
                    </Box>
                </Box>
                <Box>
                    <Box width="xsmall" height="xsmall" justify="center" align="center">
                        <Avatar background="background-back">
                            <UserFemaleIcon color="accent-1"/>
                        </Avatar>
                    </Box>
                </Box>
            </Box>
            <Collapsible direction="horizontal" open={props.status}>
                <Sidebar width="medium" pad="none" background="background-front">
                    <Box height="xsmall" justify="center" align="start">
                        <Anchor onClick={() => console.log("Calculate Movie outcome")}>Moviestar Evaluator</Anchor>
                    </Box>
                    <Box height="xsmall" justify="center" align="start">
                        <Anchor onClick={() => console.log("Add Objects to the Database")}>Add Objects</Anchor>
                    </Box>
                    <Box height="xsmall" justify="center" align="start">
                        <Anchor onClick={() => console.log("Delete Objects from the Database")}>Remove Objects</Anchor>
                    </Box>
                </Sidebar>
            </Collapsible>
        </Box>
    )
}

export default SideBar;