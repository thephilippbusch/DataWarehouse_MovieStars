import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import styled from 'styled-components';

import LoadHome from './loader/loadHome';
import NavBar from './components/navbar';
import About from './pages/about'

const MainContainer = styled.div`
  height: 90vh;
  width: 100%;
  overflow: scroll;
`;

const Main = () => {

  return (
    <Router>
      <NavBar />

      <MainContainer>
        <Switch>
          <Route exact path="/">
            <LoadHome />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
      </MainContainer>
    </Router>
  );
}

export default Main;
