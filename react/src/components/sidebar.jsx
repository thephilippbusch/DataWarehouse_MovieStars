import React, { useEffect } from 'react';

import {
    Heading,
    Sidebar,
    Collapsible
} from 'grommet';

const SideBar = (props) => {

    useEffect(() => {
        console.log(props.status)
    }, [props.status]);

    return(
        <Collapsible direction="horizontal" open={props.status}>
            <Sidebar width="medium" height="100%" background="background-front"
                header={
                    <Heading margin="none">Sidebar</Heading>
                }
            >
                <Heading margin="none" level="5">I'm a Sidebar Item</Heading>
            </Sidebar>
        </Collapsible>
    )
}

export default SideBar;