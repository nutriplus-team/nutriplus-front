import React, { Component } from 'react';
import { Button, Header, Placeholder } from 'semantic-ui-react';
import {
    Route, Switch, NavLink, Redirect,
} from 'react-router-dom';
import Patient from './Patient/Patient';
import Register from './Register/Register';
import PatientRecordCreator from './PatientRecord/PatientRecordCreator/PatientRecordCreator';
import PatientRecord from './PatientRecord/PatientRecord';
import { sendAuthenticatedRequest } from '../../utility/httpHelper';
import Paginator from '../../utility/paginator';
import classes from './Patients.module.css';
import PatientAppoiment from './PatientAppointment/PatientAppointment';

const placeholder = (
  <Paginator
    queryResults={ {results: [...Array(10).keys()]} }
    filter={ () => true }
    listElementMap={ (elem) => (
        <li key={ elem }>
            <Placeholder>
                <Placeholder.Line />
            </Placeholder>
        </li>
    ) }
    setResults={ () => {} }
    setHasNext={ () => {} }
    setHasPrevious={ () => {} }
    setMessage={ () => {} }
    hasPrevious={ false }
    hasNext={ false }
    isList
  />
);

class Patients extends Component {
  state = {
      patientsQueryInfo: null,
      error: null,
      hasNext: false,
      hasPrevious: false,
      redirect: false,
  };

  componentDidUpdate = async () => {
      if (this.props.location.search.length > 0) {
          const query = new URLSearchParams(this.props.location.search);
          // console.log(this.props);
          if (
              query.get('refresh')
        && this.props.location.pathname === '/pacientes'
          ) {
              sendAuthenticatedRequest(
                  '/patients/get-all-patients/',
                  'get',
                  (message) => this.setState({
                      error: message,
                  }),
                  (info) => this.setState({
                      patientsQueryInfo: info,
                      error: null,
                      hasPrevious: false,
                      hasNext: info.next !== null,
                      redirect: true,
                  }),
              );
          }
      }
  };

  componentDidMount = async () => {
      sendAuthenticatedRequest(
          '/patients/get-all-patients/',
          'get',
          (message) => this.setState({
              error: message,
          }),
          (info) => this.setState({
              patientsQueryInfo: info,
              error: null,
              hasPrevious: false,
              hasNext: info.next !== null,
          }),
      );
  };

  render() {
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
                    // render={ (props) => <PatientRecordCreator { ...props } /> }
                    render={ (props) => <PatientAppoiment { ...props } /> }
                  />
                  <Route
                    exact
                    path="/pacientes/:id/ficha/:ficha_id"
                    render={ (props) => <PatientRecord { ...props } /> }
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
                              {this.state.patientsQueryInfo ? 
                                  (
                                    <Paginator
                                      queryResults={ this.state.patientsQueryInfo }
                                      filter={ () => true }
                                      listElementMap={ (patient) => (
                                            <li key={ patient.id }>
                                                <NavLink to={ `/pacientes/${patient.id}` }>
                                                    {patient.name}
                                                </NavLink>
                                            </li>
                                      ) }
                                      setResults={ (patientInfo) => this.setState({ patientsQueryInfo: patientInfo }) }
                                      setHasNext={ (value) => this.setState({ hasNext: value }) }
                                      setHasPrevious={ (value) => this.setState({ hasPrevious: value }) }
                                      setMessage={ (message) => this.setState({
                                          error: message,
                                      }) }
                                      hasPrevious={ this.state.hasPrevious }
                                      hasNext={ this.state.hasNext }
                                      isList
                                    /> 
                                  )
                                  : placeholder
                              }
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
