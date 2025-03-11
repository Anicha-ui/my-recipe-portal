import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // to get the recipe id from URL params
import './App.css';
import './Recipeoftheday.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecipeDetails = () => {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the recipe details from the local JSON file or API
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch('/data/recipeRapid.json');
        const result = await response.json();
        const selectedRecipe = result.results.find(meal => meal.id === parseInt(id)); // Find the recipe by ID
        setRecipe(selectedRecipe);
      } catch (error) {
        setError('Failed to fetch recipe details');
        console.error(error);
      }
    };

    fetchRecipeDetails();
  }, [id]); // Runs whenever the recipe ID changes in the URL

  if (error) {
    return <p>{error}</p>;
  }

  if (!recipe) {
    return <p>Loading...</p>;
  }

  return (
    <div>
    <h2 className="topBar">Blue Leaf Recipes</h2>
    <section className="meals mt-5">
        <div className="container">
        <h3 className="title mt-5">{recipe.name}</h3>
        <h4 className="description">{recipe.description}</h4>
        <div className="row">
            <div className="col-5">
                <img src={recipe.thumbnail_url} alt={recipe.name} className="img-fluid mt-3" />
                <div className='row'>
                    <div className="col-6">Preparation time: {recipe.prep_time_minutes} minutes</div>
                    <div className="col-6">{recipe.yields}</div>
                </div>
                <p>
                <h4>Nutrition facts <span className='txtSmall'>(per Serving):</span></h4>
                    <div>Calories: {recipe.nutrition.calories}</div>
                    <div>Carbohydrates: {recipe.nutrition.carbohydrates}</div>
                    <div>Fat: {recipe.nutrition.fat}</div>
                    <div>Fiber: {recipe.nutrition.fiber}</div>
                    <div>Proteins: {recipe.nutrition.protein}</div>
                </p>
            </div>
            <div className="col-7">
                <div className="contentContainer">
                    <div>
                        
                        {recipe.sections && Array.isArray(recipe.sections) && recipe.sections.length > 0 ? (
                            <ul>
                                <h4>Ingredients:</h4>
                                {recipe.sections[0].components.map((component, index) => (
                                    <li key={index}>
                                    {/* Optionally, show the raw text if you want to include the full ingredient info */}
                                    <div>{component.raw_text}</div>
                                    </li>
                                ))}
                                </ul>
                            ) : (
                                <p>No ingredients available.</p>
                            )}
                    </div>
                    <div>
                        {recipe.instructions.map((meal) => {
                                return <recipe key={meal.id} >
                                {recipe.instructions.display_text}</recipe>
                            })}
                            </div>
                            {recipe.instructions && Array.isArray(recipe.instructions) ? (
                                <ul>
                                    <h4>Instructions:</h4>
                                        {recipe.instructions.map((step, index) => {
                                            return (
                                            <li key={index}> {/* Use index as key if each step doesn't have an id */}
                                                {step.display_text} {/* Assuming each step has a 'display_text' field */}
                                            </li>
                                            );
                                        })}
                                </ul>
                            ) : (
                                <p>No instructions available.</p>
                            )}
                    <div>
                </div>
            </div>
            
        </div>
        
        {/* Add any other details you want to display */}
        </div>
</div>

    </section>
    </div>
  );
};

export default RecipeDetails;
