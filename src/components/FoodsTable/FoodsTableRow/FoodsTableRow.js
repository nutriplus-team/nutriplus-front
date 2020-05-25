import React from 'react';

import { Table, Button } from 'semantic-ui-react';

const foodsTableRow = (props) => {
    const mapMeal = (mealNumber) => {
        switch (mealNumber) {
        case 1:
            return 'Café da manhã';
        case 2:
            return 'Lanche da manhã';
        case 3:
            return 'Almoço';
        case 4:
            return 'Lanche da tarde';
        case 5:
            return 'Jantar';
        case 6:
            return 'Lanche da noite';
        default:
            return 'Wrong usage';
        }
    };

    const mapKey = (key) => {
        switch (key) {
        case 'nutrition_facts':
            return Object.keys(props.food[key])
                .map((nutritionKey) => (
                        <Table.Cell key={ key + nutritionKey }>
                        {
                            props.food[key][nutritionKey]
                        }
                        </Table.Cell>
                ));
        case 'meal_set':
            return (
                    <Table.Cell key={ key }>
                        {
                            props.food[key]
                                .map((meal) => mapMeal(meal))
                                .join(', ')
                        }
                    </Table.Cell>
            );
        default:
            return (
                    <Table.Cell key={ key }>
                        {
                            props.food[key]
                        }
                    </Table.Cell>
            );
        }
    };

    return (
        <Table.Row onDoubleClick={ () => props.handleClick() }>
            {
                Object.keys(props.food)
                    .filter((key) => key !== 'id')
                    .flatMap((key) => mapKey(key))
            }
            <Table.Cell>
                <Button
                  size='big'
                  icon='remove' 
                  onClick={ () => props.handleButton() }
                />
            </Table.Cell>
        </Table.Row>
    );
};

export default foodsTableRow;
