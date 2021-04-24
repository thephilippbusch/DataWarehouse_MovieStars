import React from 'react';
import { useHistory } from 'react-router';

import {
    Footer as FooterComponent,
    Text,
    Anchor
} from 'grommet';

import {
    Github,
    PiedPiper
} from 'grommet-icons';

const Footer = () => {
    let history = useHistory()

    return(
        <FooterComponent background="background-back" height="3vh" width="100%" pad={{horizontal: "small"}}>
            <Text size="xsmall">v1.0.1 <PiedPiper size="small"/></Text>
            <Anchor 
                size="small"
                label="Impressum" 
                onClick={() => history.push("/impressum")}
                color="text-weak" 
                decoration="none"
            />
            <Anchor 
                size="small"
                label="GitHub" 
                target="_blank"
                href="https://github.com/thephilippbusch/DataWarehouse_MovieStars" 
                icon={<Github size="small" />} 
                color="text-weak" 
                decoration="none"    
            />
        </FooterComponent>
    )
}

export default Footer;