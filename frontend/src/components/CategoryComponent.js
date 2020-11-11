import React, { useEffect, useState } from "react";
import "./CategoryComponent.css";
import ButtonComponent from "./ButtonComponent";
import * as Constants from "./constants";

// Category component
const CategoryComponent = props => {
  console.log(props);
  const { categoryTitle, selectedIngredients } = props;
  const [showCategory, setShowCategory] = useState("ALL");

  const categories = ["ALL", "FV", "MS", "DY", "GF", "LS", "MISC"];

  const resetAllSearchState = () => {
    // Reset search state on all other search terms
    setSearchFVTerm("");
    setSearchMSTerm("");
    setSearchDYTerm("");
    setSearchGFTerm("");
    setSearchLSTerm("");
    setSearchMiscTerm("");
  };

  const handleCategoryClick = category => {
    setShowCategory(category);
    resetAllSearchState();
  };

  /*******************************************************************/
  // (Fruit and Veg List) Test list of items, need to populate prehand
  const FVlist = Constants.FRUIT_AND_VEG_LIST;

  // Sort the list of items (case insensitive)
  const sortedFVList = FVlist.sort(function(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  // Iterator to transform a list to an object with listVariable : false
  const [fruitsAndVegeIngredients, setFruitsAndVegeIngredients] = useState(
    () => {
      var fv = {};

      for (var i = 0; i < sortedFVList.length; i++) {
        fv[sortedFVList[i]] = false;
      }

      return fv;
    }
  );

  // Searching functionality
  const [searchFVTerm, setSearchFVTerm] = useState("");
  const [searchFVResults, setSearchFVResults] = useState([]);

  const handleFVSearchChange = event => {
    setSearchFVTerm(event.target.value);
  };

  useEffect(() => {
    const results = sortedFVList.filter(searchItem =>
      searchItem.toLowerCase().includes(searchFVTerm)
    );

    setSearchFVResults(results);
  }, [searchFVTerm]);

  // Fruit Vege Button click
  function handleFVClick(item) {
     props.onIngredientToggle(item, !fruitsAndVegeIngredients[item]);

    // Sets values of items in list to it's opposite
    setFruitsAndVegeIngredients({
      ...fruitsAndVegeIngredients,
      [item]: !fruitsAndVegeIngredients[item]
    });
  }

  // This following function allows for selected buttons to be moved and displayed at the top
  // Commented this out, because it makes UX quite weird...? - Only for Fruits Veg, right now.
  /*     useEffect(() => {
        const objectSorted = Object.fromEntries(
            Object.entries(fruitsAndVegeIngredients).sort(([,a], [,b]) => b-a)
        );

        const listSorted =  Object.keys(objectSorted);

        setSearchFVResults(listSorted);

    }, [fruitsAndVegeIngredients]); */

  /*******************************************************************/

  /*******************************************************************/
  // Meat and Seafood List
  const MSlist = Constants.MEAT_AND_SEAFOOD_LIST;

  // Sort the list of items (case insensitive)
  const sortedMSList = MSlist.sort(function(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  // Iterator to transform a list to an object with listVariable : false
  const [meatAndSeafoodIngredients, setMeatAndSeafoodIngredients] = useState(
    () => {
      var ms = {};

      for (var i = 0; i < sortedMSList.length; i++) {
        ms[sortedMSList[i]] = false;
      }

      return ms;
    }
  );

  // Searching functionality
  const [searchMSTerm, setSearchMSTerm] = useState("");
  const [searchMSResults, setSearchMSResults] = useState([]);

  const handleMSSearchChange = event => {
    setSearchMSTerm(event.target.value);
  };

  useEffect(() => {
    const results = sortedMSList.filter(searchItem =>
      searchItem.toLowerCase().includes(searchMSTerm)
    );

    setSearchMSResults(results);
  }, [searchMSTerm]);

  // Meat Seafood Button click
  function handleMSClick(item) {
    console.log(item);
    // Sets values of items in list to it's opposite
    setMeatAndSeafoodIngredients({
      ...meatAndSeafoodIngredients,
      [item]: !meatAndSeafoodIngredients[item]
    });
  }
  /*******************************************************************/

  /*******************************************************************/
  // Dairy list
  const DYlist = Constants.DAIRY_LIST;

  // Sort the list of items (case insensitive)
  const sortedDYList = DYlist.sort(function(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  // Iterator to transform a list to an object with listVariable : false
  const [dairyIngredients, setDairyIngredients] = useState(() => {
    var dy = {};

    for (var i = 0; i < sortedDYList.length; i++) {
      dy[sortedDYList[i]] = false;
    }

    return dy;
  });

  // Searching functionality
  const [searchDYTerm, setSearchDYTerm] = useState("");
  const [searchDYResults, setSearchDYResults] = useState([]);

  const handleDYSearchChange = event => {
    setSearchDYTerm(event.target.value);
  };

  useEffect(() => {
    const results = sortedDYList.filter(searchItem =>
      searchItem.toLowerCase().includes(searchDYTerm)
    );

    setSearchDYResults(results);
  }, [searchDYTerm]);

  // Meat Seafood Button click
  function handleDYClick(item) {
    // Sets values of items in list to it's opposite
    setDairyIngredients({
      ...dairyIngredients,
      [item]: !dairyIngredients[item]
    });
  }
  /*******************************************************************/

  /*******************************************************************/
  // Grains and Flour list
  const GFlist = Constants.GRAINS_AND_FLOUR_LIST;

  // Sort the list of items (case insensitive)
  const sortedGFList = GFlist.sort(function(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  // Iterator to transform a list to an object with listVariable : false
  const [grainsAndFlourIngredients, setGrainsAndFlourIngredients] = useState(
    () => {
      var gf = {};

      for (var i = 0; i < sortedGFList.length; i++) {
        gf[sortedGFList[i]] = false;
      }

      return gf;
    }
  );

  // Searching functionality
  const [searchGFTerm, setSearchGFTerm] = useState("");
  const [searchGFResults, setSearchGFResults] = useState([]);

  const handleGFSearchChange = event => {
    setSearchGFTerm(event.target.value);
  };

  useEffect(() => {
    const results = sortedGFList.filter(searchItem =>
      searchItem.toLowerCase().includes(searchGFTerm)
    );

    setSearchGFResults(results);
  }, [searchGFTerm]);

  // Meat Seafood Button click
  function handleGFClick(item) {
    // Sets values of items in list to it's opposite
    setGrainsAndFlourIngredients({
      ...grainsAndFlourIngredients,
      [item]: !grainsAndFlourIngredients[item]
    });
  }
  /*******************************************************************/

  /*******************************************************************/
  // Liquids and Sauces list
  const LSlist = Constants.LIQUIDS_AND_SAUCES_LIST;

  // Sort the list of items (case insensitive)
  const sortedLSList = LSlist.sort(function(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  // Iterator to transform a list to an object with listVariable : false
  const [
    liquidsAndSaucesIngredients,
    setLiquidsAndSaucesIngredients
  ] = useState(() => {
    var ls = {};

    for (var i = 0; i < sortedLSList.length; i++) {
      ls[sortedLSList[i]] = false;
    }

    return ls;
  });

  // Searching functionality
  const [searchLSTerm, setSearchLSTerm] = useState("");
  const [searchLSResults, setSearchLSResults] = useState([]);

  const handleLSSearchChange = event => {
    setSearchLSTerm(event.target.value);
  };

  useEffect(() => {
    const results = sortedLSList.filter(searchItem =>
      searchItem.toLowerCase().includes(searchLSTerm)
    );

    setSearchLSResults(results);
  }, [searchLSTerm]);

  // Meat Seafood Button click
  function handleLSClick(item) {
    // Sets values of items in list to it's opposite
    setLiquidsAndSaucesIngredients({
      ...liquidsAndSaucesIngredients,
      [item]: !liquidsAndSaucesIngredients[item]
    });
  }
  /*******************************************************************/

  /*******************************************************************/
  // Miscellaneous list
  const Misclist = Constants.MISC_LIST;

  // Sort the list of items (case insensitive)
  const sortedMiscList = Misclist.sort(function(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  // Iterator to transform a list to an object with listVariable : false
  const [miscIngredients, setMiscIngredients] = useState(() => {
    var misc = {};

    for (var i = 0; i < sortedMiscList.length; i++) {
      misc[sortedMiscList[i]] = false;
    }

    return misc;
  });

  // Searching functionality
  const [searchMiscTerm, setSearchMiscTerm] = useState("");
  const [searchMiscResults, setSearchMiscResults] = useState([]);

  const handleMiscSearchChange = event => {
    setSearchMiscTerm(event.target.value);
  };

  useEffect(() => {
    const results = sortedMiscList.filter(searchItem =>
      searchItem.toLowerCase().includes(searchMiscTerm)
    );

    setSearchMiscResults(results);
  }, [searchMiscTerm]);

  // Meat Seafood Button click
  function handleMiscClick(item) {
    // Sets values of items in list to it's opposite
    setMiscIngredients({
      ...miscIngredients,
      [item]: !miscIngredients[item]
    });
  }
  /*******************************************************************/

  return (
    <div className="category-title">
      {categoryTitle}

      <div className="category-buttons">
        {categories.map(category => (
          <button
            onClick={() => handleCategoryClick(category)}
            className={
              showCategory === category
                ? "handle-category-button-orange"
                : "handle-category-button-white"
            }
          >
            {category}
          </button>
        ))}
      </div>

      {showCategory === "FV" && (
        <div className="search-div">
          <div className="search-title">Fruits and Vegetables</div>
          <div className="search-bar-div">
            <input
              type="search"
              className="search-bar"
              placeholder="Search"
              onChange={handleFVSearchChange}
            />
          </div>
          <div className="search-results-div">
            {searchFVResults.map(item => (
              <ButtonComponent
                key={item}
                buttonText={item}
                buttonBorder={"1px solid"}
                backgroundColor={
                  fruitsAndVegeIngredients[item] ? "orange" : "white"
                }
                fontSize={"1rem"}
                display={"inline-block"}
                margin={"0 10px 10px 0"}
                onClick={() => handleFVClick(item)}
              />
            ))}
          </div>
        </div>
      )}

      {showCategory === "MS" && (
        <div className="search-div">
          <div className="search-title">Meats and Seafoods</div>
          <div className="search-bar-div">
            <input
              type="search"
              className="search-bar"
              placeholder="Search"
              onChange={handleMSSearchChange}
            />
          </div>
          <div className="search-results-div">
            {searchMSResults.map(item => (
              <ButtonComponent
                key={item}
                buttonText={item}
                buttonBorder={"1px solid"}
                backgroundColor={
                  meatAndSeafoodIngredients[item] ? "orange" : "white"
                }
                fontSize={"1rem"}
                display={"inline-block"}
                margin={"0 10px 10px 0"}
                onClick={() => handleMSClick(item)}
              />
            ))}
          </div>
        </div>
      )}

      {showCategory === "DY" && (
        <div className="search-div">
          <div className="search-title">Dairy</div>
          <div className="search-bar-div">
            <input
              type="search"
              className="search-bar"
              placeholder="Search"
              onChange={handleDYSearchChange}
            />
          </div>
          <div className="search-results-div">
            {searchDYResults.map(item => (
              <ButtonComponent
                key={item}
                buttonText={item}
                buttonBorder={"1px solid"}
                backgroundColor={dairyIngredients[item] ? "orange" : "white"}
                fontSize={"1rem"}
                display={"inline-block"}
                margin={"0 10px 10px 0"}
                onClick={() => handleDYClick(item)}
              />
            ))}
          </div>
        </div>
      )}

      {showCategory === "GF" && (
        <div className="search-div">
          <div className="search-title">Grains and Flour</div>
          <div className="search-bar-div">
            <input
              type="search"
              className="search-bar"
              placeholder="Search"
              onChange={handleGFSearchChange}
            />
          </div>
          <div className="search-results-div">
            {searchGFResults.map(item => (
              <ButtonComponent
                key={item}
                buttonText={item}
                buttonBorder={"1px solid"}
                backgroundColor={
                  grainsAndFlourIngredients[item] ? "orange" : "white"
                }
                fontSize={"1rem"}
                display={"inline-block"}
                margin={"0 10px 10px 0"}
                onClick={() => handleGFClick(item)}
              />
            ))}
          </div>
        </div>
      )}

      {showCategory === "LS" && (
        <div className="search-div">
          <div className="search-title">Liquids and Sauces</div>
          <div className="search-bar-div">
            <input
              type="search"
              className="search-bar"
              placeholder="Search"
              onChange={handleLSSearchChange}
            />
          </div>
          <div className="search-results-div">
            {searchLSResults.map(item => (
              <ButtonComponent
                key={item}
                buttonText={item}
                buttonBorder={"1px solid"}
                backgroundColor={
                  liquidsAndSaucesIngredients[item] ? "orange" : "white"
                }
                fontSize={"1rem"}
                display={"inline-block"}
                margin={"0 10px 10px 0"}
                onClick={() => handleLSClick(item)}
              />
            ))}
          </div>
        </div>
      )}

      {showCategory === "MISC" && (
        <div className="search-div">
          <div className="search-title">Miscellaneous</div>
          <div className="search-bar-div">
            <input
              type="search"
              className="search-bar"
              placeholder="Search"
              onChange={handleMiscSearchChange}
            />
          </div>
          <div className="search-results-div">
            {searchMiscResults.map(item => (
              <ButtonComponent
                key={item}
                buttonText={item}
                buttonBorder={"1px solid"}
                backgroundColor={miscIngredients[item] ? "orange" : "white"}
                fontSize={"1rem"}
                display={"inline-block"}
                margin={"0 10px 10px 0"}
                onClick={() => handleMiscClick(item)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryComponent;
