import React, { useState, useEffect } from 'react';

import { Table, Button, Placeholder } from 'semantic-ui-react';

import { sendAuthenticatedRequest } from '../../../../utility/httpHelper';

const headersOrderedList = [
    'foodName',
    'foodGroup',
    'measureTotalGrams',
    'measureType',
    'measureAmount',
    'nutritionFacts',
    'mealSet'
];
const nutritionFactsOrderedList = [
    'calories',
    'proteins',
    'carbohydrates',
    'lipids',
    'fiber'
];

const FoodsTableRow = (props) => {
    const [food, setFood] = useState(props.food);
    const [loaded, setLoaded] = useState(false);

    const getMoreInfo = () => {
        sendAuthenticatedRequest(
            '/graphql/get/',
            'post',
            (message) => props.setError(message),
            (info) => {
                const newFood = {...food};
                newFood['nutritionFacts'] = info.data['getUnits'];
                newFood['mealSet'] = info.data['listMealsThatAFoodBelongsTo'];
                setFood(newFood);
                setLoaded(true);
            },
            `query {
                getUnits(uuidFood: "${food['uuid']}") {
                    calories,
                    proteins,
                    carbohydrates,
                    lipids,
                    fiber,
                },
                listMealsThatAFoodBelongsTo(uuidFood: "${food['uuid']}")
            }`
        );
    };
    useEffect(getMoreInfo, [props]);

    const mapMeal = (mealNumber) => {
        switch (mealNumber) {
        case 0:
            return 'Café da manhã';
        case 1:
            return 'Lanche da manhã';
        case 2:
            return 'Almoço';
        case 3:
            return 'Lanche da tarde';
        case 4:
            return 'Pré-Treino';
        case 5:
            return 'Jantar';
        default:
            return 'Wrong usage';
        }
    };

    const nutritionPlaceholder = () => [...Array(5).keys()]
        .map((idx) => ( 
            <Table.Cell key={ 'nutritionFacts-placeholder' + idx }>
                {
                    loaded ? null
                        : (
                            <Placeholder>
                                <Placeholder.Line />
                            </Placeholder>
                        )
                }
            </Table.Cell>)
        );

    const mealPlaceholder = () => (
        <Table.Cell key={ 'mealSet-placeholder-meal' }></Table.Cell>
    );

    const mapKey = (key) => {
        switch (key) {
        case 'nutritionFacts':
            return food[key] === undefined 
                ? nutritionPlaceholder()
                : nutritionFactsOrderedList
                    .map((nutritionKey) => (
                            <Table.Cell key={ key + nutritionKey }>
                            {
                                food[key][nutritionKey]
                            }
                            </Table.Cell>
                    ));

        case 'mealSet':
            return food[key] === undefined
                ? mealPlaceholder()
                : (
                    <Table.Cell key={ key }>
                        {
                            food[key]
                                .map((meal) => mapMeal(meal))
                                .join(', ')
                        }
                    </Table.Cell>
                );

        default:
            return (
                    <Table.Cell key={ key }>
                        {
                            food[key]
                        }
                    </Table.Cell>
            );
        }
    };

    return (
        <Table.Row onDoubleClick={ () => props.handleClick() }>
            {
                headersOrderedList
                    .flatMap((key) => mapKey(key))
            }
            <Table.Cell>
                <Button
                  size='big'
                  icon='remove' 
                  disabled={ !food['custom'] && !food['created'] }
                  onClick={ () => props.handleButton() }
                />
            </Table.Cell>
        </Table.Row>
    );
};

export default FoodsTableRow;
