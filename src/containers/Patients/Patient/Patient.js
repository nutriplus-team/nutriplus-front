import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { sendAuthenticatedRequest } from '../../../utility/httpHelper';

import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import PatientCard, { patientCardPlaceholder } from '../../../components/PatientCard/PatientCard';
import PatientRecords, { patientRecordsPlaceholder } from '../../../components/PatientRecords/PatientRecords';


class Patient extends Component {
  state = {
      recordQueryInfo: null,
      menuInfo: null,
      info: null,
      error: null,
      hasNext: false,
      hasPrevious: false,
      redirectUrl: null,
      confirmation: false
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

  deletePacientPreparation = () => {
      this.setState({ confirmation: true });
  }

  _renderPatientCard = (id) => (
    <PatientCard 
      backOnClick={ () => this.props.history.push('/pacientes') }
      patientOnClick={ () => this.props.history.push(`/pacientes/${id}/edit`) }
      deletePacientPreparation={ this.deletePacientPreparation }
      info={ this.state.info }
    />
  );

  _renderPatientRecors = (id) => (
    <PatientRecords 
      recordQueryInfo={ this.state.recordQueryInfo }
      newRecordOnClick={ () => this.props.history.push(`/pacientes/${id}/criar-ficha`,) }
      editRecordOnClick={ (recordId) => this.props.history.push(`/pacientes/${id}/ficha/${recordId}`,) }
      setResults={ (recordInfo) => this.setState({ recordQueryInfo: recordInfo }) }
      setHasNext={ (value) => this.setState({ hasNext: value }) }
      setHasPrevious={ (value) => this.setState({ hasPrevious: value }) }
      setMessage={ (message) => this.setState({
          error: message,
      }) }
      hasPrevious={ this.state.hasPrevious }
      hasNext={ this.state.hasNext }
    />
  )

  render() {
      const { params } = this.props.match;
      return (
          <div>
              <ConfirmationModal
                message='Você quer mesmo excluir este paciente?'
                open={ this.state.confirmation }
                handleConfirmation={ () => this.deletePacient() }
                handleRejection={ () => this.setState({ confirmation: false }) }
              />
              {this.state.error ? <p>{this.state.error}</p> : null}
              {this.state.info 
                  ? this._renderPatientCard(params.id) 
                  : patientCardPlaceholder()
              }
              {this.state.info 
                  ? this._renderPatientRecors(params.id)
                  : patientRecordsPlaceholder()}              
              
              {this.state.redirectUrl && <Redirect to={ this.state.redirectUrl } />}
          </div>
      );
  }
}

export default Patient;
