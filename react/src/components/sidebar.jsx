import React from 'react';

import {
    Heading,
    Sidebar
} from 'grommet';

const SideBar = () => {


    return(
        <Sidebar width={{max: "medium", min: "15%"}} height="100%" background="background-front"
            header={
                <Heading margin="none">Sidebar</Heading>
            }
        >
            <Heading margin="none" level="5">I'm a Sidebar Item</Heading>
        </Sidebar>
    )
}

export default SideBar;