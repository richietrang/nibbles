import React from 'react';
import './RecipeThumbnailComponent.css'

const RecipeThumbnailComponent = ({ recipeTitle, cookTimeInMins, primaryPhotoUrl, photosUrls, recipeLink, matchingIngredients, nonMatchingIngredients }) => {
  return (
    <div className="recipe-thumbnail-wrapper">
      <div className="recipe-thumbnail-circle-primary-photo-border">
        <img className="recipe-thumbnail-circle-primary-photo" src={primaryPhotoUrl} alt={`A picture of the ${recipeTitle} recipe`} />
      </div>
      <div className="recipe-thumbnail">
        <div className="recipe-title">{recipeTitle}</div>
        <div className="recipe-thumbnail-info-container">

          <div className="recipe-thumbnail-info-item-wrapper">
            <div className="recipe-thumbnail-info-item-title">Cook Time</div>
            <div className="recipe-thumbnail-info-item-text">{`${cookTimeInMins} Mins`}</div>
          </div>
    
          <div className="recipe-thumbnail-info-item-wrapper photos-thumbnail-info-item">
            <div className="recipe-thumbnail-info-item-title">More Photos</div>
            <div className="recipe-thumbnail-info-item-icon">
              <img src={require('../assets/images/more-photos-icon.svg')} alt="More photos button icon" /> 
            </div>
          </div>
                  
          <div className="recipe-thumbnail-info-item-wrapper recipe-link-thumbnail-info-item">
            <div className="recipe-thumbnail-info-item-title">Recipe</div>
            <div className="recipe-thumbnail-info-item-icon">
              <img src={require('../assets/images/link-button-icon.svg')} alt="A link icon to visit the recipe page" /> 
            </div>
          </div>
                    
          <div className="recipe-thumbnail-info-item-wrapper no-right-border ingredients-thumbnail-info-item">
            <div className="recipe-thumbnail-info-item-title">Ingredients</div>
            <div className="recipe-thumbnail-info-item-icon">
            
              {!nonMatchingIngredients.length ?
                <div className="red-circle-with-number-text">{nonMatchingIngredients.length}</div> :
                <img src={require('../assets/images/green-circle-tick-icon.svg')} alt="Green tick" />
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RecipeThumbnailComponent;
