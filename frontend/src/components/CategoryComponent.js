import React, { useEffect, useState } from "react";
import "./CategoryComponent.css";
import ButtonComponent from "./ButtonComponent";

// Category component
const CategoryComponent = ({ categoryTitle }) => {
  const [showCategory, setShowCategory] = useState("ALL");

  const handleAllCategory = _this => {
    setShowCategory("ALL");
    // Reset search state on all other search terms
    setSearchFVTerm("");
    setSearchMSTerm("");
    setSearchDYTerm("");
    setSearchGFTerm("");
    setSearchLSTerm("");
    setSearchMiscTerm("");
  };

  const handleFVCategory = () => {
    setShowCategory("FV");
    // Reset search state on all other search terms
    setSearchFVTerm("");
    setSearchMSTerm("");
    setSearchDYTerm("");
    setSearchGFTerm("");
    setSearchLSTerm("");
    setSearchMiscTerm("");
  };

  const handleMSCategory = () => {
    setShowCategory("MS");
    // Reset search state on all other search terms
    setSearchFVTerm("");
    setSearchMSTerm("");
    setSearchDYTerm("");
    setSearchGFTerm("");
    setSearchLSTerm("");
    setSearchMiscTerm("");
  };

  const handleDYCategory = () => {
    setShowCategory("DY");
    // Reset search state on all other search terms
    setSearchFVTerm("");
    setSearchMSTerm("");
    setSearchDYTerm("");
    setSearchGFTerm("");
    setSearchLSTerm("");
    setSearchMiscTerm("");
  };

  const handleGFCategory = () => {
    setShowCategory("GF");
    // Reset search state on all other search terms
    setSearchFVTerm("");
    setSearchMSTerm("");
    setSearchDYTerm("");
    setSearchGFTerm("");
    setSearchLSTerm("");
    setSearchMiscTerm("");
  };

  const handleLSCategory = () => {
    setShowCategory("LS");
    // Reset search state on all other search terms
    setSearchFVTerm("");
    setSearchMSTerm("");
    setSearchDYTerm("");
    setSearchGFTerm("");
    setSearchLSTerm("");
    setSearchMiscTerm("");
  };

  const handleMiscCategory = () => {
    setShowCategory("MISC");
    // Reset search state on all other search terms
    setSearchFVTerm("");
    setSearchMSTerm("");
    setSearchDYTerm("");
    setSearchGFTerm("");
    setSearchLSTerm("");
    setSearchMiscTerm("");
  };

  /*******************************************************************/
  // (Fruit and Veg List) Test list of items, need to populate prehand
  const FVlist = [
    "lemon",
    "apple",
    "banana",
    "lime",
    "strawberries",
    "orange",
    "pineapple",
    "blueberries",
    "raspberries",
    "coconut",
    "red grapes",
    "green grapes",
    "peach",
    "cherry",
    "kiwis",
    "grapefruit",
    "mandarin oranges",
    "cantaloupe",
    "plum",
    "apricots",
    "fresh figs",
    "raisins",
    "papaya",
    "onion",
    "red onion",
    "green onions",
    "shallot",
    "garlic",
    "tomatoes",
    "lettuce",
    "potatoes",
    "carrots",
    "red chilli",
    "fresh basil",
    "parsley",
    "broccoli",
    "corn",
    "spinach",
    "mushroom",
    "green beans",
    "ginger",
    "celery",
    "cucumber",
    "sweet potato",
    "pickles",
    "avocado",
    "cilantro",
    "olives",
    "asparagus spears",
    "cabbage",
    "cauliflower",
    "dill",
    "kale",
    "pumpkin",
    "squash",
    "fresh mint",
    "eggplant",
    "beets",
    "leeks",
    "brussel sprouts",
    "horseradish",
    "artichokes",
    "bok choy",
    "parsnip",
    "okra",
    "turnips",
    "snow peas",
    "lemongrass"
  ];

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
  const MSlist = [
    "ahi tuna",
    "anchovies",
    "bacon",
    "bacon fat",
    "beef",
    "beef brisket",
    "beef chuck roast",
    "beef tenderloin",
    "canned tuna",
    "carp",
    "cat fish filets",
    "chicken bouillon",
    "chicken breasts",
    "chicken broth",
    "chicken drumsticks",
    "chicken legs",
    "chicken pieces",
    "chicken sausage",
    "chicken stock",
    "chicken tenders",
    "chicken thighs",
    "chicken wings",
    "chorizo sausage",
    "clams",
    "cod",
    "crab meat",
    "duck fat",
    "egg",
    "egg white",
    "egg yolk",
    "fish",
    "flank steak",
    "gravy",
    "ground beef",
    "ground chicken",
    "ground lamb",
    "ground pork",
    "ground veal",
    "ham",
    "halibut fillet",
    "italian sausages",
    "lamb",
    "lean ground beef",
    "lean ground turkey",
    "lean pork tenderloin",
    "leg of lamb",
    "meat",
    "meatballs",
    "mussels",
    "pancetta",
    "paneer",
    "pepperoni",
    "polish sausage",
    "pork",
    "pork belly",
    "pork chops",
    "pork shoulder",
    "pork tenderloin",
    "proscuitto",
    "raw shrimp",
    "roasted chicken",
    "rotisseri chicken",
    "round steak",
    "salmon fillet",
    "sausage",
    "sirloin steak",
    "turkey",
    "turkey breast"
  ];

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
    // Sets values of items in list to it's opposite
    setMeatAndSeafoodIngredients({
      ...meatAndSeafoodIngredients,
      [item]: !meatAndSeafoodIngredients[item]
    });
  }
  /*******************************************************************/

  /*******************************************************************/
  // Dairy list
  const DYlist = [
    "almond milk",
    "asiago cheese",
    "brie",
    "butter",
    "buttermilk",
    "cheddar",
    "cheese",
    "cheese curds",
    "cheese dip",
    "chocolate milk",
    "chocolate ice cream",
    "coconut milk",
    "colby jack",
    "cotija cheese",
    "cottage cheese",
    "cream",
    "cream cheese",
    "double cream",
    "fontina cheese",
    "fresh mozzarella",
    "goat cheese",
    "gouda cheese",
    "greek yoghurt",
    "gruyere",
    "ice cream",
    "low fat milk",
    "low fat plain yoghurt",
    "low fat sour cream",
    "milk",
    "monterey jack cheese",
    "pecorino",
    "plain greek yoghurt",
    "plain nonfat yoghurt",
    "plain yoghurt",
    "provolone",
    "rice milk",
    "ricotta",
    "salted butter",
    "sharp cheddar cheese",
    "sheeps milk cheese",
    "shredded mozarella",
    "sour cream",
    "white chocolate",
    "yoghurt"
  ];

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
  const GFlist = [
    "almond flour",
    "angel hair pasta",
    "arborio rice",
    "baguette",
    "basmati rice",
    "bread",
    "bread flour",
    "brown rice",
    "brown rice flour",
    "bulgur",
    "cake flour",
    "cereal",
    "coconut flour",
    "cooked quinoa",
    "cooked wild rice",
    "corn flakes cereal",
    "corn flour",
    "cornstarch",
    "garbanzo bean flour",
    "grain blend",
    "italian bread",
    "jasmine rice",
    "oat flour",
    "oats",
    "pastry flour",
    "potato starch",
    "quinoa",
    "quinoa flour",
    "rice flour",
    "rice noodles",
    "rice paper",
    "rye bread",
    "rye meal",
    "self-rising flour",
    "short grain rice",
    "sourdough bread",
    "spaghetti",
    "spelt flour",
    "steel cut oats",
    "tapioca flour",
    "whole weat flour",
    "whole weat bread"
  ];

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
  const LSlist = [
    "sesame oil",
    "olive oil",
    "vegetable oil",
    "coconut oil",
    "peanut oil",
    "sunflower oil",
    "coconut milk",
    "almond milk",
    "soy milk",
    "beef stock",
    "chicken stock",
    "fish stock",
    "vegetable broth",
    "mayonnaise",
    "ketchup",
    "mustard",
    "vinegar",
    "soy sauce",
    "light soy sauce",
    "balsamic vinegar",
    "worcestershire sauce",
    "hot sauce",
    "bbq sauce",
    "ranch dressing",
    "cider vinegar",
    "rice vinegar",
    "fish sauce",
    "teriyaki sauce",
    "tahini",
    "honey mustard",
    "mirin",
    "tomato paste",
    "salsa",
    "pesto",
    "gravy",
    "whole cranberry sauce",
    "coffee",
    "orange juice",
    "tomato juice",
    "apple juice",
    "chocolate milk",
    "ginger ale",
    "white wine",
    "beer",
    "red wine",
    "vodka",
    "whiskey",
    "tequila",
    "sherry",
    "bourbon",
    "gin",
    "kahlua",
    "champagne"
  ];

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
  const Misclist = [
    "almond extract",
    "baking bar",
    "baking soda",
    "balsamic glaze",
    "balsamic vinegar",
    "black pepper",
    "bbq sauce",
    "bourbon",
    "brandy",
    "brown sugar",
    "casear dressing",
    "cajun seasoning",
    "caramel sauce",
    "champagne",
    "coffee",
    "kahlua",
    "kosher salt",
    "maple syrup",
    "olive oil",
    "onion powder",
    "oregano",
    "pesto",
    "red pepper flakes",
    "salt",
    "saffron threads",
    "sage",
    "seasoning",
    "seasame oil",
    "sugar",
    "tahini",
    "vanilla bean",
    "white sugar",
    "white pepper",
    "white vinegar",
    "wine",
    "white bread"
  ];

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
        <button
          onClick={handleAllCategory}
          className={
            showCategory === "ALL"
              ? "handle-category-button-orange"
              : "handle-category-button-white"
          }
        >
          All
        </button>

        <button
          onClick={handleFVCategory}
          className={
            showCategory === "FV"
              ? "handle-category-button-orange"
              : "handle-category-button-white"
          }
        >
          FV
        </button>

        <button
          onClick={handleMSCategory}
          className={
            showCategory === "MS"
              ? "handle-category-button-orange"
              : "handle-category-button-white"
          }
        >
          MS
        </button>

        <button
          onClick={handleDYCategory}
          className={
            showCategory === "DY"
              ? "handle-category-button-orange"
              : "handle-category-button-white"
          }
        >
          DY
        </button>

        <button
          onClick={handleGFCategory}
          className={
            showCategory === "GF"
              ? "handle-category-button-orange"
              : "handle-category-button-white"
          }
        >
          GF
        </button>

        <button
          onClick={handleLSCategory}
          className={
            showCategory === "LS"
              ? "handle-category-button-orange"
              : "handle-category-button-white"
          }
        >
          LS
        </button>

        <button
          onClick={handleMiscCategory}
          className={
            showCategory === "MISC"
              ? "handle-category-button-orange"
              : "handle-category-button-white"
          }
        >
          MISC
        </button>
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
