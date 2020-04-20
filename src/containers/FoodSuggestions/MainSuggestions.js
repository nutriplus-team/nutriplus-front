import React, { useState, useEffect } from "react";
import Meal from "./Meal";
import MealTable from "./MealTable";
import Infos from "./Infos";
import { Grid, Button } from "semantic-ui-react";
import SearchFood from "./SearchFood";
import GenerateSuggestions from "./GenerateSuggestions";
import { sendAuthenticatedRequest } from "../../utility/httpHelper";

const translationMap = {
  "Calorias (kcal)": "calories",
  "Proteínas (g)": "proteins",
  "Carboidratos (g)": "carbohydrates",
  "Lipídeos (g)": "lipids",
  "Fibra Alimentar (g)": "fiber",
};

const MainSuggestions = (props) => {
  const [meal, setMeal] = useState(null);
  const [nutritionFacts, setNutritionFacts] = useState(null);
  const [suggestedNutFacts, setSuggestedNutFacts] = useState(null);
  const [menus, setMenus] = useState(null);
  const [factors, setFactors] = useState(null);
  const [mounted1, setMounted1] = useState(null);
  const [mounted2, setMounted2] = useState(null);
  const [foods, setFoods] = useState(null);
  const [available, setAvailable] = useState(null);

  useEffect(() => {
    const runEffect = async () => {
      sendAuthenticatedRequest(
        "/foods/list-foods/",
        "get",
        () => {},
        (info) => {
          setFoods(info);
          setMounted2(0);
        }
      );
    };

    runEffect();
  }, []);

  useEffect(() => {
    const initializeAttributes = () => {
      let resp;
      props.attributes.forEach((attribute) => {
        if (resp) resp.push([attribute, 0]);
        else resp = [[attribute, 0]];
      });
      return resp;
    };
    const initializeFactors = () => {
      let factors = {};
      foods.forEach((food) => {
        factors[food.food_name] = 1;
      });
      return factors;
    };
    if (foods && mounted2 === 0) {
      //console.log(foods.slice(7, 15)); // aqui preciso colocar um "if not logado, entao relogar."
      setMeal(0);
      setNutritionFacts(initializeAttributes());
      setSuggestedNutFacts([
        initializeAttributes(),
        initializeAttributes(),
        initializeAttributes(),
        initializeAttributes(),
        initializeAttributes(),
        initializeAttributes(),
      ]);
      setMenus([[], [], [], [], [], []]);
      setAvailable([
        foods.slice(7, 15),
        foods.slice(7, 15),
        foods.slice(7, 15),
        foods.slice(7, 15),
        foods.slice(7, 15),
        foods.slice(7, 15),
      ]);
      setFactors([
        initializeFactors(),
        initializeFactors(),
        initializeFactors(),
        initializeFactors(),
        initializeFactors(),
        initializeFactors(),
      ]);
      setMounted1(1);
      setMounted2(1);
    }
  }, [foods, mounted2, props.attributes]);

  const handleMealChange = (e, { name, value }) => {
    if (name === "Next") {
      if (+meal === 5) {
        props.handleGlobal({
          //nutritionFacts: nutritionFacts,
          menus: menus,
          factors: factors,
        });
        props.history.push("/cardapio/" + props.match.params["id"] + "/fim");
      } else setMeal(meal + 1);
    } else if (name === "Prev") {
      if (meal > 0) setMeal(meal - 1);
      else setMeal(0);
    } else if (name === "Infos") {
      setMeal(value);
    }
  };

  const handleSuggestedNutFacts = (newNF, meal) => {
    let NFArray = suggestedNutFacts.map((item, index) => {
      if (index === meal) {
        return newNF;
      }
      return item;
    });
    setSuggestedNutFacts(NFArray);
  };

  const handleMenus = (meal, menu) => {
    const newMenus = menus.map((item, j) => {
      if (j === meal) {
        return menu;
      } else {
        return item;
      }
    });
    setMenus(newMenus);
  };

  const handleAvailable = (meal, available_items) => {
    const newAvailable = available.map((item, j) => {
      if (j === meal) {
        return available_items;
      } else {
        return item;
      }
    });
    setAvailable(newAvailable);
  };

  const handleFactors = (meal, factors_local) => {
    const new_factors = factors.map((item, j) => {
      if (j === meal) {
        return factors_local;
      } else {
        return item;
      }
    });
    setFactors(new_factors);
  };

  const handleInfos = (nutritionFacts) => {
    setNutritionFacts(nutritionFacts);
  };

  const handlefoodClick = (newFood, meal, setQueryResults, setSearchQuery) => {
    const newAvailable = available.map((item, j) => {
      if (j === meal) {
        if (item.indexOf(newFood) === -1) item.push(newFood);
        return item;
      } else {
        return item;
      }
    });
    setQueryResults(null);
    setSearchQuery("");
    setAvailable(newAvailable);
  };

  if (mounted1)
    return (
      <div>
        <Grid>
          <Grid.Column width={2}>
            <MealTable handleMeal={handleMealChange} meal={meal}></MealTable>
          </Grid.Column>
          <Grid.Column width={3}>
            <h4>
              <Infos nutritionFacts={nutritionFacts}></Infos>
              <SearchFood
                handlefoodClick={handlefoodClick}
                meal={meal}
              ></SearchFood>
            </h4>
          </Grid.Column>
          <Grid.Column width={7}>
            <Meal
              meal={meal}
              available={available}
              handleAvailable={handleAvailable}
              menus={menus}
              handleMenus={handleMenus}
              attributes={props.attributes}
              handleInfos={handleInfos}
              factors={factors}
              handleFactors={handleFactors}
            ></Meal>
            <br></br>
            <br></br>
            <Grid>
              <Grid.Column width={2} floated="left">
                <Button name={"Prev"} onClick={handleMealChange}>
                  Prev
                </Button>
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                <Button name={"Next"} onClick={handleMealChange}>
                  Next
                </Button>
              </Grid.Column>
            </Grid>
          </Grid.Column>
          <Grid.Column width={4}>
            <GenerateSuggestions
              translationMap={translationMap}
              attributes={props.attributes}
              meal={meal}
              NF={suggestedNutFacts}
              handleNFs={handleSuggestedNutFacts} // handle dos valores digitados
              handleMenus={handleMenus} // handle do cardapio em si
              handleFactors={handleFactors} // handle dos fatores
              factors={factors}
              patient_id={props.match.params["id"]}
            ></GenerateSuggestions>
          </Grid.Column>
        </Grid>
      </div>
    );
  else return "";
};

export default MainSuggestions;
