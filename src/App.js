import {React} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
//import RecipeoftheDay from './Recipeoftheday.js';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeFromAPICall from './RecipeFromAPICall'; // Your recipe list component
import RecipeDetailsFromAPICall from './RecipeDetailsFromAPICall';   // The new page to show details
import ImageLogo  from './assets/blueLeaf_logo03.png';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          
          {/* Route for listing recipes */}
          <Route path="/" element={<RecipeFromAPICall/>} />
          
          {/* Route for individual recipe details */}
          <Route path="/recipe/:id" element={<RecipeDetailsFromAPICall/>} />
        </Routes>
    </div>
    
    </Router>
  );
}
export default App;
