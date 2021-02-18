import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavBarContainer = styled.div`
    width: 100%;
    height: 10vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(0, 60, 0);
`;

const TitleContainer = styled.div`
    width: 30%;

    .titleLink {
        margin-left: 50px;
        letter-spacing: 0.8em;
        font-family: helvetica, Verdana;
        font-size: 20px;
        font-weight: bold;
        color: white;
        text-decoration: none;
    }
`;

const LinkContainer = styled.div`
    width 70%;
    display: flex;
    justify-content: flex-end;
    
    ul {
        .linkItem {
            margin: 0px 10px 0px 10px;

            a {
                text-decoration: none;
                color: white;
                font-size: 15px;
                font-family: helvetica, Verdana;
            }

            a:hover {
                color: white;
            }
        }
    }
`;

const NavBar = () => {

    return (
        <NavBarContainer >
            <TitleContainer>
                <Link to="/">Moviestars</Link>
            </TitleContainer>
            <LinkContainer>
                <ul>
                    <li className="linkItem"><Link to="/">Home</Link></li>
                    <li className="linkItem"><Link to="/about">About</Link></li>
                </ul>
            </LinkContainer>
        </NavBarContainer>
    )
}

export default NavBar;