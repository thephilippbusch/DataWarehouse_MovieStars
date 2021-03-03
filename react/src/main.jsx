import React, { useState } from 'react';
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
import News from './pages/news';
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
  const [themeSetting, setThemeSetting] = useState('light');

  return (
    <Grommet theme={global} themeMode={themeSetting}>
      <Router>
        <NavBar currentTheme={themeSetting} setGlobalTheme={option => setThemeSetting(option)}/>
        
        <MainContainer>
          <SideBar />

          <Switch>
            <Route exact path="/">
              <LoadHome />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/news">
              <News />
            </Route>
          </Switch>
        </MainContainer>

        <Footer />
      </Router>
    </Grommet>
  );
}

export default Main;
