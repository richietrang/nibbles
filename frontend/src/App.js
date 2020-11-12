import React from 'react';
import { BrowserRouter, Router, Route, Switch } from 'react-router-dom';
import history from './history';
import './App.css';
import HomePage from './pages/HomePage';
import SavedRecipesPage from './pages/SavedRecipesPage';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Router history={history}>
          <Switch>
            <Route path='/' exact component={HomePage} />
            <Route path='/saved-recipes' component={SavedRecipesPage} />
          </Switch>
        </Router>
      </div>
    </BrowserRouter>
  );
}

export default App;
