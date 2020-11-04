import React, { useEffect, useState } from 'react';
import './CategoryComponent.css';
import ButtonComponent from './ButtonComponent';

// Category component
const CategoryComponent = ( {categoryTitle} ) => {

    const [showCategory, setShowCategory] = useState("ALL");

    const handleAllCategory = () => {
        setShowCategory("ALL");
    }

    const handleFVCategory = () => {
        setShowCategory("FV");
        // Reset search state on all other search terms
        setSearchMSTerm("");
    }

    const handleMSCategory = () => {
        setShowCategory("MS");
        setSearchFVTerm("");
    }

    const handleDYCategory = () => {
        setShowCategory("DY");
    }

    const handleGFCategory = () => {
        setShowCategory("GF");
    }

    const handleLSCategory = () => {
        setShowCategory("LS");
    }

    const handleMiscCategory = () => {
        setShowCategory("MISC");
    }

    /*******************************************************************/
    // (Fruit and Veg List) Test list of items, need to populate prehand
    const FVlist = [
        "Apple",
        "Banana",
        "Pear",
        "Oranges",
    ]

    // Sort the list of items (case insensitive)
    const sortedFVList = FVlist.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    
    // Iterator to transform a list to an object with listVariable : false
    const [fruitsAndVegeIngredients, setFruitsAndVegeIngredients] = useState(() => {
        var fv = {};

        for (var i = 0; i < sortedFVList.length; i++) {
            fv[sortedFVList[i]] = false;
        }

        return fv;
    });

    // Searching functionality
    const [searchFVTerm, setSearchFVTerm] = useState("");
    const [searchFVResults, setSearchFVResults] = useState([]);

    const handleFVSearchChange = event => {
        setSearchFVTerm(event.target.value);
    }

    useEffect(() => {
        const results = sortedFVList.filter(searchItem => searchItem.toLowerCase().includes(searchFVTerm));

        setSearchFVResults(results);
        
    }, [searchFVTerm]);

    // Fruit Vege Button click
    function handleFVClick(item) {

        // Sets values of items in list to it's opposite
        setFruitsAndVegeIngredients({
            ...fruitsAndVegeIngredients,
            [item] : !fruitsAndVegeIngredients[item],
        });

    }
    /*******************************************************************/

    /*******************************************************************/
    // Meat and Seafood List
    const MSlist = [
        "Chicken",
        "Beef",
        "Lamb",
        "Veal",
    ]

    // Sort the list of items (case insensitive)
    const sortedMSList = MSlist.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    // Iterator to transform a list to an object with listVariable : false
    const [meatAndSeafoodIngredients, setMeatAndSeafoodIngredients] = useState(() => {
        var ms = {};

        for (var i = 0; i < sortedMSList.length; i++) {
            ms[sortedMSList[i]] = false;
        }

        return ms;
    });

    // Searching functionality
    const [searchMSTerm, setSearchMSTerm] = useState("");
    const [searchMSResults, setSearchMSResults] = useState([]);

    const handleMSSearchChange = event => {
        setSearchMSTerm(event.target.value);
    }

    useEffect(() => {
        const results = sortedMSList.filter(searchItem => searchItem.toLowerCase().includes(searchMSTerm));

        setSearchMSResults(results);
        
    }, [searchMSTerm]);

    // Meat Seafood Button click
    function handleMSClick(item) {

        // Sets values of items in list to it's opposite
        setMeatAndSeafoodIngredients({
            ...meatAndSeafoodIngredients,
            [item] : !meatAndSeafoodIngredients[item],
        });

    }
    /*******************************************************************/

    // This following function allows for selected buttons to be moved and displayed at the top
    // Commented this out, because it makes UX quite weird...? - Only for Fruits Veg, right now.
/*     useEffect(() => {
        const objectSorted = Object.fromEntries(
            Object.entries(fruitsAndVegeIngredients).sort(([,a], [,b]) => b-a)
        );

        const listSorted =  Object.keys(objectSorted);

        setSearchFVResults(listSorted);

    }, [fruitsAndVegeIngredients]); */

  return (
    <div className="category-title"> 
        { categoryTitle }

        <br />

        <button onClick={handleAllCategory}>
            All
        </button>

        <button onClick={handleFVCategory}>
            FV
        </button>

        <button onClick={handleMSCategory}>
            MS
        </button>

        <button onClick={handleDYCategory}>
            DY
        </button>

        <button onClick={handleGFCategory}>
            GF
        </button>

        <button onClick={handleLSCategory}>
            LS
        </button>

        <button onClick={handleMiscCategory}>
            MISC
        </button>

        {showCategory == "FV" &&
            <div className="search-div">
                <div className="search-title">
                    Fruits and Vegetables
                </div>
                <div className="search-bar-div">
                    <input type='search' className="search-bar" placeholder="Search" onChange={handleFVSearchChange} />
                </div>
                <div className="search-results-div">
                    {searchFVResults.map(item => (
                        <ButtonComponent key={item} buttonText={item} buttonBorder={"1px solid"} backgroundColor={fruitsAndVegeIngredients[item] ? "orange" : "white"}
                        fontSize={"1rem"} display={"inline-block"} margin={"0 10px 10px 0"} onClick={() => handleFVClick(item)} />
                    ))}
                </div>
            </div>
        }

        {showCategory == "MS" &&
            <div className="search-div">
                <div className="search-title">
                    Meats and Seafoods
                </div>
                <div className="search-bar-div">
                    <input type='search' className="search-bar" placeholder="Search" onChange={handleMSSearchChange} />
                </div>
                <div className="search-results-div">
                    {searchMSResults.map(item => (
                        <ButtonComponent key={item} buttonText={item} buttonBorder={"1px solid"} backgroundColor={meatAndSeafoodIngredients[item] ? "orange" : "white"}
                        fontSize={"1rem"} display={"inline-block"} margin={"0 10px 10px 0"} onClick={() => handleMSClick(item)} />
                    ))}
                </div>
            </div>
        }


    </div>
  );
}

export default CategoryComponent;