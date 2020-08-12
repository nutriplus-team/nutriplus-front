import React, { useState, useEffect } from 'react';

import { Grid, Button } from 'semantic-ui-react';

import { sendAuthenticatedRequest } from '../../utility/httpHelper';

import Meal from './Meal';
import MealTable from './MealTable';
import Infos from './Infos';
import SearchFood from './SearchFood';
import GenerateSuggestions from './GenerateSuggestions';

import IndicesTable from '../../components/IndicesTable/IndicesTable';

const translationMap = {
    'Calorias (kcal)': 'calories',
    'Proteínas (g)': 'proteins',
    'Carboidratos (g)': 'carbohydrates',
    'Lipídios (g)': 'lipids',
    'Fibra Alimentar (g)': 'fiber',
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
    const [indices, setIndices] = useState([]);
    const [available, setAvailable] = useState(null);

    useEffect(() => sendAuthenticatedRequest(
        '/graphql/get/',
        'post',
        () => {},
        (info) => {
            setFoods(info.data.listFood);
            setMounted2(0);
        },
        `query {
          listFood {
              foodName,
              measureType,
              measureAmount,
              nutritionFacts {
                calories,
                proteins,
                carbohydrates,
                lipids,
                fiber
              }
          }
      }`
    ), []);

    useEffect(() => sendAuthenticatedRequest(
        '/graphql/get/',
        'post',
        () => {},
        (info) => {
            setIndices({
                'bodyFat': {'name': info.data['getSingleRecord']['methodBodyFat'], 'value': info.data['getSingleRecord']['bodyFat']}, 
                'methabolicRate': {'name': info.data['getSingleRecord']['methodMethabolicRate'], 'value': info.data['getSingleRecord']['methabolicRate']}, 
                'energyRequirements': {'name':'Necessidades Energéticas', 'value': info.data['getSingleRecord']['energyRequirements']}
            });
        },
        `query {
            getSingleRecord(uuidRecord: "87972c5a61d940a3b418fe2b1f354c50") {
                methodBodyFat,
                methodMethabolicRate,
                bodyFat,
                methabolicRate,
                energyRequirements
          }
      }`
    ), []);

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
            const factors = {};
            foods.forEach((food) => {
                factors[food.foodName] = 1;
            });
            return factors;
        };
        if (foods && mounted2 === 0) {
            // console.log(foods.slice(7, 15)); // aqui preciso colocar um "if not logado, entao relogar."
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
        if (name === 'Next') {
            if (+meal === 5) {
                props.handleGlobal({
                    // nutritionFacts: nutritionFacts,
                    menus: menus,
                    factors: factors,
                });
                props.history.push(`/cardapio/${props.match.params.id}/fim`);
            } else setMeal(meal + 1);
        } else if (name === 'Prev') {
            if (meal > 0) setMeal(meal - 1);
            else setMeal(0);
        } else if (name === 'Infos') {
            setMeal(value);
        }
    };

    const handleSuggestedNutFacts = (newNF, meal) => {
        const NFArray = suggestedNutFacts.map((item, index) => {
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
            }
            return item;
        });
        setMenus(newMenus);
    };

    const handleAvailable = (meal, availableItems) => {
        const newAvailable = available.map((item, j) => {
            if (j === meal) {
                return availableItems;
            }
            return item;
        });
        setAvailable(newAvailable);
    };

    const handleFactors = (meal, factorsLocal) => {
        const new_factors = factors.map((item, j) => {
            if (j === meal) {
                return factorsLocal;
            }
            return item;
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
            }
            return item;
        });
        setQueryResults(null);
        setSearchQuery('');
        setAvailable(newAvailable);
    };

    if (mounted1) {
        return (
            <div>
                <Grid>
                    <Grid.Column width={ 2 }>
                        <MealTable handleMeal={ handleMealChange } meal={ meal } />
                    </Grid.Column>
                    <Grid.Column width={ 3 }>
                        <h4>
                            <Infos nutritionFacts={ nutritionFacts } />
                            <SearchFood
                              handlefoodClick={ handlefoodClick }
                              meal={ meal }
                              foodRestrictions={ props.foodRestrictions }
                            />
                        </h4>
                    </Grid.Column>
                    <Grid.Column width={ 7 }>
                        <Meal
                          meal={ meal }
                          available={ available }
                          handleAvailable={ handleAvailable }
                          menus={ menus }
                          handleMenus={ handleMenus }
                          attributes={ props.attributes }
                          handleInfos={ handleInfos }
                          factors={ factors }
                          handleFactors={ handleFactors }
                        />
                        <br />
                        <br />
                        <Grid>
                            <Grid.Column width={ 2 } floated="left">
                                <Button name="Prev" onClick={ handleMealChange }>
                  Prev
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={ 2 } floated="right">
                                <Button name="Next" onClick={ handleMealChange }>
                  Next
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width={ 4 }>
                        <IndicesTable //87972c5a61d940a3b418fe2b1f354c50
                          indices={ indices }
                        />
                        <br />
                        <GenerateSuggestions
                          translationMap={ translationMap }
                          attributes={ props.attributes }
                          meal={ meal }
                          NF={ suggestedNutFacts }
                          handleNFs={ handleSuggestedNutFacts } // handle dos valores digitados
                          handleMenus={ handleMenus } // handle do cardapio em si
                          handleFactors={ handleFactors } // handle dos fatores
                          factors={ factors }
                          patient_id={ props.match.params.id }
                        />
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
    return '';
};

export default MainSuggestions;
