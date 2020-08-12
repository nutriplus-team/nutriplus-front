import React, { Component } from 'react';
import { Button, Header, Placeholder } from 'semantic-ui-react';
import {
    Route, Switch, NavLink, Redirect,
} from 'react-router-dom';
import Patient from './Patient/Patient';
import Register from './Register/Register';
import PatientRecordCreator from './PatientRecord/PatientRecordCreator/PatientRecordCreator';
import { sendAuthenticatedRequest } from '../../utility/httpHelper';
import Paginator from '../../utility/paginator';
import classes from './Patients.module.css';
import PatientAppoiment from './PatientAppointment/PatientAppointment';

const placeholder =  (
  <Paginator
    queryResults={ {data: {placeholder: [...Array(10).keys()]}} }
    totalLength={ 10 }
    pageSize={ 10 }
    page={ 0 }
    changePage={ () => {} }
    queryString={ 'placeholder' }
    filter={ () => true }
    listElementMap={ (key) => (
          <li key={ key }>
              <Placeholder>
                <Placeholder.Line />
            </Placeholder>
          </li>
    ) }
    setMessage={ () => {} }
    isList
  />
);
const pageSize = 10;

class Patients extends Component {
  state = {
      patientsQueryInfo: null,
      error: null,
      totalPatients: null,
      redirect: false,
      page: null
  };

  getAllPatients = async () => sendAuthenticatedRequest(
      '/graphql/get/',
      'post',
      (message) => this.setState({
          error: message,
      }),
      (info) => this.setState({
          totalPatients: info.data['getAllPatients'].length,
          page: 0
      }),
      `query {
          getAllPatients(indexPage: 0, sizePage: 1000000000)
      {
          name, uuid
      }
      }`
  );

  getPatients = async ({redirect}) => sendAuthenticatedRequest(
      '/graphql/get/',
      'post',
      (message) => this.setState({
          error: message,
      }),
      (info) => this.setState({
          patientsQueryInfo: info,
          redirect: redirect
      }),
      `query {
        getAllPatients(indexPage: ${this.state.page}, sizePage: ${pageSize})
          {
            name, uuid
          }
      }`
  );

  componentDidUpdate = async () => {
      if (this.props.location.search.length > 0) {
          const query = new URLSearchParams(this.props.location.search);
          // console.log(this.props);
          if (
              query.get('refresh')
        && this.props.location.pathname === '/pacientes'
          ) {
              this.getPatients({redirect: true});
          }
      }
  };

  componentDidMount = async () => {
      await this.getAllPatients();
      this.getPatients({redirect: false});
  };

  render() {
      console.log('I\'ve been triggered.');
      return (
          <div>
              <Switch>
                  <Route
                    path="/pacientes/register"
                    render={ (props) => <Register { ...props } /> }
                  />
                  <Route
                    exact
                    path="/pacientes/:id/criar-ficha"
                    render={ (props) => <PatientAppoiment { ...props } firstTimeCreate/> }
                  />
                  <Route
                    exact
                    path="/pacientes/:id/ficha/:ficha_id"
                    render={ (props) => <PatientAppoiment { ...props }/> }
                  />
                  <Route
                    path="/pacientes/:id/ficha/:ficha_id/edit"
                    render={ (props) => <PatientRecordCreator { ...props } /> }
                  />
                  <Route
                    exact
                    path="/pacientes/:id"
                    render={ (props) => <Patient { ...props } /> }
                  />
                  <Route
                    exact
                    path="/pacientes/:id/edit"
                    render={ (props) => <Register { ...props } /> }
                  />
                  <Route
                    path="/pacientes"
                    exact
                    render={ () => (
                          <div className={ classes.patients }>
                          <Header size='huge' style = { {textAlign: 'left' } } >Meus Pacientes</Header>
                              {this.state.patientsQueryInfo ? (
                                  <Paginator
                                    queryResults={ this.state.patientsQueryInfo }
                                    totalLength={ this.state.totalPatients }
                                    pageSize={ pageSize }
                                    page={ this.state.page }
                                    changePage={ (pageNumber) => this.setState({page: pageNumber}, () => this.getPatients({redirect: false})) }
                                    queryString={ 'getAllPatients' }
                                    filter={ () => true }
                                    listElementMap={ (patient) => (
                                          <li key={ patient.uuid }>
                                              <NavLink to={ `/pacientes/${patient.uuid}` }>
                                                  {patient.name}
                                              </NavLink>
                                          </li>
                                    ) }
                                    setMessage={ (message) => this.setState({
                                        error: message,
                                    }) }
                                    isList
                                  />
                              ) : placeholder}
                              {this.state.error && <p>{this.state.error}</p>}
                              {this.state.redirect && <Redirect to="/pacientes" />}
                        <Button
                          color="teal"
                          size="small"
                          onClick={ () => this.props.history.push('/pacientes/register') }
                        >Registrar paciente
                        </Button>
                          </div>
                    ) }
                  />
              </Switch>
          </div>
      );
  }
}

export default Patients;
