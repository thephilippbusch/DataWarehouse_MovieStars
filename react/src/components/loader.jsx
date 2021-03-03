import React from 'react';
import styled from 'styled-components';
import Spinner from './spinner';

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
                    <Spinner />
                </FullScreen>
            )
        case 'component':
            return(
                <ComponentSize>
                    <Spinner />
                </ComponentSize>
            )
        default:
            return(
                <ComponentSize>
                    <Spinner />
                </ComponentSize>
            )
    }
}

export default Loader;