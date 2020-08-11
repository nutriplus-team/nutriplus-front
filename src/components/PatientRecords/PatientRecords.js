import React from 'react';

import { Button, Grid, GridColumn, Placeholder } from 'semantic-ui-react';

import Paginator from '../../utility/paginator';

const patientRecords = (props) => { console.log(props.recordQueryInfo); return (
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
                        pageSize={ props.pageSize }
                        page={ props.page }
                        changePage={ props.changePage }
                        queryString={ props.queryString }
                        filter={ () => true }
                        listElementMap={ (record) => (
                          <div
                            key={ record.uuid }
                            onClick={ () => props.editRecordOnClick(record.uuid) }
                          >
                          <span>Data: {record.dateModified}</span>
                          <span>Peso:{record.corporalMass}</span>
                          <span>Altura:{record.height}</span>
                          <span>IMC:{Number(record.corporalMass / (record.height ^2)).toFixed(1)}</span>
                          </div>
                        ) }
                        setMessage={ props.setMessage }
                        buttonSize="large"
                      />
                    
                    ) : (<p>Ainda não há consultas para esse paciente!</p>)}
                </Grid.Row>
        </Grid.Column>
        <Grid.Column></Grid.Column>
        </Grid.Row>
    </Grid>
);};

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
                      queryResults={ {data: {'placeholder': [...Array(5).keys()]}} }
                      pageSize={ 5 }
                      page={ 0 }
                      changePage={ () => {} }
                      queryString={ 'placeholder' }
                      filter={ () => true }
                      listElementMap={ (elem) => (
                        <div key={ elem }>
                          <div><Placeholder><Placeholder.Line/></Placeholder></div>
                          <div><Placeholder><Placeholder.Line/></Placeholder></div>
                          <div><Placeholder><Placeholder.Line/></Placeholder></div>
                          <div><Placeholder><Placeholder.Line/></Placeholder></div>
                        </div>
                      ) }
                      setMessage={ () => {} }
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
