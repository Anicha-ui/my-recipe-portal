import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // to get the recipe id from URL params
import { Link } from "react-router-dom";
import ImageLogo  from './assets/blueLeaf_logo03.png';
import './App.css';
import './Recipeoftheday.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap'; // Using Bootstrap's Modal for web
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons'; 
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons';

const RecipeDetailsFromAPICall = () => {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  const [isModalVisible, setModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const openModal = (videoLink) => {
    setVideoUrl(videoLink); // Set the video URL when the image is clicked
    setModalVisible(true); // Open the modal
  };

  const closeModal = () => {
    setModalVisible(false);
    setVideoUrl(''); // Reset the video URL to avoid old video links in the modal
  };

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const url = `https://tasty.p.rapidapi.com/recipes/get-more-info?id=${id}`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': 'b9771e9473mshbcd1bfd562090d2p18a320jsn7a37d3506da9',
            'x-rapidapi-host': 'tasty.p.rapidapi.com'
          }
        };
  
        const result = await fetch(url, options);
        const data = await result.json(); // Convert the response to JSON
  
        console.log('API Response:', data); // Log the full API response
  
        if (result.ok) {
  
          // Assuming the response is directly a recipe, not inside an array
          const selectedRecipe = data.results ? data.results[0] : data;
  
          console.log('Selected Recipe:', selectedRecipe);
  
          if (selectedRecipe) {
            setRecipe(selectedRecipe); // Set the fetched recipe to the state
          } else {
            setError('Recipe not found');
          }
        } else {
          setError('Failed to fetch data');
        }
      } catch (error) {
        setError('Failed to fetch recipe details');
        console.error('Error:', error);
      }
    };
  
    fetchRecipeDetails();
  }, [id]); // Runs when the ID changes
  // Runs whenever the recipe ID changes in the URL

  // Show loading state if the recipe is not fetched yet
  if (!recipe && !error) {
    return <p>Loading...</p>;
  }

  // Show error message if there is an error
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className='topBar'>
        <Link to="/" className="home-link" >
          <img src={ImageLogo} className="logoImage" alt="Logo" />
          <h2 style={{paddingLeft:'95px', marginBottom:'0'}} className="topBarTitle">Blue Leaf Recipes</h2>
        </Link>
      </div>
      
    <section className="meals mt-5">
        <div className="container mt-5">
        <div style={{paddinTop:'400px', position:'absolute'}}><Link to="/" className="home-link moreSaveBtns" >Home</Link></div>
        <h3 className="title mt-5">{recipe.name}</h3>
        <h4 className="description">{recipe.description}</h4>
        <div className="row">
            <div className="col-sm-12 col-md-5">
                <img src={recipe.thumbnail_url} alt={recipe.name} className="img-fluid mt-3" />
                {/* Modal to confirm opening video */}
                <Modal
                  animationtype="slide"
                  show={isModalVisible}
                  onHide={closeModal}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Watch Video</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {/* Embed the video using iframe */}
                    <div className="video-container">
                      <iframe
                        width="100%"
                        height="315"
                        src={videoUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <button onClick={closeModal} className="allButtons">
                      Close
                    </button>
                  </Modal.Body>
                </Modal>

                <div className='row'>
                    <div className="col-4"><FontAwesomeIcon icon={faClock} style={{paddingRight: "5px"}} />Cook time: {recipe.total_time_minutes} mins</div>
                    <div className="col-4 text-center" ><FontAwesomeIcon icon={faUtensils} style={{paddingRight: "5px"}} />{recipe.yields}</div>
                    <div className="col-4 text-end">
                        <button onClick={() => openModal(recipe.original_video_url)} className="noBorderButton">
                            <FontAwesomeIcon icon={faVideo} style={{paddingRight: "5px"}} />Video Watch
                        </button>
                    </div>
                </div>
                <div className="contentContainer">
                    <h4>Nutrition facts <span className='txtSmall'>(per Serving):</span></h4>
                    <div>Calories: {recipe.nutrition.calories}</div>
                    <div>Carbohydrates: {recipe.nutrition.carbohydrates}</div>
                    <div>Fat: {recipe.nutrition.fat}</div>
                    <div>Fiber: {recipe.nutrition.fiber}</div>
                    <div>Proteins: {recipe.nutrition.protein}</div>
                </div>
            </div>
            <div className="col-sm-12 col-md-7">
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
                                return <div key={meal.id} >
                                {recipe.instructions.display_text}</div>
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

export default RecipeDetailsFromAPICall;
