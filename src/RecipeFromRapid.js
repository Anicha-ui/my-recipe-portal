import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageLogo  from './assets/blueLeaf_logo03.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'; // Import the solid heart
import { AnimatePresence, motion } from "framer-motion";

const RecipeFromRapidRandom = () => {
  const [favorites, setFavorites] = useState([]);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [isMoreLikeThis, setIsMoreLikeThis] = useState(false);
  const [clickedRecipeName, setClickedRecipeName] = useState('');  
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Track if it's mobile

    const [Myrecipes, setMyRecipes] = useState({
        breakfast: null,
        lunch: null,
        dinner: null,
        dessert: null,
    });

    const [error, setError] = useState("");

    const API_URL = "https://tasty.p.rapidapi.com/recipes/list";
    const API_KEY = "b9771e9473mshbcd1bfd562090d2p18a320jsn7a37d3506da9";
    const API_HOST = "tasty.p.rapidapi.com";

    const Mycategories = ["breakfast", "lunch", "dinner", "desserts"];

    //fetching recipes by category while first entering the page
    const fetchRecipeByCategory = async (category) => {
        try {
            const response = await fetch(`${API_URL}?from=0&size=10&tags=${category}`, {
                method: "GET",
                headers: {
                    "x-rapidapi-key": API_KEY,
                    "x-rapidapi-host": API_HOST,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.results.length > 0) {
                return result.results[Math.floor(Math.random() * result.results.length)];
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Error fetching ${category} recipe:`, error);
            setError(error.message);
            return null;
        }
    };

    const fetchDailyRecipes = async () => {
        const newRecipes = {};
        for (let category of Mycategories) {
            newRecipes[category] = await fetchRecipeByCategory(category);
        }
        setMyRecipes(newRecipes);

        // Save in local storage to avoid re-fetching within the same day
        localStorage.setItem("dailyRecipes", JSON.stringify(newRecipes));
        localStorage.setItem("lastFetchDate", new Date().toDateString());
    };

    useEffect(() => {
        const lastFetchDate = localStorage.getItem("lastFetchDate");
        const savedRecipes = localStorage.getItem("dailyRecipes");

        if (lastFetchDate === new Date().toDateString() && savedRecipes) {
            setMyRecipes(JSON.parse(savedRecipes));
        } else {
            fetchDailyRecipes();
        }
    }, []);
    //end of fetching recipes by category while first entering the page
    

    //menu animation on mobile
    const menuVars = {
      initial: {
        scaleY: 0,
      },
      animate: {
        scaleY: 1,
        transition: {
          duration: 0.5,
          ease: [0.12, 0, 0.39, 0],
        },
      },
      exit: {
        scaleY: 0,
        transition: {
          delay: 0.5,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    };

    const categories = {
      "Meals": ["Breakfast", "Lunch", "Dinner", "Dessert", "Salads"],
      "Nutrition": ["Low Carb", "Gluten Free", "Low Calorie", "High Protein"],
      "Ingredients": ["Chicken", "Seafood", "Dairy"],
      "Cook Time": ["Under 15 mins", "Under 45 mins", "Under 1 hour"],
      "Cuisine": ["North American", "Italian", "Japanese", "Asian"],
      "Occasion": ["Holiday", "Party", "Picnic", "Potluck"],
      "Diet": ["Vegetarian", "Vegan", "Keto", "Paleo"],
      "Cooking Method": ["Grilling", "Baking", "Slow Cooker", "Instant Pot"],
      "Comfort Food": ["Comfort food", "Healthy", "Easy", "Kosher", "Kid Friendly"]
  };

  const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
  };

  const handleTagToggle = (tag) => {
      setSelectedTags((prevTags) =>
          prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
      );
  };

    //Handle favorite toggle
        // Handle adding/removing a favorite
        const handleFavoriteToggle = (recipeId) => {
          let updatedFavorites;
            if (favorites.includes(recipeId)) {
            // If already favorited, remove from favorites
            updatedFavorites = favorites.filter((id) => id !== recipeId);
          } else {
            // If not favorited, add to favorites
            updatedFavorites = [...favorites, recipeId];
          }
    
          // Update state and save to localStorage
          setFavorites(updatedFavorites);
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        };
    
      // Check if the current recipe is a favorite
        const isFavorite = favorites.includes(Myrecipes.id);
    
        const toggleMenu = () => {
          setIsOpen((open) => !open);
          setOpen((prevOpen) => !prevOpen);
        };

        //code for 'more like this'
        const handleMoreLikeThis = (recipe) => {
          try {
            // Log the recipe to see its structure
            console.log("Recipe object:", recipe);
        
            // Check if recipe and recipe.tags are valid
            if (!recipe || !recipe.tags) {
              console.error("Invalid recipe or missing tags:", recipe);
              return;
            }
        
            // Normalize tags in case it is not an array
            const recipeTags = Array.isArray(recipe.tags)
              ? recipe.tags.map(tag => tag.display_name)
              : recipe.tags.display_name ? [recipe.tags.display_name] : []; // Adjust based on actual structure
        
            if (recipeTags.length === 0) {
              console.error("No valid tags found in recipe:", recipe);
              return;
            }
        
            console.log("Tags from clicked recipe:", recipeTags);
        
            // Ensure Myrecipes is defined and properly structured
            if (!Myrecipes) {
              console.error("Myrecipes is undefined");
              return;
            }
        
            // Flatten the categories to get all recipes
            const allRecipes = Object.values(Myrecipes).flat(); // Flatten the categories to get all recipes
        
            // Filter recipes that share any of the tags
            const similarRecipes = allRecipes.filter(r =>
              r.id !== recipe.id && // Exclude the clicked recipe itself
              r.tags && r.tags.some(tag => recipeTags.includes(tag.display_name)) // Check if any tag matches
            );
        
            // Display or store similar recipes
            setSimilarRecipes(similarRecipes);
            setClickedRecipeName(recipe.name);
            setIsMoreLikeThis(true); // Set to true once similar recipes are displayed
          } catch (error) {
            console.error("Error in handleMoreLikeThis:", error);
          }
        };
        
        
  
    
    

    return (
        <div>
          <div className='topBar'>
            <Link to="/" className="home-link" onClick={() => window.location.reload()}>
              <img src={ImageLogo} className="logoImage"></img><h2 style={{paddingLeft:'95px', marginBottom:'0'}} className="topBarTitle">Blue Leaf Recipes</h2>
            </Link>
          </div>
          {/*jsx for the search functionality*/}
          <section style={{paddingTop:10}}>
          <div className='row mt-5'>
             <div className='col-sm-12 col-md-12 col-lg-2 text-center mt-4'>
                  <div className="col-12 search-container">
                      <input
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          placeholder="Search for a Recipe..."
                          style={{ fontFamily: 'FontAwesome, Arial' }}
                          className="search-input"
                      />
                  </div>
              </div>

              <div className='col-sm-12 col-md-12 col-lg-10'>
                <div className="menu-item-trigger mt-4" onClick={toggleMenu}>Choose from Categories <span style={{fontSize:"1.0rem"}}>{open ? '-' : '+'}</span></div>
                {/* Horizontal Categories with Hoverable Tags */}
                {isMobile ? (
                <AnimatePresence>
                  {open && (
                  <motion.div
                    variants={menuVars}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="fixed left-0 top-0 w-full h-screen origin-top bg-yellow-400 text-black p-10"
                  >
                  <div className={`menu-item-category ${isOpen ? "is-open" : ""}`}>
                    <div className="horizontal-categories">
                        {Object.keys(categories).map((category) => (
                            <div
                                key={category}
                                className="category-item"
                                onMouseEnter={() => setHoveredCategory(category)}
                                onMouseLeave={() => setHoveredCategory(null)}
                                >
                                <h6>{category}</h6>
                                {/* Display Tags on Hover */}
                                {hoveredCategory === category && (
                                    <div className="tags-on-hover row col-sm-12">
                                        {categories[category].map((tag) => (
                                            <label key={tag} className="tag">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTags.includes(tag)}
                                                    onChange={() => handleTagToggle(tag)}
                                                />
                                                {tag}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                  )}
                </AnimatePresence>
                ): (
                  <div className={`menu-item-category ${isOpen ? "is-open" : ""}`}>
                    <div className="horizontal-categories">
                        {Object.keys(categories).map((category) => (
                            <div
                                key={category}
                                className="category-item"
                                onMouseEnter={() => setHoveredCategory(category)}
                                onMouseLeave={() => setHoveredCategory(null)}
                                >
                                <h6>{category}</h6>
                                {/* Display Tags on Hover */}
                                {hoveredCategory === category && (
                                    <div className="tags-on-hover">
                                        {categories[category].map((tag) => (
                                            <label key={tag} className="tag">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTags.includes(tag)}
                                                    onChange={() => handleTagToggle(tag)}
                                                />
                                                {tag}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                      </div>
                    </div>
                )
                }
              </div>
              
          </div>
          <div className='border-bottom mt-4'></div>
         </section>
          {/*end of search functionality*/}
          {/* display recipe of the day for the begining */}
          <section className="meals mt-3">
          <div>
            <section className="text-center mt-2">
                <h2 className="title topSpacing">Recipes of the Day</h2>
            </section>
            <div className="row">
            {Mycategories.map((category) => (
                <div key={category} className="recipe col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                    {/* <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2> */}
                    {Myrecipes[category] ? (
                        <div className="container">
                          <div className="row mt-5">
                            <div className="image-container mt-2 mb-5">
                              <img className="img-fluid" src={Myrecipes[category].thumbnail_url} alt={Myrecipes[category].name}  />
                              <Link to={`/recipe/${Myrecipes[category].id}`} className="button title">{category.charAt(0).toUpperCase() + category.slice(1) + "-" + Myrecipes[category].name}</Link>
                            </div>
                            <div className="col-8">
                                <Link className="moreSaveBtns button" onClick={() => handleMoreLikeThis(Myrecipes[category].id)}>More Like This</Link>
                            </div>
                            <div className="col-4 text-end">
                                <Link className="button" onClick={() => handleFavoriteToggle(Myrecipes[category].id)}>
                                  <FontAwesomeIcon
                                    icon={isFavorite ? faHeart : faHeartSolid}
                                    color={isFavorite ? 'red' : 'gray'}
                                    style={{ cursor: 'pointer' }}
                                  />
                                </Link>
                            </div>
                          </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            ))}
            {error && <p>Error: {error}</p>}
        </div>
        </div>
        </section>
        {/* END display recipe of the day for the begining */}
        </div>
    );
};

export default RecipeFromRapidRandom;
