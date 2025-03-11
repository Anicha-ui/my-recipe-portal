import React from 'react';
import './App.css';
//import RecipeoftheDay from './Recipeoftheday.js';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeFromRapid from './RecipeFromRapid'; // Your recipe list component
import RecipeDetails from './RecipeDetails';   // The new page to show details
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

// function App() {

//   return (
//     <div className="App">
//       <h1 className="topBar">Blue Leaf Recipes</h1>
//       <section>
//         {/* { <RecipeoftheDay/> } */}
//         {<RecipeFromRapid/> }
//       </section>
//     </div>
//   );
// };
function App() {

  return (
    <Router>
      
      <Routes>
        {/* Route for listing recipes */}
        <Route path="/" element={<RecipeFromRapid/>} />
        
        {/* Route for individual recipe details */}
        <Route path="/recipe/:id" element={<RecipeDetails/>} />
      </Routes>
    </Router>
  );
}
export default App;
