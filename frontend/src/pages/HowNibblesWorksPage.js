import React from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import HeaderComponent from '../components/HeaderComponent';

const HowNibblesWorksPage = () => {
  return (
    <DefaultLayout>
      <HeaderComponent 
        headerText='Curious about food? You must be curious about Nibbles!'
      />
      <h1>Dis is how it works bruddah</h1>
    </DefaultLayout>
  );
}

export default HowNibblesWorksPage;
