import React, { useState, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import styled from 'styled-components';
import { Grommet, Main as MainContent } from 'grommet';
import { global } from './styles/globalStylings';

import LoadHome from './loader/loadHome';
import Profile from './pages/profile';

import Login from './pages/login';
import Loader from './components/loader';
import NavBar from './components/navbar';
import SideBar from './components/sidebar';
import Footer from './components/footer';

import { AuthContext } from './auth/auth';
// import PrivateRoute from './auth/privateRoute';

import ManageDB from './pages/manage';
import Search from './pages/search';

// const LoadHome = lazy(() => import('./loader/loadHome'))
// const Profile = lazy(() => import('./pages/profile'))

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
  const [themeSetting, setThemeSetting] = useState(
    localStorage.getItem(`theme`) ? localStorage.getItem(`theme`) : `light`
  );
  const [sidebarStatus, setSidebarStatus] = useState(false);

  const existingToken = localStorage.getItem('token');
  const [authToken, setAuthToken] = useState(existingToken);

  const setToken = (data) => {
    localStorage.setItem('token', data);
    setAuthToken(data);
  }

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken: setToken }}>
      <Grommet theme={global} themeMode={themeSetting}>
        <Router>
          <Route path='/:page' render={({ match }) => 
            <NavBar 
              page={match}
              sidebarStatus={sidebarStatus}
              setSidebarStatus={status => setSidebarStatus(status)}
            />
          }>
            
          </Route>

          <MainContainer >
            <Route path='/:page' render={({ match }) => <SideBar page={match} setSidebarStatus={status => setSidebarStatus(status)}/>}/>
            <MainContent>
              <Suspense fallback={() => <Loader />}>
                <Switch>
                  <Route path='/login'><Login /></Route>
                  {/* <PrivateRoute path="/profile" component={Profile}/> */}
                  <Route path='/profile'>
                    <Profile
                      currentTheme={themeSetting}
                      setGlobalTheme={option => setThemeSetting(option)}
                    />
                  </Route>
                  <Route path='/manage'><ManageDB status={sidebarStatus}/></Route>
                  <Route path='/search'><Search status={sidebarStatus}/></Route>
                  <Route path='/home'><LoadHome status={sidebarStatus}/></Route>
                  <Route exact path='/'><Redirect to='/home'/></Route>
                </Switch>
              </Suspense>
            </MainContent>
          </MainContainer>

          <Footer />
        </Router>
      </Grommet>
    </AuthContext.Provider>
  );
}

export default Main;
