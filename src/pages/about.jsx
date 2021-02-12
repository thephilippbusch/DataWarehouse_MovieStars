import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
    width: 100%;
    diplay: flex;
    justify-content: center;
    align-items: center;

    .contentDiv {
        padding: 15px;
        display: flex;
        justify-content: flex-start;
        background-color: rgb(230, 230, 230);

        p {
            margin: 5px 0px 5px 0px;
        }
    }
`;

const About = () => {

    return (
        <AboutContainer>
            <p>This is an About page!</p>
        </AboutContainer>
    )
}

export default About;