import React , {useState, useCallback} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { ColorContext } from './context/colorcontext'
import Onboard from './onboard/onboard'
import Navbar from './onboard/Navbar'
import ChessGame from './chess/ui/chessgame'
import Footer from './onboard/Footer';


function App() {

  const [didRedirect, setDidRedirect] = useState(false);
  const [userName, setUserName] = useState('');

  const playerDidRedirect = useCallback(() => {
    setDidRedirect(true)
  }, [])

  const playerDidNotRedirect = useCallback(() => {
    setDidRedirect(false)
  }, [])

  return (
    <ColorContext.Provider value = {{didRedirect: didRedirect, playerDidRedirect: playerDidRedirect, playerDidNotRedirect: playerDidNotRedirect}}>
      <Router>
        <Switch>
          <Route path = "/" exact>
            <Onboard setUserName = {setUserName}/>
          </Route>
          <Route path = "/game/:gameid" exact>
            {
            didRedirect ? 
              <React.Fragment>
                    <Navbar userName = {userName} isCreator ={true} />
                    <ChessGame myUserName = {userName} />
                    <Footer />
              </React.Fragment> 
              :
              <React.Fragment>
                <Navbar userName = {userName} isCreator ={false} />
                <ChessGame myUserName = {userName}/>
                <Footer />
              </React.Fragment>
            }
          </Route>
          <Redirect to = "/" />
        </Switch>
      </Router>
    </ColorContext.Provider>);
}

export default App;
