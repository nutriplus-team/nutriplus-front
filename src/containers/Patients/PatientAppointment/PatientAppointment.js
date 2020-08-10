import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Grid, Divider } from 'semantic-ui-react';
import { sendAuthenticatedRequest } from '../../../utility/httpHelper';
import PatientRecordCreator from '../PatientRecord/PatientRecordCreator/PatientRecordCreator';

class PatientAppoiment extends Component {
  state = {
      recordQueryInfo: null,
      menuInfo: null,
      info: null,
      error: null,
      hasNext: false,
      hasPrevious: false,
      redirectUrl: null,
  };

  componentDidUpdate = async () => {
      if (this.props.location.search.length > 0) {
          const { params } = this.props.match;
          const query = new URLSearchParams(this.props.location.search);
          if (query.get('refresh')) {
              sendAuthenticatedRequest(
                  `/patients/get-records/${params.id}/`,
                  'get',
                  (message) => {
                      this.setState({
                          error: message,
                      });
                  },
                  (recordInfo) => this.setState({
                      recordQueryInfo: recordInfo,
                      hasPrevious: false,
                      hasNext: recordInfo.next !== null,
                      redirectUrl: `/pacientes/${params.id}`,
                  }),
              );
          }
      }
  };

  componentDidMount = async () => {
      const { params } = this.props.match;
      sendAuthenticatedRequest(
          `/patients/get-info/${params.id}/`,
          'get',
          (message) => this.setState({
              error: message,
          }),
          (info) => this.setState({ info }),
      );
      sendAuthenticatedRequest(
          `/patients/get-records/${params.id}/`,
          'get',
          (message) => {
              this.setState({
                  error: message,
              });
          },
          (recordInfo) => this.setState({
              recordQueryInfo: recordInfo,
              hasPrevious: false,
              hasNext: recordInfo.next !== null,
          }),
      );
      sendAuthenticatedRequest(
          `/menu/get-all/${params.id}/`,
          'get',
          (message) => {
              this.setState({
                  error: message
              });
          },
          (menuInfo) => this.setState({
              menuInfo: menuInfo
          })
      );
  };

  deletePacient = async () => {
      const { params } = this.props.match;
      sendAuthenticatedRequest(
          `/patients/remove-patient/${params.id}/`,
          'get',
          (message) => {
              this.setState({
                  error: message,
              });
          },
          () => {
              this.setState({ redirectUrl: '/pacientes?refresh=true' });
          },
      );
  };

  render() {
      const { params } = this.props.match;
      return (
          <div>
              {this.state.error ? <p>{this.state.error}</p> : null}
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
                            <h2> Nova consulta de {this.state.info.name}</h2>
                        </Grid.Column>
                        <Grid.Column>
                            <Button
                              color="teal"
                              size="big"
                              onClick={ () => this.props.history.push(`/pacientes/${params.id}/edit`) }
                            >
                            Finalizar Consulta
                            </Button> 
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
                    <PatientRecordCreator { ...this.props } />
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column>
                    <Grid.Row>
                        <h2 style = { {textAlign: 'center', marginTop: '10px' } }>Cardápio</h2>   
                    </Grid.Row>
                    <Grid.Row>
                    <Button
                      style={ { margin: '10px' } }
                      color="teal"
                      size="small"
                      onClick={ () => this.props.history.push(`/cardapio/${params.id}`) }
                    >
                    Novo Cardápio
                    </Button> 
                    </Grid.Row>
                </Grid.Column>
            </Grid>
              {this.state.redirectUrl && <Redirect to={ this.state.redirectUrl } />}
          </div>
      );
  }
}

export default PatientAppoiment;
