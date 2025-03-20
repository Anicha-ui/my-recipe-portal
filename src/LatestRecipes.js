import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageLogo  from './assets/blueLeaf_logo03.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'; // Import the solid heart
import { AnimatePresence, motion } from "framer-motion";

const Latestrecipes = () => {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
        useEffect(() => {
            const fetchRecipeDetails = async () => {
              try {
                const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&q=new`;
                const options = {
                  method: 'GET',
                  headers: {
                    'x-rapidapi-key': 'b9771e9473mshbcd1bfd562090d2p18a320jsn7a37d3506da9',
                    'x-rapidapi-host': 'tasty.p.rapidapi.com'
                  }
                };
          
                const result = await fetch(url, options);
                const data = await result.json(); // Convert the response to JSON
          
                console.log('API Response for Latest Recipes:', data); // Log the full API response
          
                if (result.ok && data.results) {
                    // Shuffle the array of recipes
                    const shuffledRecipes = shuffleArray(data.results);
                    // Select the first 5 random recipes (or any number you want)
                    const randomRecipes = shuffledRecipes.slice(0, 5); // Adjust the number of random recipes
              
                    // Set the fetched random recipes to the state
                    setRecipes(randomRecipes);
                  } else {
                    setError('No recipes found');
                  }
                } catch (error) {
                    setError('Failed to fetch recipe details');
                    console.error('Error:', error);
                } finally {
                    setLoading(false); // Set loading to false after fetching
                }
            };
          // Fisher-Yates shuffle algorithm
            const shuffleArray = (array) => {
                const shuffledArray = [...array]; // Create a copy of the array
                for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
                }
                return shuffledArray;
            };

            fetchRecipeDetails();
            
        }, []); // Empty dependency array to run this effect once on mount

        return (
            <div>
                {/* Display loading message while fetching */}
                {loading && <p>Loading recipes...</p>}
    
                {/* Display error message if any */}
                {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
                {/* Render recipes when data is available */}
                {!loading && !error && recipes.length > 0 ? (
                    <div>
                        <div>
                            <h2 className="title topSpacing">The Latest Recipes</h2>
                            <div className="text-end category-title viewLatest">
                                {/* Your navigation bar */}
                                <Link to="/ViewAllLatestrecipes">View All Latest</Link>
                            </div>
                        </div>
                        <div className="row">
                            {recipes.slice(0, 2).map((recipe, index) => (
                                <div key={recipe.id} className={`col-sm-12 col-lg-${index === 0 ? '8' : '4'} mb-4`} style={{paddingRight:'0', paddingLeft:'0'}}>
                                {index === 0 ? (
                                    // First Recipe - Larger (8 columns on large screens)
                                    <div className="d-flex">
                                        <div className="col-6">
                                            <Link to={`/recipe/${recipe.id}`}>
                                                <img
                                                    src={recipe.thumbnail_url}
                                                    alt={recipe.name}
                                                    className="img-fluid side-border"
                                                />
                                            </Link>
                                        </div>
                                        <div className="col-6 first-recipe-description d-grid align-items-center">
                                            <Link to={`/recipe/${recipe.id}`} style={{textDecorationLine:'none'}}>
                                                <div className="first-recipe-description-text1">{recipe.name}</div>
                                            </Link>
                                                <div className="first-recipe-description-text2">{recipe.description}</div>
                                        </div>
                                    </div>
                                ) : (
                                    // Second Recipe - Smaller (4 columns on large screens)
                                    <div>
                                        <Link to={`/recipe/${recipe.id}`}>
                                            <img
                                            src={recipe.thumbnail_url}
                                            alt={recipe.name}
                                            className="img-fluid side-border"
                                            />
                                        </Link>
                                        <Link to={`/recipe/${recipe.id}`} style={{textDecorationLine:'none'}}>
                                            <div className="second-recipe-description">{recipe.name}</div>
                                        </Link>
                                    </div>
                                )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    !loading  // Display this if no recipes are available
                )}
            </div>
        );
    };

export default Latestrecipes;