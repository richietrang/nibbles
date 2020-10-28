import React from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import HeaderComponent from '../components/HeaderComponent';

const HomePage = () => {
  return (
    <DefaultLayout>
      <HeaderComponent 
        headerText='Turn your leftovers into lunchtime magic!'
      />
    </DefaultLayout>
  );
}

const styles = {};

export default HomePage;
