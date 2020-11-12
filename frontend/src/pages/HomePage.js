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
      selectedIngredients: new Set(),
      recipeList: [
        {
          title: "Pierogi",
          cookTimeInMins: "45",
          primaryPhotoUrl:
            "https://www.mygourmetconnection.com/wp-content/uploads/potato-and-cheese-pierogi-720x540.jpg",
          recipeLink:
            "https://www.mygourmetconnection.com/potato-and-cheese-pierogi/",
          matchingIngredients: [],
          nonMatchingIngredients: []
        }
      ]
    };

    this.handleIngredientListChange = this.handleIngredientListChange.bind(
      this
    );
  }

  updateRecipeList() {
    if (!this.state.selectedIngredients.size) {
      this.setState((state, props) => ({
        recipeList: []
      }));
      return;
    }

    console.log("Updated Recipe List", this.state.recipeList);

    // Call api here
    const ingredientsBody = JSON.stringify({
      IngredientsList: Array.from(this.state.selectedIngredients)
    });

    console.log(ingredientsBody);
    const options = {
      method: "POST",
      body: ingredientsBody,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
      }
    };

    fetch("http://127.0.0.1:5000/search", options)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        this.setState((state, props) => ({
          recipeList: data
        }));
      });

    return this.state.recipeList;
  }

  handleIngredientListChange(item, newValue) {
    if (newValue) {
      this.setState(
        (state, props) => ({
          selectedIngredients: state.selectedIngredients.add(item)
        }),
        () => {
          console.log(this.state);
          this.updateRecipeList();
        }
      );
    } else {
      this.setState(
        function(state, props) {
          state.selectedIngredients.delete(item);
          return {
            selectedIngredients: state.selectedIngredients
          };
        },
        () => {
          console.log(this.state);
          this.updateRecipeList();
        }
      );
    }
    // this.updateRecipeList();
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
            <div className="category-title align-center no-bottom-margin">
              Matching Recipes
            </div>
            {this.state.recipeList.map(recipe => (
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
