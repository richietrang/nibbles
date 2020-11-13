import React from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import HeaderComponent from '../components/HeaderComponent';
import ButtonComponent from '../components/ButtonComponent';
import RecipeThumbnailComponent from "../components/RecipeThumbnailComponent";

import './SavedRecipesPage.css';
import { Link } from 'react-router-dom';

const SavedRecipesPage = () => {

  const styles = {
    noLinkTextDecoration: {
      textDecoration: 'none',
      color: '#4e4e4e',
    },
  };
  const localStorage = window.localStorage;
  const savedRecipes = JSON.parse(window.localStorage.getItem('savedRecipes'));
  const recipesPicture = require("../assets/images/recipe.png");

  return (
    <DefaultLayout>
      <HeaderComponent
        headerText="Go and make some yummy nibbles"
      />
      <h1 className="category-title align-center">Your saved recipes</h1>

      { !savedRecipes &&
        <div className="saved-recipes-container">
          <p>No recipes have been saved yet. Go out and explore!</p>
          <img className="no-saved-recipes-image" src={recipesPicture} alt="recipes icon picture" />
          <Link
            to={{
              pathname: '/',
            }}
            style={styles.noLinkTextDecoration}
          >
            <ButtonComponent
              buttonText="Home Page"
              backgroundColor="#febd2e"
            />
          </Link>
        </div>
      }

      { savedRecipes && savedRecipes.length &&
        <>
          {savedRecipes.map(recipe => (
            <div className="recipe-thumbnail-results-container">
              <RecipeThumbnailComponent key={recipe.title} value={recipe} />
            </div>
          ))}
        </>
      }
    </DefaultLayout>
  );
}

export default SavedRecipesPage;
