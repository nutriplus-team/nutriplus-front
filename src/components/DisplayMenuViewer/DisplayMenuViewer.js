import React from 'react';

import { Table, Grid } from 'semantic-ui-react';

const mealMap = {
    0: 'Café da manhã',
    1: 'Lanche da manhã',
    2: 'Almoço',
    3: 'Lanche da tarde',
    4: 'Pré-Treino',
    5: 'Jantar',
};

const displayMenuViewer = (props) => {
    console.log(props.menus);
    const content = props.menus.map((menu, meal) => {
        const content = menu.map((actual, idx) => {
            // uma refeicao, uma tabela com varios "ou"
            console.log(actual);
            return actual !== null && actual !== undefined ? 
                (
                <Table.Body key={ actual.foodName }>
                    <Table.Row>
                        <Table.Cell>{actual.foodName}</Table.Cell>
                        <Table.Cell>
                            {`${(
                                Number(props.factors[meal][idx])
                                    * actual.measureAmount
                            ).toFixed(2)
                            } ${
                                actual.measureType}`}
                        </Table.Cell>
                        <Table.Cell>
                            {`${(
                                Number(props.factors[meal][idx])
                                    * actual.measureTotalGrams
                            ).toFixed(2)} g`}
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
                ) : null;
        });

        return (
            <React.Fragment key={ meal }>
                <Grid centered>
                    <Grid.Column width={ 9 }>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width={ 3 }>
                                        {mealMap[meal]}
                                    </Table.HeaderCell>
                                    <Table.HeaderCell width={ 3 }>
                    Quantidade caseira
                                    </Table.HeaderCell>
                                    <Table.HeaderCell width={ 3 }>
                    Quantidade em gramas
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            {content}
                        </Table>
                    </Grid.Column>
                </Grid>
            </React.Fragment>
        );
    });

    return content;
};

export default displayMenuViewer;

