import React, { useEffect, useState } from 'react' 
import { useHistory } from 'react-router-dom'

import {
    Box,
    Avatar,
    RadioButtonGroup
} from 'grommet';

import {
    UserFemale as UserFemaleIcon,
    Home as HomeIcon,
    Server as ServerIcon,
    Search as SearchIcon
} from 'grommet-icons';

const SideBar = (props) => {
    const [selectedPage, setSelectedPage] = useState(props.page)
    const history = useHistory();

    useEffect(() => {
        setSelectedPage(props.page.params.page)
    }, [props.page])

    return(
        <Box background="background-front" direction="column" fill="vertical" justify="between" width="xsmall">
            <Box>
                <RadioButtonGroup
                    name="themeRadio"
                    direction="column"
                    options={['home', 'manage', 'search']}
                    gap="none"
                    value={selectedPage}
                    onChange={event => setSelectedPage(event.target.value)}
                >
                    {(option, { checked, hover }) => {
                        let background;
                        if (checked) background = 'brand';
                        else if (hover) background = 'background-back';
                        else background = 'background-front';
                        return (
                            <Box 
                                background={background}
                                width="xsmall" 
                                height="xsmall" 
                                justify="center" 
                                align="center"
                                onClick={() => {
                                    history.push(`/${option}`)
                                    props.setSidebarStatus(false)
                                }}
                            >
                                {option === 'home' && <HomeIcon />}
                                {option === 'manage' && <ServerIcon />}
                                {option === 'search' && <SearchIcon />}
                            </Box>
                        )
                    }}
                </RadioButtonGroup>
            </Box>
            <Box>
                <Box width="xsmall" height="xsmall" justify="center" align="center">
                    <Avatar 
                        background="background-back" 
                        size="medium"
                        hoverIndicator={{color: "brand"}} 
                        onClick={() => history.push('/profile')}
                    >
                        <UserFemaleIcon color="text"/>
                    </Avatar>
                </Box>
            </Box>
        </Box>
    )
}

export default SideBar;