import React from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import HeaderComponent from "../components/HeaderComponent";
import CategoryComponent from "../components/CategoryComponent";
import RecipeThumbnailComponent from "../components/RecipeThumbnailComponent";
import "./HomePage.css";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIngredients: new Set()
    };
    this.recipeList = [
      {
        title: "Pierogi",
        cookTimeInMins: "45",
        primaryPhotoUrl:
          "https://www.mygourmetconnection.com/wp-content/uploads/potato-and-cheese-pierogi-720x540.jpg",
        photosUrls: [],
        recipeLink:
          "https://www.mygourmetconnection.com/potato-and-cheese-pierogi/",
        matchingIngredients: [],
        nonMatchingIngredients: []
      }
    ];

    this.handleIngredientListChange = this.handleIngredientListChange.bind(
      this
    );
  }

  getRecipeList() {
    console.log("update");
    return this.recipeList;
  }

  handleIngredientListChange(item, newValue) {
    if (newValue) {
      this.setState((state, props) => ({
        selectedIngredients: state.selectedIngredients.add(item)
      }));

      // Call api here
      const ingredientsBody = JSON.stringify({
        IngredientsList: Array.from(this.state.selectedIngredients),
      });

      console.log(ingredientsBody);
      const options = {
        method: 'POST',
        body: ingredientsBody,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
        },
      }
      fetch('http://127.0.0.1:5000/search', options)
        .then(res => {
          return res.text();
        })
          .then(data => {
            console.log(data);
          }) 

    } else {
      this.setState(function(state, props) {
        state.selectedIngredients.delete(item);
        return {
          selectedIngredients: state.selectedIngredients
        };
      });
    }
  }

  render() {
    return (
      <DefaultLayout>
        <HeaderComponent headerText="Turn your leftovers into lunchtime magic!" />
        <div className="home-page-container">
          <div className="ingredients-section">
            <CategoryComponent
              categoryTitle="Your Ingredients"
              selectedIngredients={this.selectedIngredients}
              onIngredientToggle={this.handleIngredientListChange}
            />
          </div>
          <div className="recipes-section">
            <div className="category-title align-center no-bottom-margin">Matching Recipes</div>
              {this.getRecipeList().map(recipe => (
                <div className="recipe-thumbnail-results-container">
                  <RecipeThumbnailComponent key={recipe.title} value={recipe} />
                </div>
              ))}
              
          </div>
        </div>
      </DefaultLayout>
    );
  }
}

// const styles = {};

export default HomePage;
