import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Inscription from './Inscription/Inscription';
import Connexion from './Connexion/Connexion';
import Intranet from './Intranet/Intranet';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">

        <Switch>
          
          <Route path="/dashboard" component={Intranet} />
          <Route exact path="/" component={Connexion} /> />
          <Route exact path="/inscription" component={Inscription} />
        </Switch>

      </div>
    </Router>
  );
}

export default App;
