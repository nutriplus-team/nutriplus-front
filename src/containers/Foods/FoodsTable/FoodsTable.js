import React from 'react';

import { Message, Table, Button, Icon, Placeholder } from 'semantic-ui-react';

import Paginator from '../../../utility/paginator';

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
          queryResults={ {data: {'placeholder': [...Array(10).keys()]}} }
          totalLength={ 10 }
          pageSize={ 10 }
          page={ 0 }
          changePage={ () => {} }
          queryString={ 'placeholder' }
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
                      totalLength={ props.totalLength }
                      pageSize={ props.pageSize }
                      page={ props.page }
                      changePage={ props.changePage }
                      queryString={ props.queryString }
                      filter={ () => true }
                      listElementMap={ (food, idx) => (
                        <FoodsTableRow 
                          setError={ props.setError }
                          food={ food } 
                          key={ food['uuid'] } 
                          handleClick={ () => props.handleClick(food['uuid'], idx) }
                          handleButton={ () => props.handleRemove(food['uuid'], idx) }
                        />
                      ) }
                      setMessage={ (message) => props.setError(message) }
                      buttonSize="huge"
                      isTable
                      tableHeader={ header }
                    />
            }
        </>
    );
};

export default foodsTable;
