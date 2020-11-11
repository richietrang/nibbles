import React from "react";
import "./RecipeThumbnailComponent.css";

class RecipeThumbnailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeFavourited: false,
    };

    this.handleToggleSaveRecipe = this.handleToggleSaveRecipe.bind(
      this
    );
  }

  handleToggleSaveRecipe() {
    this.setState((state, props) => ({
      recipeFavourited: !state.recipeFavourited,
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

            <div className="recipe-thumbnail-info-item-wrapper photos-thumbnail-info-item" onClick={this.handleToggleSaveRecipe}>
              <div className="recipe-thumbnail-info-item-title">
                Save Recipe
              </div>
              <div className="recipe-thumbnail-info-item-icon">
                <img
                  src={this.state.recipeFavourited ? activeSaveRecipeIcon : inActiveSaveRecipeIcon}
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

            <div className="recipe-thumbnail-info-item-wrapper no-right-border ingredients-thumbnail-info-item">
              <div className="recipe-thumbnail-info-item-title">
                Ingredients
              </div>
              <div className="recipe-thumbnail-info-item-icon">
                {!nonMatchingIngredients.length ? (
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
      </div>
    );
  }
}

export default RecipeThumbnailComponent;
