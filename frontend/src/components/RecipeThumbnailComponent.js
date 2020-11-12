import React from "react";
import "./RecipeThumbnailComponent.css";
import ModalComponent from "./ModalComponent";

class RecipeThumbnailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeFavourited: false,
      showIngredientsModal: false
    };

    this.handleToggleSaveRecipe = this.handleToggleSaveRecipe.bind(this);

    this.closeIngredientsModal = this.closeIngredientsModal.bind(this);

    this.openIngredientsModal = this.openIngredientsModal.bind(this);
  }

  addOrDeleteRecipe(add) {
    const body = JSON.stringify({
      userEmail: "test@test.com",
      recipeId: this.props.value.id
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

    var endpoint = "deleterecipe";
    if (add) {
      endpoint = "addrecipe";
    }
    fetch(`http://127.0.0.1:5000/${endpoint}`, options)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
      });
  }

  handleToggleSaveRecipe() {
    // localStorage = window.localStorage;
    // const authToken = localStorage.getItem('authToken');
    // Check if authToken and !recipeFavourited do fetch call to save recipe.
    if (this.state.recipeFavourited) {
      this.addOrDeleteRecipe(false);
    } else {
      this.addOrDeleteRecipe(true);
    }

    // Check if authToken and recipeFavourited do fetch call to delete saved recipe.
    this.setState((state, props) => ({
      recipeFavourited: !state.recipeFavourited
    }));
  }

  closeIngredientsModal() {
    this.setState((state, props) => ({
      showIngredientsModal: false
    }));
  }

  openIngredientsModal() {
    this.setState((state, props) => ({
      showIngredientsModal: true
    }));
  }

  render() {
    const {
      title,
      cookTimeInMins,
      primaryPhotoUrl,
      recipeLink,
      matchingIngredients,
      nonMatchingIngredients
    } = this.props.value;

    const activeSaveRecipeIcon = require("../assets/images/star-active.png");
    const inActiveSaveRecipeIcon = require("../assets/images/star-inactive.png");

    return (
      <div className="recipe-thumbnail-wrapper">
        <div className="recipe-thumbnail-circle-primary-photo-border">
          <img
            className="recipe-thumbnail-circle-primary-photo"
            src={primaryPhotoUrl}
            alt={`A picture of the ${title} recipe`}
            onClick={() => window.open(recipeLink, "_blank")}
          />
        </div>
        <div className="recipe-thumbnail">
          <div className="recipe-title">{title}</div>
          <div className="recipe-thumbnail-info-container">
            <div className="recipe-thumbnail-info-item-wrapper">
              <div className="recipe-thumbnail-info-item-title">Cook Time</div>
              <div className="recipe-thumbnail-info-item-text">{`${cookTimeInMins} Mins`}</div>
            </div>

            <div
              className="recipe-thumbnail-info-item-wrapper photos-thumbnail-info-item"
              onClick={this.handleToggleSaveRecipe}
            >
              <div className="recipe-thumbnail-info-item-title">
                Save Recipe
              </div>
              <div className="recipe-thumbnail-info-item-icon">
                <img
                  src={
                    this.state.recipeFavourited
                      ? activeSaveRecipeIcon
                      : inActiveSaveRecipeIcon
                  }
                  alt="Favourite icon"
                />
              </div>
            </div>

            <div className="recipe-thumbnail-info-item-wrapper recipe-link-thumbnail-info-item">
              <div className="recipe-thumbnail-info-item-title">Recipe</div>
              <div className="recipe-thumbnail-info-item-icon">
                <img
                  src={require("../assets/images/link-button-icon.svg")}
                  alt="A link icon to visit the recipe page"
                  onClick={() => window.open(recipeLink, "_blank")}
                />
              </div>
            </div>

            <div
              className="recipe-thumbnail-info-item-wrapper no-right-border ingredients-thumbnail-info-item"
              onClick={this.openIngredientsModal}
            >
              <div className="recipe-thumbnail-info-item-title">
                Ingredients
              </div>
              <div className="recipe-thumbnail-info-item-icon">
                {nonMatchingIngredients.length ? (
                  <div className="red-circle-with-number-text">
                    {nonMatchingIngredients.length}
                  </div>
                ) : (
                  <img
                    src={require("../assets/images/green-circle-tick-icon.svg")}
                    alt="Green tick"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {this.state.showIngredientsModal && (
          <ModalComponent
            enableCloseButton
            closeButtonCb={this.closeIngredientsModal}
          >
            {matchingIngredients.length > 0 && (
              <div className="ingredients-list-wrapper">
                <div className="ingredients-modal-title">
                  Matched Ingredients
                </div>
                <ul>
                  {matchingIngredients.map(ingredient => {
                    return <li>{ingredient}</li>;
                  })}
                </ul>
              </div>
            )}
            {nonMatchingIngredients.length > 0 && (
              <div className="ingredients-list-wrapper">
                <div className="ingredients-modal-title">
                  Missing Ingredients
                </div>
                <ul>
                  {nonMatchingIngredients.map(ingredient => {
                    return <li>{ingredient}</li>;
                  })}
                </ul>
              </div>
            )}
          </ModalComponent>
        )}
      </div>
    );
  }
}

export default RecipeThumbnailComponent;
