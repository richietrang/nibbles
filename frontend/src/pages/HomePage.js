import React from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import HeaderComponent from "../components/HeaderComponent";
import CategoryComponent from "../components/CategoryComponent";
import RecipeThumbnailComponent from "../components/RecipeThumbnailComponent";
import ButtonComponent from "../components/ButtonComponent";
import "./HomePage.css";

const loader = require("../assets/images/loader.svg");

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIngredients: new Set(),
      recipeList: [],
      allowMissingIngredients: true,
      showModal: false,
      toggleSignUpModal: false
    };

    this.handleIngredientListChange = this.handleIngredientListChange.bind(
      this
    );

    this.toggleAllowMissingIngredients = this.toggleAllowMissingIngredients.bind(
      this
    );

    // Modal for missing ingredients
    this.setShowModal = this.setShowModal.bind(this);

    this.child = React.createRef();
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

  toggleAllowMissingIngredients() {
    this.setState((state, props) => ({
      allowMissingIngredients: !this.state.allowMissingIngredients
    }));
  }
  setShowModal(showModal) {
    this.setState((state, props) => ({
      showModal: showModal
    }));
  }

  showSignUpModal = () => {
    console.log("showSignUpModal");
    this.setState((state, props) => ({
      toggleSignUpModal: true
    }));
  };

  getRecipeList = () => {
    if (this.state.allowMissingIngredients) {
      return this.state.recipeList;
    } else {
      return this.state.recipeList.filter(recipe => !recipe.missingIngredients);
    }
  };

  render() {
    console.log("rerender home page");
    return (
      <DefaultLayout>
        <HeaderComponent
          headerText="Turn your leftovers into lunchtime magic!"
          toggleSignUpModal={this.state.toggleSignUpModal}
        />
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
            <div className="allow-missing-ingredients-button-container">
              <ButtonComponent
                buttonText="Allow Missing Ingredients"
                buttonBorder={"1px solid"}
                backgroundColor={
                  this.state.allowMissingIngredients ? "orange" : "white"
                }
                fontSize={"1rem"}
                display={"inline-block"}
                margin={"0 10px 10px 0"}
                onClick={this.toggleAllowMissingIngredients}
              />
            </div>
            {this.state.showModal ? (
              <img src={loader} alt="loader" />
            ) : (
              <>
                {this.getRecipeList() ? (
                  this.getRecipeList().map(recipe => (
                    <div className="recipe-thumbnail-results-container">
                      <RecipeThumbnailComponent
                        key={recipe.title}
                        value={recipe}
                        onSaveRecipe={this.showSignUpModal}
                      />
                    </div>
                  ))
                ) : (
                  <div className="category-title align-center no-bottom-margin">
                    No matching recipes found. Try searching for something else?
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DefaultLayout>
    );
  }
}

// const styles = {};

export default HomePage;
