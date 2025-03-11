import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons'; 
import './Recipeoftheday.css';

const RecipeFromRapid = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the local JSON file from the public folder
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/data/recipeRapid.json');  // path to the local JSON file in the public folder
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("API Response (from local file):", result);

        // Check if result.results is an array before setting it
        if (Array.isArray(result.results)) {
          const firstThreeRecipes = result.results.slice(0, 4);
          setRecipes(firstThreeRecipes); // Update state with the first 4 recipes

        } else {
          setRecipes([]); // If not an array, set as empty
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError(error.message); // Update error state if fetch fails
      }
    };

    fetchRecipes(); // Call the async function when the component mounts
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p> 
      ) : (
        <div>
        <h2 className="topBar">Blue Leaf Recipes</h2>
        <section className="text-center mt-5" >
          <h2 className="title topSpacing">Recipes of the Day</h2>
        </section>
          
        <section className="meals mt-3">
          {recipes && recipes.length > 0 ? (
            recipes.map((meal) => (
              <div key={meal.id} className="recipe">
                <div className="container">
                <div className="row mt-5">
                    
                  <div className="image-container mt-2 mb-5">
                    <img className="img-fluid" src={meal.thumbnail_url} alt={meal.title}></img>
                    {/* <button className="button">Click Me!</button> */}
                    <Link to={`/recipe/${meal.id}`} className="button title">{meal.name}</Link>
                  </div>
                  <div className="col-6">
                      <Link to={`/recipe/${meal.id}`} className="moreSaveBtns button">More Like This</Link>
                    </div>
                    <div className="col-6 text-end"><Link to={`/recipe/${meal.id}`} className="button">
                      <FontAwesomeIcon icon={faHeart} /></Link></div>
                    </div>
                </div>
              </div>
            ))
          ) : (
            <p>No recipes available</p> 
          )}
        </section>
        </div>
      )}
    </div>
  );
};

export default RecipeFromRapid;
