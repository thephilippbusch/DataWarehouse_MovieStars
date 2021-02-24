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

const Loader = (props) => { 

    return (props.size === 'fullscreen') && (
        <FullScreen>
            <CircularProgress />
        </FullScreen>
    )
}

export default Loader;