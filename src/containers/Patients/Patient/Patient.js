import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { sendAuthenticatedRequest } from '../../../utility/httpHelper';
import Paginator from '../../../utility/paginator';
import classes from './Patient.module.css';

/*const mealMap = {
    0: 'Café da manhã',
    1: 'Lanche da manhã',
    2: 'Almoço',
    3: 'Lanche da tarde',
    4: 'Jantar',
    5: 'Lanche da noite',
};*/

const pageSize = 10;

class Patient extends Component {
  state = {
      recordQueryInfo: null,
      menuInfo: null,
      restrictions: [],
      info: null,
      error: null,
      redirectUrl: null,
      page: null,
      totalRecords: null
  };

  getAllRecords = async () => sendAuthenticatedRequest(
      '/graphql/get/',
      'post',
      (message) => this.setState({
          error: message,
      }),
      (info) => this.setState({
          totalRecords: info.data['getPatientRecords'].length,
          page: 0
      }),
      `query {
          getPatientRecords(uuidPatient: "${this.props.match.params.id}", indexPage: 0, sizePage: 1000000000)
      {
          dateModified, uuid
      }
      }`
  );

  getRecords = async ({redirect}) => sendAuthenticatedRequest(
      '/graphql/get/',
      'post',
      (message) => this.setState({
          error: message,
      }),
      (info) => this.setState({
          recordQueryInfo: info,
          redirectUrl: redirect ? `/pacientes/${this.props.match.params.id}` : null
      }),
      `query {
          getPatientRecords(uuidPatient: "${this.props.match.params.id}", indexPage: ${this.state.page}, sizePage: ${pageSize})
      {
          dateModified, uuid
      }
      }`
  );

  componentDidUpdate = async () => {
      if (this.props.location.search.length > 0) {
          const query = new URLSearchParams(this.props.location.search);
          if (query.get('refresh')) {
              await this.getAllRecords();
              this.getRecords({redirect: true});
          }
      }
  };

  componentDidMount = async () => {
      const { params } = this.props.match;
      sendAuthenticatedRequest(
          '/graphql/get/',
          'post',
          (message) => this.setState({
              error: message,
          }),
          (info) => this.setState({info: info.data.getPatientInfo}),
          `query {
            getPatientInfo(uuidPatient: "${params.id}")
            {
                uuid, name, ethnicGroup, email, dateOfBirth, nutritionist, cpf, biologicalSex
            }
          }`
      );
      sendAuthenticatedRequest(
          '/graphql/get/',
          'post',
          (message) => this.setState({error: message}),
          (info) => {
              this.setState({restrictions: info.data.getFoodRestrictions});
          },
          `{
            getFoodRestrictions(uuidPatient: "${params.id}")
        {
            uuid, foodName
        }
        }`
      );
      await this.getAllRecords();
      this.getRecords({redirect: false});
      /*sendAuthenticatedRequest(
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
      );*/
  };

  deletePatient = async () => {
      const { params } = this.props.match;
      sendAuthenticatedRequest(
          '/graphql/get/',
          'post',
          (message) => {
              this.setState({
                  error: message,
              });
          },
          (response) => {
              console.log('deletePatient response', response);
              this.setState({ redirectUrl: '/pacientes?refresh=true' });
          },
          `mutation{
            removePatient(uuidPatient: "${params.id}")
        }
        `
      );
  };

  render() {
      const { params } = this.props.match;
      return (
          <div>
              {this.state.error && <p>{this.state.error}</p>}
              {this.state.info && (
                  <div>
                      <h3>{this.state.info.name}</h3>
                      <Button
                        style={ { margin: '10px' } }
                        color="teal"
                        size="small"
                        onClick={ () => this.props.history.push(`/pacientes/${params.id}/edit`) }
                      >
Editar dados do paciente
                      </Button>
                      <p>
Data de nascimento:
{' '}
                          {this.state.info.dateOfBirth}
                      </p>
                      <p>
CPF:
{' '}
                          {this.state.info.cpf}
                      </p>
                      <p>
E-mail:
{' '}
                          {this.state.info.email}
                      </p>
                      <p>
              Sexo:
                          {' '}
                          {this.state.info.biologicalSex === 0 ? 'Feminino' : 'Masculino'}
                      </p>
                      <p>
              Etnia:
                          {' '}
                          {this.state.info.ethnicGroup === 0
                              ? 'Branco/Hispânico'
                              : 'Afroamericano'}
                      </p>
                      <p>
              Restrições alimentares: {' '}
                          {this.state.restrictions.length === 0
                              ? 'Não há'
                              : this.state.restrictions.reduce(
                                  (bigString, elem, index, arr) => bigString
                      + elem.foodName
                      + (index === arr.length - 1 ? '' : ', '),
                                  '',
                              )}
                      </p>
                  </div>
              )}
              <Button
                style={ { margin: '10px' } }
                color="teal"
                size="small"
                onClick={ () => this.props.history.push(
                    `/pacientes/${params.id}/criar-ficha`,
                ) }
              >
          Criar ficha para o paciente
              </Button>
              <Button
                style={ { margin: '10px' } }
                color="teal"
                size="small"
                onClick={ () => this.props.history.push(`/cardapio/${params.id}`) }
              >
          Criar cardápio para o paciente
              </Button>
              {/*this.state.menuInfo && this.state.menuInfo.map(menu => 
                  (<div key={ menu.id } style={ {margin: 'auto', width: '20%', border: '1px solid black'} }>
                      <h4>{ mealMap[menu.meal_type] }</h4>
                <p>{menu.portions.reduce((prev, curr)=> prev+` ${curr.quantity} ${curr.food.food_name}`, '')}</p></div>))
              */}
              <br />
              {this.state.recordQueryInfo ? (
                  <div className={ classes.records }>
                      <Paginator
                        queryResults={ this.state.recordQueryInfo }
                        totalLength={ this.state.totalRecords }
                        pageSize={ pageSize }
                        page={ this.state.page }
                        changePage={ (pageNumber) => this.setState({page: pageNumber}, () => this.getRecords({redirect: false})) }
                        queryString={ 'getPatientRecords' }
                        filter={ () => true }
                        listElementMap={ (record) => (
                              <div
                                key={ record.uuid }
                                onClick={ () => this.props.history.push(
                                    `/pacientes/${params.id}/ficha/${record.uuid}`,
                                ) }
                                className={ classes.record }
                              >
                                  <p>
                                      Consulta de {record.dateModified}
                                  </p>
                              </div>
                        ) }
                        setResults={ (recordInfo) => this.setState({ recordQueryInfo: recordInfo }) }
                        setMessage={ (message) => this.setState({
                            error: message,
                        }) }
                        buttonSize="large"
                      />
                  </div>
              ) : (
                  <p>Ainda não há uma ficha para esse paciente!</p>
              )}
              <Button
                className={ classes.backButton }
                color="teal"
                size="medium"
                onClick={ () => this.props.history.push('/pacientes') }
              >
          Voltar à página de pacientes
              </Button>
              <Button
                style={ { margin: '200px auto' } }
                color="red"
                size="small"
                onClick={ this.deletePatient }
              >
          Excluir paciente
              </Button>
              {this.state.redirectUrl && <Redirect to={ this.state.redirectUrl } />}
          </div>
      );
  }
}

export default Patient;
