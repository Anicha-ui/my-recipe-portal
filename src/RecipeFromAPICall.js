import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageLogo  from './assets/blueLeaf_logo03.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'; // Import the solid heart
import { AnimatePresence, motion } from "framer-motion";

const RecipeFromAPICall = () => {
  //const [favorites, setFavorites] = useState([]);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [isMoreLikeThis, setIsMoreLikeThis] = useState(false);
  const [clickedRecipeName, setClickedRecipeName] = useState('');  
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Track if it's mobile

  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

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
            const response = await fetch(`${API_URL}?from=0&size=60&tags=${category}`, {
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
    
    //code for input search functionality
    // Fetch recipes based on search query
    const fetchRecipes = async (query) => {
    if (query.trim() === "") {
      setRecipes([]); 
      return;
    }

    setLoading(true);
    setError(null);
    try {
        const response = await fetch(
          `${API_URL}?from=0&size=10&q=${encodeURIComponent(query)}`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": API_KEY,
              "X-RapidAPI-Host": API_HOST,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        setRecipes(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const handleSearchChange = (e) => {
      const newQuery = e.target.value;
      setSearchQuery(newQuery);
  
      // Debounce API call
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        fetchRecipes(newQuery);
      }, 500);
    };
    //end of code for input search functionality

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
  //search recipes by tags (checkboxes)
  const fetchRecipesByTags = async () => {
      if (selectedTags.length === 0) {
          setFilteredRecipes([]); // Reset if no tags are selected
          return;
      }

      setLoading(true);

      // Join selected tags into a query string
      const tagsQuery = selectedTags.map(tag => tag.toLowerCase().replace(/\s+/g, "_")).join(",");
      console.log("Selected tags:", tagsQuery); // Debugging selected tags
      const apiUrl = `${API_URL}?from=0&size=40&tags=${tagsQuery}`;

      console.log("Fetching from API:", apiUrl); // Debugging API URL

      try {
          const response = await fetch(apiUrl, {
              method: "GET",
              headers: {
                  "x-rapidapi-key": API_KEY,
                  "x-rapidapi-host": API_HOST,
              },
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const result = await response.json();
          console.log("API Response:", result); // Debugging API response

          if (result.results && result.results.length > 0) {
              setFilteredRecipes(result.results);
          } else {
              setFilteredRecipes([]); // No results
              console.log("No recipes found for selected tags.");
          }
      } catch (error) {
          console.error("Error fetching recipes by tags:", error);
          setError(error.message);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchRecipesByTags();
  }, [selectedTags]); // Runs when selectedTags updates

  const handleTagToggle = (tag) => {
      setSelectedTags((prevTags) =>
          prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
      );
  };
  //end recipe search by tags
  // Handle adding/removing a favorite
  // useEffect(() => {
  //   // Sync state to localStorage whenever it changes
  //   localStorage.setItem('favorites', JSON.stringify(favorites));
  // }, [favorites]);
  
  // const handleFavoriteToggle = (recipeId) => {
  //   console.log("Toggling favorite for recipe ID:", recipeId);
  //   let updatedFavorites;
  //     if (favorites.includes(recipeId)) {
  //     // If already favorited, remove from favorites
  //     updatedFavorites = favorites.filter((id) => id !== recipeId);
  //   } else {
  //     // If not favorited, add to favorites
  //     updatedFavorites = [...favorites, recipeId];
  //   }
  //   // Update state and save to localStorage
  //   setFavorites(updatedFavorites);
  //   localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  //   console.log("Updated favorites:", updatedFavorites);
  // };
  // // Check if the current recipe is a favorite
  // const isFavorite = favorites.includes(Myrecipes.id);
    // Initialize favorites from localStorage (or default to an empty array)
    const [favorites, setFavorites] = useState(() => {
      const savedFavorites = localStorage.getItem('favorites');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    });
  
    useEffect(() => {
      // Sync state to localStorage whenever it changes
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);
  
    const handleFavoriteToggle = (recipeId) => {
      console.log("Toggling favorite for recipe ID:", recipeId);
      let updatedFavorites;
      if (favorites.includes(recipeId)) {
        // If already favorited, remove from favorites
        updatedFavorites = favorites.filter((id) => id !== recipeId);
      } else {
        // If not favorited, add to favorites
        updatedFavorites = [...favorites, recipeId];
      }
      // Update state
      setFavorites(updatedFavorites);
      console.log("Updated favorites:", updatedFavorites);
    };
  
    // Check if the current recipe is a favorite
    const isFavorite = (recipeId) => favorites.includes(recipeId);

  const toggleMenu = () => {
    setIsOpen((open) => !open);
    setOpen((prevOpen) => !prevOpen);
  };

  const normalizeTags = (tags) => {
    // If tags is an array of objects with display_name
    if (Array.isArray(tags)) {
      return tags.map(tag => tag.display_name).filter(Boolean); // Extract display_name from each tag
    }
    // If tags is a single object with display_name
    else if (tags && tags.display_name) {
      return [tags.display_name];
    }
    // If no tags or unsupported format
    return [];
  };

  const fetchSimilarRecipes = async (recipeId) => {
    const url = `https://tasty.p.rapidapi.com/recipes/list-similarities?recipe_id=${recipeId}`;
    
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'tasty.p.rapidapi.com',
        'x-rapidapi-key': 'b9771e9473mshbcd1bfd562090d2p18a320jsn7a37d3506da9'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        console.log("Similar Recipes:", data);
        setSimilarRecipes(data.results); // Set the similar recipes
        //return data.results; // Assuming `results` contains the similar recipes
      } else {
        setError(data.message); // Handle error
        console.error("Error fetching similar recipes:", data.message);
      }
    } catch (error) {
      console.error("Error fetching from API:", error);
    }
  };
  
  return (
    <div>
      <div className='topBar'>
        <Link to="/" className="home-link" onClick={() => window.location.reload()}>
          <img src={ImageLogo} className="logoImage" alt="Logo" />
          <h2 style={{paddingLeft:'95px', marginBottom:'0'}} className="topBarTitle">Blue Leaf Recipes</h2>
        </Link>
      </div>
  
      {/* Search functionality */}
      <section style={{paddingTop:10}}>
        <div className='row mt-5'>
          <div className='col-sm-12 col-md-12 col-lg-2 text-center mt-4'>
            <div className="col-12 search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for a Recipe..."
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
  
      {/* Only display Recipe of the Day if no data in filters */}
      {(similarRecipes.length === 0 && recipes.length === 0 && filteredRecipes.length === 0) && (
        <section className="meals mt-3" >
          <div>
            <section className="text-center mt-2">
              <h2 className="title topSpacing">Recipes of the Day</h2>
            </section>
            <div className="row">
              {Mycategories.map((category) => (
                <div key={category} className="recipe col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                  {Myrecipes[category] ? (
                    <div className="container">
                      <div className="row mt-5">
                        <div className="image-container mt-2 mb-5">
                          <img className="img-fluid" src={Myrecipes[category].thumbnail_url} alt={Myrecipes[category].name} />
                          <Link to={`/recipe/${Myrecipes[category].id}`} className="button title">{category.charAt(0).toUpperCase() + category.slice(1) + "-" + Myrecipes[category].name}</Link>
                        </div>
                        <div className="col-8">
                          <Link className="moreSaveBtns button" onClick={() => fetchSimilarRecipes(Myrecipes[category].id)}>More Like This</Link>
                        </div>
                        <div className="col-4 text-end">
                          <Link className="button" onClick={() => handleFavoriteToggle(Myrecipes[category].id)}>
                            <FontAwesomeIcon
                              icon={isFavorite(Myrecipes[category].id) ? faHeart : faHeartSolid}
                              color={isFavorite(Myrecipes[category].id) ? 'red' : 'gray'}
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
      )}
  
      {/* Only render the filtered recipes if they exist */}
      {recipes.length > 0 && similarRecipes.length === 0 && (
        <section className="meals mt-3">
          <div>
            <section className="text-center mt-2">
              <h2 className="title topSpacing">Recipes for your Search</h2>
            </section>
            <div className="row">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="recipe col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                  <div className="container">
                    <div className="row mt-5">
                      <div className="image-container mt-2 mb-5">
                        <img className="img-fluid" src={recipe.thumbnail_url} alt={recipe.name} />
                        <Link to={`/recipe/${recipe.id}`} className="button title">{recipe.name}</Link>
                      </div>
                      <div className="col-8">
                        <Link className="moreSaveBtns button" onClick={() => fetchSimilarRecipes(recipe.id)}>More Like This</Link>
                      </div>
                      <div className="col-4 text-end">
                        <Link className="button" onClick={() => handleFavoriteToggle(recipe.id)}>
                          <FontAwesomeIcon
                            icon={favorites.includes(recipe.id) ? faHeart : faHeartSolid}
                            color={favorites.includes(recipe.id) ? 'red' : 'gray'}
                            style={{ cursor: 'pointer' }}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
  
      {/* Only render filtered recipes by tags if they exist */}
      {filteredRecipes.length > 0 && similarRecipes.length === 0 && (
        <section className="mt-4">
          <section className="text-center mt-2">
            <h2 className="title topSpacing">Recipes from Selected Option</h2>
          </section>
          {loading && <p>Loading recipes...</p>}
          {error && <p className="error">{error}</p>}
          <div className="row">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div className="container">
                  <div className="row mt-5">
                    <div className="image-container mt-2 mb-5">
                      <img src={recipe.thumbnail_url} alt={recipe.name} className="img-fluid" />
                      <Link to={`/recipe/${recipe.id}`} className="button title">{recipe.name}</Link>
                    </div>
                    <div className="col-8">
                      <Link className="moreSaveBtns button" onClick={() => fetchSimilarRecipes(recipe.id)}>More Like This</Link>
                    </div>
                    <div className="col-4 text-end">
                      <Link className="button" onClick={() => handleFavoriteToggle(recipe.id)}>
                        <FontAwesomeIcon
                          icon={favorites.includes(recipe.id) ? faHeart : faHeartSolid}
                          color={favorites.includes(recipe.id) ? 'red' : 'gray'}
                          style={{ cursor: 'pointer' }}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
  
      {/* Only render similar recipes if they exist */}
      {similarRecipes.length > 0 && (
        <section className="mt-4">
          <section className="text-center mt-2">
            <h2 className="title topSpacing">Similar Recipes</h2>
          </section>
          {loading && <p>Loading recipes...</p>}
          {error && <p className="error">{error}</p>}
          <div className="row">
            {similarRecipes.map((recipe) => (
              <div key={recipe.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div className="container">
                  <div className="row mt-5">
                    <div className="image-container mt-2 mb-5">
                      <img src={recipe.thumbnail_url} alt={recipe.name} className="img-fluid" />
                      <Link to={`/recipe/${recipe.id}`} className="button title">{recipe.name}</Link>
                    </div>
                    <div className="col-4">
                      <Link className="button" onClick={() => handleFavoriteToggle(recipe.id)}>
                        <FontAwesomeIcon
                          icon={favorites.includes(recipe.id) ? faHeart : faHeartSolid}
                          color={favorites.includes(recipe.id) ? 'red' : 'gray'}
                          style={{ cursor: 'pointer' }}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );  
};

export default RecipeFromAPICall;
