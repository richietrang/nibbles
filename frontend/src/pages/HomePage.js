import React from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import HeaderComponent from '../components/HeaderComponent';
import RecipeThumbnailComponent from '../components/RecipeThumbnailComponent';
import './HomePage.css';

const HomePage = () => {
  return (
    <DefaultLayout>
      <HeaderComponent
        headerText='Turn your leftovers into lunchtime magic!'
      />
      <div className="recipe-thumbnail-results-container">
        <RecipeThumbnailComponent
          recipeTitle="Pierogi"
          cookTimeInMins="45"
          primaryPhotoUrl="https://www.mygourmetconnection.com/wp-content/uploads/potato-and-cheese-pierogi-720x540.jpg"
          photosUrls={[]}
          recipeLink="https://www.mygourmetconnection.com/potato-and-cheese-pierogi/"
          matchingIngredients={[]}
          nonMatchingIngredients={[]}
        />
        <RecipeThumbnailComponent
          recipeTitle="Pierogi"
          cookTimeInMins="45"
          primaryPhotoUrl="https://www.mygourmetconnection.com/wp-content/uploads/potato-and-cheese-pierogi-720x540.jpg"
          photosUrls={[]}
          recipeLink="https://www.mygourmetconnection.com/potato-and-cheese-pierogi/"
          matchingIngredients={[]}
          nonMatchingIngredients={[]}
        />
        <RecipeThumbnailComponent
          recipeTitle="Pierogi"
          cookTimeInMins="45"
          primaryPhotoUrl="https://www.mygourmetconnection.com/wp-content/uploads/potato-and-cheese-pierogi-720x540.jpg"
          photosUrls={[]}
          recipeLink="https://www.mygourmetconnection.com/potato-and-cheese-pierogi/"
          matchingIngredients={[]}
          nonMatchingIngredients={[]}
        />
        <RecipeThumbnailComponent
          recipeTitle="Pierogi"
          cookTimeInMins="45"
          primaryPhotoUrl="https://www.mygourmetconnection.com/wp-content/uploads/potato-and-cheese-pierogi-720x540.jpg"
          photosUrls={[]}
          recipeLink="https://www.mygourmetconnection.com/potato-and-cheese-pierogi/"
          matchingIngredients={[]}
          nonMatchingIngredients={[]}
        />
        <RecipeThumbnailComponent
          recipeTitle="Pierogi"
          cookTimeInMins="45"
          primaryPhotoUrl="https://www.mygourmetconnection.com/wp-content/uploads/potato-and-cheese-pierogi-720x540.jpg"
          photosUrls={[]}
          recipeLink="https://www.mygourmetconnection.com/potato-and-cheese-pierogi/"
          matchingIngredients={[]}
          nonMatchingIngredients={[]}
        />
        <RecipeThumbnailComponent
          recipeTitle="Pierogi"
          cookTimeInMins="45"
          primaryPhotoUrl="https://www.mygourmetconnection.com/wp-content/uploads/potato-and-cheese-pierogi-720x540.jpg"
          photosUrls={[]}
          recipeLink="https://www.mygourmetconnection.com/potato-and-cheese-pierogi/"
          matchingIngredients={[]}
          nonMatchingIngredients={[]}
        />
      </div>
    </DefaultLayout>
  );
}

const styles = {};

export default HomePage;
