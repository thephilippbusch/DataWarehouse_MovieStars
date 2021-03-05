import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';

import {
    Header,
    Box,
    Avatar,
    RadioButtonGroup,
    DropButton,
    Anchor,
    Image
} from 'grommet';

import {
    UserFemale as UserFemaleIcon,
    Logout as LogoutIcon,
    User as UserIcon,
    Paint as ThemeIcon,
    Sun as SunIcon,
    Moon as MoonIcon,
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

const NavBarLink = styled(Link)`
    text-decoration: none;
    color: white;
    font-weight: bold;

    :hover {
        text-decoration: underline white;
        text-decoration-thickness: 3px;
    }
`;

const DropItems = (props) => {
    const [theme, setTheme] = useState(props.currentTheme);
    const history = useHistory();

    useEffect(() => {
        localStorage.setItem(`theme`, theme);
        props.setGlobalTheme(theme)
    }, [theme]);

    const handleLogout = () => {
        console.log(`Successfully logged out!`)
    }

    return(
        <Box gap="small" pad="small">
            <Box direction="row" justify="start" onClick={() => history.push('/profile')}>
                <Box pad="xsmall">
                    <UserIcon size="small"/>
                </Box>
                Profil
            </Box>
            <Box direction="row" justify="start" onClick={() => handleLogout()}>
                <Box pad="xsmall">
                    <LogoutIcon size="small"/>
                </Box>
                Logout
            </Box>
            <Box direction="row" justify="between">
                <Box pad="xsmall" direction="row" align="center" gap="xsmall" margin={{right: "medium"}}>
                    <ThemeIcon pad="xsmall" size="small"/>
                    Theme:
                </Box>
                <RadioButtonGroup
                    name="themeRadio"
                    direction="row"
                    gap="xsmall"
                    options={['light', 'dark']}
                    value={theme}
                    onChange={event => setTheme(event.target.value)}
                >
                    {(option, { checked, hover }) => {
                        const Icon = option === 'light' ? SunIcon : MoonIcon;
                        let background;
                        if (checked) background = 'brand';
                        else if (hover) background = 'light-4';
                        else background = 'light-2';
                        return (
                            <Box background={background} pad="xsmall">
                                <Icon />
                            </Box>
                        )
                    }}
                </RadioButtonGroup>
            </Box>
        </Box>
    )
}

const NavBar = (props) => {
    const[sidebarOpen, setSidebarOpen] = useState(props.sidebarStatus)

    return (
        <Header
            background="brand"
            height="6vh"
        >
            <Box margin={{left: "medium"}} direction="row" justify="start">
                <Box alignSelf="center" pad={{right: "small"}}>
                    {props.sidebarStatus ? (
                        <Anchor margin={{top: "xsmall"}}><CloseIcon onClick={() => props.setSidebarStatus(false)} /></Anchor>
                    ) : (
                        <Anchor margin={{top: "xsmall"}}><MenuIcon onClick={() => props.setSidebarStatus(true)} /></Anchor>
                    )}
                </Box>
                <Title><TitleLink to="/home">
                    <Box height="small" width="small">
                        <Image
                            fit="contain"
                            src="moviestars-logo.png"
                        />
                    </Box>
                </TitleLink></Title>
            </Box>
            <Box width="medium" pad={{horizontal: "medium"}}>
                <Box width="100%" direction="row" justify="between" align="center">
                    <NavBarLink to="/about">AboutYou</NavBarLink>
                    <NavBarLink to="/news">Neuigkeiten</NavBarLink>
                    <DropButton
                        dropAlign={{right: 'right', top: 'bottom'}}
                        dropContent={<DropItems currentTheme={props.currentTheme} setGlobalTheme={props.setGlobalTheme}/>}
                    >
                        <Avatar background="background-back">
                            <UserFemaleIcon color="accent-1"/>
                        </Avatar>
                    </DropButton>
                </Box>
            </Box>
        </Header>
    )
}

export default NavBar;