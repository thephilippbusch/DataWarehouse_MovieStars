import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';

import {
    Header,
    Box,
    Avatar,
    DropButton,
    Select,
    Text
} from 'grommet';

import {
    UserFemale as UserFemaleIcon,
    Logout as LogoutIcon,
    User as UserIcon,
    Paint as ThemeIcon
} from 'grommet-icons';

const Title = styled.h2`
    margin: none;
    letter-spacing: 7px;
    color: white;
    align-items: center;

    .link {
        text-decoration: none;
        color: white;
    }
`;

const LinkBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .link {
        text-decoration: none;
        color: white;
        font-weight: bold;

        :hover {
            text-decoration: underline white;
            text-decoration-thickness: 3px;
        }
    }
`;

const NavBar = (props) => {
    const [theme, setTheme] = useState(props.currentTheme);
    const history = useHistory();

    const toggleTheme = (option) => {
        console.log(option);
        setTheme(option);
        props.setGlobalTheme(option);
    }

    return (
        <Header
            background="brand"
            height="6vh"
        >
            <Box margin={{left: "medium"}}>
                <Title><Link className="link" to="/home">MOVIESTARS</Link></Title>
            </Box>
            <Box width="medium" pad={{horizontal: "medium"}}>
                <LinkBox>
                    <Link className="link" to="/about">About</Link>
                    <Link className="link" to="/news">News</Link>
                    <DropButton 
                        dropAlign={{right: 'right', top: 'bottom'}}
                        label={
                            <Avatar background="background-back" onClick={() => console.log("Hello!")}>
                                <UserFemaleIcon color="accent-4"/>
                            </Avatar>
                            }
                        hoverIndicator={false}
                        dropContent={
                            <Box width="280px" pad="small" gap="small">
                                <Box 
                                    direction="row"
                                    justify="start"
                                    alignSelf="start"
                                    pad={{right: "small"}}
                                    onClick={() => {
                                        history.push('/profile');
                                    }}
                                >
                                    <Box pad="xsmall">
                                        <UserIcon size="small"/>
                                    </Box>
                                    Profil
                                </Box>
                                <Box 
                                    direction="row"
                                    justify="start"
                                    alignSelf="start" 
                                    pad={{right: "small"}} 
                                    onClick={() => {
                                        history.push('/profile');
                                    }}
                                >
                                    <Box pad="xsmall">
                                        <LogoutIcon size="small"/>
                                    </Box>
                                    Logout
                                </Box>
                                <Box 
                                    direction="row"
                                    justify="start"
                                    alignSelf="start"
                                    pad={{right: "small"}}
                                    align="center"
                                >
                                    <Box pad="xsmall">
                                        <ThemeIcon size="small"/>
                                    </Box>
                                    Theme:
                                    <Select
                                        plain
                                        size="medium"
                                        options={['dark', 'light']}
                                        value={theme}
                                        onChange={({ option }) => toggleTheme(option)}
                                    />
                                </Box>
                            </Box>
                        }
                    >
                    </DropButton>
                </LinkBox>
            </Box>
        </Header>
    )
}

export default NavBar;