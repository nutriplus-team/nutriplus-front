import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { sendAuthenticatedRequest } from '../../../utility/httpHelper';

import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import PatientCard, { patientCardPlaceholder } from '../../../components/PatientCard/PatientCard';
import PatientRecords, { patientRecordsPlaceholder } from '../../../components/PatientRecords/PatientRecords';

const pageSize = 10;

class Patient extends Component {
  state = {
      recordQueryInfo: null,
      menuInfo: null,
      restrictions: [],
      info: null,
      error: null,
      redirectUrl: null,
      confirmation: false,
      confirmationFile: false,
      page: null,
      totalRecords: null,
      toBeDeleted: ''
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
          dateModified, uuid, corporalMass, height
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
            removePatient(uuidPatient: "${params.ficha_id}")
        }
        `
      );
  };

  deletePatientPreparation = () => {
      this.setState({ confirmation: true });
  }

  deleteRecord = async () => {
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
            this.setState({ redirectUrl: `/pacientes/${params.id}?refresh=true`, confirmationFile: false });
        },
        `mutation {
            removePatientRecord(uuidPatientRecord: "${this.state.toBeDeleted}")
        }`
        );
    };

    deleteRecordPreparation = (toBeDeleted) => {
        this.setState({ confirmationFile: true, toBeDeleted: toBeDeleted });
    }

  _renderPatientCard = (id) => (
    <PatientCard 
      backOnClick={ () => this.props.history.push('/pacientes') }
      patientOnClick={ () => this.props.history.push(`/pacientes/${id}/edit`) }
      deletePatientPreparation={ this.deletePatientPreparation }
      info={ this.state.info }
      restrictions={ this.state.restrictions }
    />
  );

  _renderPatientRecord = (id) => (
    <PatientRecords 
      recordQueryInfo={ this.state.recordQueryInfo }
      pageSize={ pageSize }
      page={ this.state.page }
      deleteRecordPreparation={ (recordID) => this.deleteRecordPreparation(recordID) }
      changePage={ (pageNumber) => this.setState({page: pageNumber}) }
      queryString={ 'getPatientRecords' }
      newRecordOnClick={ () => this.props.history.push(`/pacientes/${id}/criar-ficha`,) }
      editRecordOnClick={ (recordId) => this.props.history.push(`/pacientes/${id}/ficha/${recordId}`,) }
      setMessage={ (message) => this.setState({
          error: message,
      }) }
    />
  )

  render() {
      const { params } = this.props.match;
      return (
          <div>
              <ConfirmationModal
                message='Você quer mesmo excluir esta ficha?'
                open={ this.state.confirmationFile }
                handleConfirmation={ () => this.deleteRecord() }
                handleRejection={ () => this.setState({ confirmationFile: false }) }
              />
              <ConfirmationModal
                message='Você quer mesmo excluir este paciente?'
                open={ this.state.confirmation }
                handleConfirmation={ () => this.deletePatient() }
                handleRejection={ () => this.setState({ confirmation: false }) }
              />
              {this.state.error ? <p>{this.state.error}</p> : null}
              {this.state.info 
                  ? this._renderPatientCard(params.id) 
                  : patientCardPlaceholder()
              }
              {this.state.info 
                  ? this._renderPatientRecord(params.id)
                  : patientRecordsPlaceholder()}              
              
              {this.state.redirectUrl && <Redirect to={ this.state.redirectUrl } />}
          </div>
      );
  }
}

export default Patient;
