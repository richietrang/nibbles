import React, { useEffect, useState } from 'react';
import './CategoryComponent.css';
import ButtonComponent from './ButtonComponent';

// Category component
const CategoryComponent = ( {categoryTitle} ) => {

    // (Fruit and Veg List) Test list of items, need to populate prehand
    const FVlist = [
        "Apple",
        "Banana",
        "Pear",
        "Testingsasdsdas",
        "rnfj",
        "Testing",
        "Oranges",
        "Chicken",
    ]

    // Sort the list of items (case insensitive)
    const sortedList = FVlist.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    // Searching functionality
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Iterator to transform a list to an object with listVariable : false
    const [fruitsAndVegeIngredients, setFruitsAndVegeIngredients] = useState(() => {
        var z = {};

        for (var i = 0; i < sortedList.length; i++) {
            z[sortedList[i]] = false;
        }

        return z;
    });

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
    }

    // Button click
    function handleClick(item) {

        // Sets values of items in list to it's opposite
        setFruitsAndVegeIngredients({
            ...fruitsAndVegeIngredients,
            [item] : !fruitsAndVegeIngredients[item],
        });

    }

    useEffect(() => {
        const results = sortedList.filter(searchItem => searchItem.toLowerCase().includes(searchTerm));
        setSearchResults(results);
        
    }, [searchTerm]);

    // This following function allows for selected buttons to be moved and displayed at the top
    // Commented this out, because it makes UX quite weird...?
/*     useEffect(() => {
        const objectSorted = Object.fromEntries(
            Object.entries(fruitsAndVegeIngredients).sort(([,a], [,b]) => b-a)
        );

        const listSorted =  Object.keys(objectSorted);

        setSearchResults(listSorted);

    }, [fruitsAndVegeIngredients]); */

  return (
    <div className="category-title"> 
        { categoryTitle }
        <div className="search-div">
            <div className="search-title">
                Testing
            </div>
            <div className="search-bar-div">
                <input type='search' className="search-bar" placeholder="Search" onChange={handleSearchChange} />
            </div>
            <div className="search-results-div">
                {searchResults.map(item => (
                    <ButtonComponent key={item} buttonText={item} buttonBorder={"1px solid"} backgroundColor={fruitsAndVegeIngredients[item] ? "orange" : "white"}
                    fontSize={"1rem"} display={"inline-block"} margin={"0 10px 10px 0"} onClick={() => handleClick(item)} />
                ))}
            </div>
        </div>
    </div>
  );
}

export default CategoryComponent;