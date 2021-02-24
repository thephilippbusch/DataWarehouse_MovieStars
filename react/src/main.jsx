import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import styled from 'styled-components';
import { Grommet } from 'grommet';
import { global } from './styles/globalStylings';

import LoadHome from './loader/loadHome';
import NavBar from './components/navbar';
import About from './pages/about';
import SideBar from './components/sidebar';
import Footer from './components/footer';

const MainContainer = styled.div`
  height: 91vh;
  width: 100%;
  overflow: auto;
  display: flex;
  justify-content: flex-start;
  margin: 0px;
  padding: 0px;
`;

const Main = () => {

  return (
    <Grommet theme={global}>
      <Router>
        <NavBar />
        
        <MainContainer>
          <SideBar />

          <Switch>
            <Route exact path="/">
              <LoadHome />
            </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
        </MainContainer>

        <Footer />
      </Router>
    </Grommet>
  );
}

export default Main;
