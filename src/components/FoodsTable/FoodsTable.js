import React from 'react';

import { Message, Table, Button, Icon, Placeholder } from 'semantic-ui-react';

import Paginator from '../../utility/paginator';

import FoodsTableRow from './FoodsTableRow/FoodsTableRow';

const foodsTable = (props) => {
    const header = (
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Alimento</Table.HeaderCell>
                <Table.HeaderCell>Grupo do alimento</Table.HeaderCell>
                <Table.HeaderCell>Peso da porção (em gramas)</Table.HeaderCell>
                <Table.HeaderCell>Unidade da medida</Table.HeaderCell>
                <Table.HeaderCell>Quantidade da medida</Table.HeaderCell>
                <Table.HeaderCell>Valor energético (kcal)</Table.HeaderCell>
                <Table.HeaderCell>Proteínas (g)</Table.HeaderCell>
                <Table.HeaderCell>Carboidratos (g)</Table.HeaderCell>
                <Table.HeaderCell>Lipídios (g)</Table.HeaderCell>
                <Table.HeaderCell>Fibra alimentar (g)</Table.HeaderCell>
                <Table.HeaderCell>Refeições</Table.HeaderCell>
                <Table.HeaderCell>
                    <Button icon size='big' onClick={ () => props.handleAdd() }>
                        <Icon name='add square' />
                    </Button>
                </Table.HeaderCell>
            </Table.Row>
        </Table.Header>
    );

    const placeholder = (
        <Paginator
          queryResults={ {results: [...Array(10).keys()]} }
          filter={ () => true }
          listElementMap={ (elem) => (
                <Table.Row key={ elem }>
                    {
                        [...Array(12).keys()].map((idx) => (
                            <Table.Cell key={ idx }>
                                <Placeholder>
                                    <Placeholder.Line />
                                </Placeholder>
                            </Table.Cell>
                        ))
                    }
                </Table.Row>
          ) }
          setResults={ () => {} }
          setHasNext={ () => {} }
          setHasPrevious={ () => {} }
          setMessage={ () => {} }
          hasPrevious={ false }
          hasNext={ false }
          buttonSize="huge"
          isTable
          tableHeader={ header }
        />
    );

    return (
        <>
            <Message error
              hidden={ props.error === null }
              header={ 'Erro ao se comunicar com o serviço.' }
              content={ props.error }
            />
            {
                !props.loaded ?
                    placeholder :
                    <Paginator
                      queryResults={ props.foodInfo }
                      filter={ () => true }
                      listElementMap={ (food, idx) => (
                        <FoodsTableRow 
                          food={ food } 
                          key={ food.id } 
                          handleClick={ () => props.handleClick(food.id, idx) }
                          handleButton={ () => props.handleRemove(food.id, idx) }
                        />
                      ) }
                      setResults={ (foodInfo) => props.setFoodInfo(foodInfo) }
                      setHasNext={ (value) => props.setHasNext(value) }
                      setHasPrevious={ (value) => props.setHasPrevious(value) }
                      setMessage={ (message) => props.setError(message) }
                      hasPrevious={ props.hasPrevious }
                      hasNext={ props.hasNext }
                      buttonSize="huge"
                      isTable
                      tableHeader={ header }
                    />
            }
        </>
    );
};

export default foodsTable;
