import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Grid, Divider } from 'semantic-ui-react';
import { sendAuthenticatedRequest } from '../../../utility/httpHelper';
import PatientRecordCreator from '../PatientRecord/PatientRecordCreator/PatientRecordCreator';
import DisplayMenu from './Menu/DisplayMenu';

class PatientAppoiment extends Component {
  state = {
      info: null,
      error: null,
      redirectUrl: null,
  };

  componentDidMount = async () => {
    const { params } = this.props.match;
    sendAuthenticatedRequest(
        '/graphql/get/',
        'post',
        (message) => this.setState({
            message: message,
        }),
        (info) => this.setState({info: info.data.getPatientInfo}),
        `query {
          getPatientInfo(uuidPatient: "${params.id}")
          {
              uuid, name, ethnicGroup, email, dateOfBirth, nutritionist, cpf, biologicalSex
          }
        }`
    );
  };

  render() {
      const { params } = this.props.match;
      return (
          <div>
              {console.log(this.props)}
              {this.state.info ? (
                  <div>
                  <Grid style={ { margin: '20px' } }>
                    <Grid.Row style = { {textAlign: 'center' } } columns="equal">
                        <Grid.Column style = { {textAlign: 'left' } }>
                            <Button
                              color="teal"
                              size="small"
                              onClick={ () => this.props.history.push(`/pacientes/${params.id}`) }
                            >
                            Voltar
                            </Button>
                        </Grid.Column>
                        <Grid.Column  >
                            {this.props.firstTimeCreate ? 
                            <h2> Nova consulta de {this.state.info.name}</h2> : 
                            <h2> Consulta de {this.state.info.name}</h2>}
                        </Grid.Column>
                        <Grid.Column>
                            {this.props.firstTimeCreate ? 
                            <Button
                              color="teal"
                              size="big"
                              onClick={ () => this.props.history.push(`/pacientes/${params.id}/edit`) }
                            >
                            Finalizar Consulta
                            </Button> : null}
                        </Grid.Column>
                    </Grid.Row>
                    <Divider />
                  </Grid>
                  </div>    
              ) : null}
            <Grid style={ { margin: '20px' } } divided columns="equal">
                <Grid.Column width={ 8 }>
                    <Grid.Row>
                        <h2 style = { {textAlign: 'center', marginTop: '10px' } }>Ficha do Paciente</h2>   
                    </Grid.Row>
                    <Grid.Row>
                    <PatientRecordCreator { ...this.props } create={this.props.firstTimeCreate}/>
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column>
                    <Grid.Row>
                        <h2 style = { {textAlign: 'center', marginTop: '10px' } }>Cardápio</h2>   
                    </Grid.Row>
                    <Grid.Row>
                    {this.props.firstTimeCreate? 
                    <Button
                      style={ { margin: '10px' } }
                      color="teal"
                      size="small"
                      onClick={ () => this.props.history.push(`/cardapio/${params.id}`) }
                    >
                    Novo Cardápio
                    </Button> : <DisplayMenu { ...this.props }/>}
                    </Grid.Row>
                </Grid.Column>
            </Grid>
              {this.state.redirectUrl && <Redirect to={ this.state.redirectUrl } />}
          </div>
      );
  }
}

export default PatientAppoiment;
