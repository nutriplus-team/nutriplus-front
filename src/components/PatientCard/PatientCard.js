import React from 'react';

import { Button, Grid, Divider, Item, List, Placeholder } from 'semantic-ui-react';

const patientCard = (props) => (
    <div>
        <Grid style={ { margin: '20px' } }>
        <Grid.Row columns={ 1 }>
            <Button
              color="teal"
              size="small"
              onClick={ props.backOnClick }
            >
            Pacientes
            </Button>
        </Grid.Row>
        <Divider />
        <Grid.Row style = { {textAlign: 'left' } } columns="equal">
            <Grid.Column></Grid.Column>
            <Grid.Column width={ 8 }>
            <Item >
                <Item.Content>
                    <Item.Header>
                        <Grid columns='equal'>
                            <Grid.Column width={ 6 } >
                                <h3>{props.info.name}</h3>
                            </Grid.Column>
                            <Grid.Column width={ 10 }>
                                <Button.Group floated='right'>
                                <Button
                                  color="teal"
                                  size="mini"
                                  onClick={ props.patientOnClick }
                                >
                                Editar
                                </Button>
                                <Button
                                  color="purple"
                                  size="mini"
                                  onClick={ props.deletePacientPreparation }
                                >
                                Excluir
                                </Button>
                                </Button.Group>
                            </Grid.Column>
                        </Grid>
                    </Item.Header>
                    <Item.Description>
                        <List horizontal>
                            <List.Item >
                                <List.Header>Data de nascimento</List.Header>{props.info.date_of_birth}
                            </List.Item>
                            <List.Item >
                                <List.Header>Sexo</List.Header>{props.info.biological_sex === 0 ? 'Feminino' : 'Masculino'}
                            </List.Item>
                            <List.Item >
                                <List.Header>Etnia</List.Header>{props.info.ethnic_group === 0 ? 'Branco/Hispânico' : 'Afroamericano'}
                            </List.Item>
                            <List.Item >
                                <List.Header>Restrições alimentares</List.Header>
                                {props.info.food_restrictions.length === 0
                                    ? 'Não há'
                                    : props.info.food_restrictions.reduce(
                                        (bigString, elem, index, arr) => bigString
                            + elem.food_name
                            + (index === arr.length - 1 ? '' : ', '),
                                        '',
                                    )}
                            </List.Item>
                        </List>
                    </Item.Description>
                </Item.Content>
            </Item>
            </Grid.Column>
            <Grid.Column></Grid.Column>
        </Grid.Row>
        <Divider />
        </Grid>
    </div>   
);

const patientCardPlaceholder = () => (
    <div>
        <Grid style={ { margin: '20px' } }>
        <Grid.Row columns={ 1 }>
            <Button
              color="teal"
              size="small"
              onClick={ () => {} }
            >
            Pacientes
            </Button>
        </Grid.Row>
        <Divider />
        <Grid.Row style = { {textAlign: 'left' } } columns="equal">
            <Grid.Column></Grid.Column>
            <Grid.Column width={ 8 }>
            <Item >
                <Item.Content>
                    <Item.Header>
                        <Grid columns='equal'>
                            <Grid.Column width={ 6 } >
                                <h3>
                                    <Placeholder><Placeholder.Line /></Placeholder>
                                </h3>
                            </Grid.Column>
                            <Grid.Column width={ 10 }>
                                <Button.Group floated='right'>
                                <Button
                                  color="teal"
                                  size="mini"
                                  onClick={ () => {} }
                                >
                                Editar
                                </Button>
                                <Button
                                  color="purple"
                                  size="mini"
                                  onClick={ () => {} }
                                >
                                Excluir
                                </Button>
                                </Button.Group>
                            </Grid.Column>
                        </Grid>
                    </Item.Header>
                    <Item.Description>
                        <List horizontal>
                            <List.Item >
                                <List.Header>Data de nascimento</List.Header>
                                <Placeholder><Placeholder.Line /></Placeholder>
                            </List.Item>
                            <List.Item >
                                <List.Header>Sexo</List.Header>
                                <Placeholder><Placeholder.Line /></Placeholder>
                            </List.Item>
                            <List.Item >
                                <List.Header>Etnia</List.Header>
                                <Placeholder><Placeholder.Line /></Placeholder>
                            </List.Item>
                            <List.Item >
                                <List.Header>Restrições alimentares</List.Header>
                                <Placeholder><Placeholder.Line /></Placeholder>
                            </List.Item>
                        </List>
                    </Item.Description>
                </Item.Content>
            </Item>
            </Grid.Column>
            <Grid.Column></Grid.Column>
        </Grid.Row>
        <Divider />
        </Grid>
    </div> 
);

export default patientCard;
export { patientCardPlaceholder };
