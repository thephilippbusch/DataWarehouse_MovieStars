import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import {
    Header,
    Box,
    Anchor,
    Image
} from 'grommet';

import {
    Menu as MenuIcon,
    Close as CloseIcon
} from 'grommet-icons';

const Title = styled.h2`
    margin: none;
    letter-spacing: 7px;
    color: white;
    align-items: center;
`;

const TitleLink = styled(Link)`
    text-decoration: none;
    color: white;
`;

const NavBar = (props) => {

    return (
        <Header
            background="background-front"
            height="6vh"
        >
            <Box direction="row" justify="start">
                <Box alignSelf="center" width="xsmall" direction="row" justify="center" alig="center">
                    {props.sidebarStatus ? (
                        <Anchor margin={{top: "xsmall"}}><CloseIcon onClick={() => props.setSidebarStatus(false)} /></Anchor>
                    ) : (
                        <Anchor margin={{top: "xsmall"}}><MenuIcon onClick={() => props.setSidebarStatus(true)} /></Anchor>
                    )}
                </Box>
                <Title>
                    <TitleLink to="/home">
                        <Box height="small" width="small">
                            <Image
                                fit="contain"
                                src="moviestars-logo.png"
                            />
                        </Box>
                    </TitleLink>
                </Title>
            </Box>
            <Box width="medium" pad={{horizontal: "medium"}}>
                
            </Box>
        </Header>
    )
}

export default NavBar;