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
        <CategoryComponent
          categoryTitle="Your Ingredients"
          selectedIngredients={this.selectedIngredients}
          onIngredientToggle={this.handleIngredientListChange}
        />
        {this.getRecipeList().map(recipe => (
          <div className="recipe-thumbnail-results-container">
            <RecipeThumbnailComponent key={recipe.title} value={recipe} />
          </div>
        ))}
      </DefaultLayout>
    );
  }
}

// const styles = {};

export default HomePage;
