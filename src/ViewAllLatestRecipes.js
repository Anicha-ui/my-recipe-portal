import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageLogo  from './assets/blueLeaf_logo03.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'; // Import the solid heart
import { AnimatePresence, motion } from "framer-motion";


const ViewAllLatestrecipes = () => {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    
        useEffect(() => {
            const fetchRecipeDetails = async () => {
              try {
                const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=30&q=new`;
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
                    setRecipes(data.results); // Set the fetched recipes to the state
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
          
            fetchRecipeDetails();
        }, []); // Empty dependency array to run this effect once on mount

        return (
            
            <div>
                <div className='topBar'>
                    <Link to="/" className="home-link" >
                    <img src={ImageLogo} className="logoImage" alt="Logo" />
                    <h2 style={{paddingLeft:'95px', marginBottom:'0'}} className="topBarTitle">Blue Leaf Recipes</h2>
                    </Link>
                </div>
                <section>
                    <div className="container mt-5">
                        <div style={{paddingTop:'50px', paddingLeft:'15px', position:'absolute'}}><Link to="/" className="home-link moreSaveBtns" >Home</Link></div>
                            {/* Display loading message while fetching */}
                            {loading && <p>Loading recipes...</p>}
                
                            {/* Display error message if any */}
                            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
                
                            {/* Render recipes when data is available */}
                            {!loading && !error && recipes.length > 0 ? (
                                <div className="mt-4">
                                    
                                    <section className="text-center mt-2">
                                        <h2 className="title topSpacing">Latest Recipes</h2>
                                    </section>
                                    <div className="row">
                                        {recipes.map((recipe) => (
                                            <div key={recipe.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                                <div className="container">
                                                    <div className="row mt-lg-5 mt-sm-3">
                                                        <div className="image-container mt-2 mb-4">
                                                            <Link to={`/recipe/${recipe.id}`}>
                                                                <img src={recipe.thumbnail_url} alt={recipe.name} className="img-fluid side-border" />
                                                            </Link>
                                                            <div className="info recipeTitle">
                                                                <Link to={`/recipe/${recipe.id}`} className="recipeTitleHeight">{recipe.name}</Link>
                                                                <div className="col-12 mt-4">
                                                                    {/*<div className="text-end">
                                                                        Favorite button (you need to define favorite functionality) 
                                                                        <Link >
                                                                            <FontAwesomeIcon
                                                                                icon={faHeart}
                                                                                color={'gray'} 
                                                                                style={{ cursor: 'pointer' }}
                                                                            />
                                                                        </Link>
                                                                        
                                                                    </div>*/}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                !loading && <p>No Recipes Found</p> // Display this if no recipes are available
                            )}
                    </div>
                </section>
            </div>
        );
    };

export default ViewAllLatestrecipes;