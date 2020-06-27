import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Grid, Divider, Item, List, GridColumn } from 'semantic-ui-react';
import { sendAuthenticatedRequest } from '../../../utility/httpHelper';
import Paginator from '../../../utility/paginator';

class Patient extends Component {
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
                    <Grid.Row columns={ 1 }>
                        <Button
                          color="teal"
                          size="small"
                          onClick={ () => this.props.history.push('/pacientes') }
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
                                            <h3>{this.state.info.name}</h3>
                                        </Grid.Column>
                                        <Grid.Column width={ 10 }>
                                            <Button.Group floated='right'>
                                            <Button
                                              color="teal"
                                              size="mini"
                                              onClick={ () => this.props.history.push(`/pacientes/${params.id}/edit`) }
                                            >
                                            Editar
                                            </Button>
                                            <Button
                                              color="purple"
                                              size="mini"
                                              onClick={ this.deletePacient }
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
                                            <List.Header>Data de nascimento</List.Header>{this.state.info.date_of_birth}
                                        </List.Item>
                                        <List.Item >
                                            <List.Header>Sexo</List.Header>{this.state.info.biological_sex === 0 ? 'Feminino' : 'Masculino'}
                                        </List.Item>
                                        <List.Item >
                                            <List.Header>Etnia</List.Header>{this.state.info.ethnic_group === 0 ? 'Branco/Hispânico' : 'Afroamericano'}
                                        </List.Item>
                                        <List.Item >
                                            <List.Header>Restrições alimentares</List.Header>
                                            {this.state.info.food_restrictions.length === 0
                                                ? 'Não há'
                                                : this.state.info.food_restrictions.reduce(
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
              ) : null}
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
                                      onClick={ () => this.props.history.push(`/pacientes/${params.id}/criar-ficha`,) }
                                    >
                                    Nova Consulta
                                    </Button>
                                    </GridColumn>
                                    <GridColumn width={ 6 }></GridColumn>
                                </Grid>
                            </Grid.Row>
                            <Grid.Row>
                                {this.state.recordQueryInfo ? (
                                
                                <Paginator
                                  isConsultList
                                  queryResults={ this.state.recordQueryInfo }
                                  filter={ () => true }
                                  listElementMap={ (record) => (
                                    <div
                                      key={ record.id }
                                      onClick={ () => this.props.history.push(`/pacientes/${params.id}/ficha/${record.id}`,) }
                                    >
                                    <span>Data: {record.date_modified}</span>
                                    <span>Peso:{record.corporal_mass}</span>
                                    <span>Altura:{record.height}</span>
                                    <span>IMC:{record.BMI}</span>
                                    </div>
                                  ) }
                                  setResults={ (recordInfo) => this.setState({ recordQueryInfo: recordInfo }) }
                                  setHasNext={ (value) => this.setState({ hasNext: value }) }
                                  setHasPrevious={ (value) => this.setState({ hasPrevious: value }) }
                                  setMessage={ (message) => this.setState({
                                      error: message,
                                  }) }
                                  hasPrevious={ this.state.hasPrevious }
                                  hasNext={ this.state.hasNext }
                                  buttonSize="large"
                                />
                                
                                ) : (<p>Ainda não há consultas para esse paciente!</p>)}
                            </Grid.Row>
                    </Grid.Column>
                    <Grid.Column></Grid.Column>
                    </Grid.Row>
                </Grid>
              
              
              {this.state.redirectUrl && <Redirect to={ this.state.redirectUrl } />}
          </div>
      );
  }
}

export default Patient;
