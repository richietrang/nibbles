import React, { useState, useEffect } from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import HeaderComponent from "../components/HeaderComponent";
import ButtonComponent from "../components/ButtonComponent";
import RecipeThumbnailComponent from "../components/RecipeThumbnailComponent";

import "./SavedRecipesPage.css";
import { Link } from "react-router-dom";

const fetchData = async () => {
  const body = JSON.stringify({
    userEmail: "test@test.com"
  });

  console.log(body);

  const options = {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*"
    }
  };

  const res = await fetch(`http://127.0.0.1:5000/getrecipes`, options);
  const json = await res.json();
  console.log(json);
  return json;
};

const SavedRecipesPage = () => {
  const styles = {
    noLinkTextDecoration: {
      textDecoration: "none",
      color: "#4e4e4e"
    }
  };
  const localStorage = window.localStorage;
  const recipesPicture = require("../assets/images/recipe.png");

  // const savedRecipes = JSON.parse(window.localStorage.getItem('savedRecipes'));

  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    fetchData().then(res => {
      console.log(res);
      setSavedRecipes(res.savedRecipes);
    });
  }, []);

  return (
    <DefaultLayout>
      <HeaderComponent headerText="Go and make some yummy nibbles!" />
      <h1 className="category-title align-center">Your Saved Recipes</h1>

      {!savedRecipes && (
        <div className="saved-recipes-container">
          <p>No recipes have been saved yet. Go out and explore!</p>
          <img
            className="no-saved-recipes-image"
            src={recipesPicture}
            alt="recipes icon picture"
          />
          <Link
            to={{
              pathname: "/"
            }}
            style={styles.noLinkTextDecoration}
          >
            <ButtonComponent buttonText="Home Page" backgroundColor="#febd2e" />
          </Link>
        </div>
      )}

      {savedRecipes && savedRecipes.length && (
        <div className="saved-recipes-container">
          {savedRecipes.map(recipe => (
            <div className="recipe-thumbnail-results-container">
              <RecipeThumbnailComponent
                key={recipe.id}
                value={recipe}
                recipeFavourited={true}
              />
            </div>
          ))}
        </div>
      )}
    </DefaultLayout>
  );
};

export default SavedRecipesPage;
