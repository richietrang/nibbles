import React from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import HeaderComponent from '../components/HeaderComponent';
import CategoryComponent from '../components/CategoryComponent';

const HomePage = () => {
  return (
    <DefaultLayout>
      <HeaderComponent 
        headerText='Turn your leftovers into lunchtime magic!'
      />
      <CategoryComponent 
        categoryTitle="Your Ingredients"
      />
    </DefaultLayout>
  );
}

const styles = {};

export default HomePage;
