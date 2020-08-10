import React from 'react';

import { Button, Grid, GridColumn, Placeholder } from 'semantic-ui-react';

import Paginator from '../../utility/paginator';

const patientRecords = (props) => (
    <Grid style={ { margin: '20px' } }>
        <Grid.Row style = { {textAlign: 'left' } } columns="equal">
            <Grid.Column></Grid.Column>
            <Grid.Column width={ 8 }>
                <Grid.Row>
                    <Grid  columns="equal">
                        <GridColumn>
                        <h2 style = { {textAlign: 'left', marginTop: '10px' } }>Consultas</h2>
                        </GridColumn>
                        <GridColumn>
                        <Button
                          style={ { margin: '10px' } }
                          color="teal"
                          size="small"
                          onClick={ props.newRecordOnClick }
                        >
                        Nova Consulta
                        </Button>
                        </GridColumn>
                        <GridColumn width={ 6 }></GridColumn>
                    </Grid>
                </Grid.Row>
                <Grid.Row>
                    {props.recordQueryInfo ? (
                    
                    <Paginator
                      isConsultList
                      queryResults={ props.recordQueryInfo }
                      filter={ () => true }
                      listElementMap={ (record) => (
                        <div
                          key={ record.id }
                          onClick={ () => props.editRecordOnClick(record.id) }
                        >
                        <span>Data: {record.date_modified}</span>
                        <span>Peso:{record.corporal_mass}</span>
                        <span>Altura:{record.height}</span>
                        <span>IMC:{record.BMI}</span>
                        </div>
                      ) }
                      setResults={ props.setResults }
                      setHasNext={ props.setHasNext }
                      setHasPrevious={ props.setHasPrevious }
                      setMessage={ props.setMessage }
                      hasPrevious={ props.hasPrevious }
                      hasNext={ props.hasNext }
                      buttonSize="large"
                    />
                    
                    ) : (<p>Ainda não há consultas para esse paciente!</p>)}
                </Grid.Row>
        </Grid.Column>
        <Grid.Column></Grid.Column>
        </Grid.Row>
    </Grid>
);

const patientRecordsPlaceholder = () => (
    <Grid style={ { margin: '20px' } }>
        <Grid.Row style = { {textAlign: 'left' } } columns="equal">
            <Grid.Column></Grid.Column>
            <Grid.Column width={ 8 }>
                <Grid.Row>
                    <Grid  columns="equal">
                        <GridColumn>
                        <h2 style = { {textAlign: 'left', marginTop: '10px' } }>Consultas</h2>
                        </GridColumn>
                        <GridColumn>
                        <Button
                          style={ { margin: '10px' } }
                          color="teal"
                          size="small"
                          onClick={ () => {} }
                        >
                        Nova Consulta
                        </Button>
                        </GridColumn>
                        <GridColumn width={ 6 }></GridColumn>
                    </Grid>
                </Grid.Row>
                <Grid.Row>
                    <Paginator
                      isConsultList
                      queryResults={ {results: [...Array(5).keys()]} }
                      filter={ () => true }
                      listElementMap={ (elem) => (
                        <div key={ elem }>
                          <div><Placeholder><Placeholder.Line/></Placeholder></div>
                          <div><Placeholder><Placeholder.Line/></Placeholder></div>
                          <div><Placeholder><Placeholder.Line/></Placeholder></div>
                          <div><Placeholder><Placeholder.Line/></Placeholder></div>
                        </div>
                      ) }
                      setResults={ () => {} }
                      setHasNext={ () => {} }
                      setHasPrevious={ () => {} }
                      setMessage={ () => {} }
                      hasPrevious={ false }
                      hasNext={ false }
                      buttonSize="large"
                    />
                </Grid.Row>
        </Grid.Column>
        <Grid.Column></Grid.Column>
        </Grid.Row>
    </Grid>
);

export default patientRecords;
export { patientRecordsPlaceholder };
