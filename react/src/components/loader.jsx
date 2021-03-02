import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';

const FullScreen = styled.div`
    width: 100%;
    height: 91vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ComponentSize = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Loader = (props) => { 

    switch(props.size) {
        case 'fullscren':
            return(
                <FullScreen>
                    <CircularProgress />
                </FullScreen>
            )
        case 'component':
            return(
                <ComponentSize>
                    <CircularProgress />
                </ComponentSize>
            )
        default:
            return(
                <ComponentSize>
                    <CircularProgress />
                </ComponentSize>
            )
    }
}

export default Loader;