import React, { Component } from 'react';

import { Placeholder } from 'semantic-ui-react';

import { sendAuthenticatedRequest } from '../../../utility/httpHelper';

import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import PatientRecordView from '../PatientRecord/PatientRecordView/PatientRecordView';

class PatientRecord extends Component {
  state = {
      record: null, 
      error: null, 
      patient: null, 
      confirmation: false
  };

  componentDidMount = async () => {
      console.log('EITA', this.props);
      const { params } = this.props.match;

      sendAuthenticatedRequest(
          '/graphql/get/',
          'post',
          (message) => this.setState({
              error: message,
          }),
          (info) => {
              info = info.data.getSingleRecord;
              this.setState({
                  record: info
              });
          },
          `query {
            getSingleRecord(uuidRecord: "${params.ficha_id ? params.ficha_id : this.props.recordUuid}")
            {
                dateModified, corporalMass, height, age, isAthlete, physicalActivityLevel, subscapular, triceps, biceps, chest, axillary,
                supriailiac, abdominal, thigh, calf, waistCirc, abdominalCirc, hipsCirc, rightArmCirc, thighCirc, calfCirc, observations,
                muscularMass, corporalDensity, bodyFat, methabolicRate, energyRequirements, methodBodyFat, methodMethabolicRate, anamnesis,
                exam
            }
          }`
      );
      sendAuthenticatedRequest(
          '/graphql/get/',
          'post',
          (message) => this.setState({
              error: message,
          }),
          (info) => {
              info = info.data.getPatientInfo;
              this.setState({
                  patient: info
              });
          },
          `query {
            getPatientInfo(uuidPatient: "${params.id}")
            {
                name
            }
          }`
      );
  };

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
          () => {
              this.props.setFichaId(null);
              this.props.setCreating(true);
              this.props.setEdit(false);
          },
          `mutation {
              removePatientRecord(uuidPatientRecord: "${params.ficha_id}")
          }`
      );
  };

  deleteRecordPreparation = () => {
      this.setState({ confirmation: true });
  }

  _renderPlaceholder = () => (
      <>
        {
        [...Array(31).keys()].map((elem) => (
            <center key={ elem } style={ {'margin': '0 0 1em'} }>
                <Placeholder><Placeholder.Line /></Placeholder>
            </center>
        ))
        }
      </>
  )

  render() {
      console.log('patientRecord state', this.state);
      return (
          <div>
              <ConfirmationModal
                message='Você quer mesmo excluir esta ficha?'
                open={ this.state.confirmation }
                handleConfirmation={ () => this.deleteRecord() }
                handleRejection={ () => this.setState({ confirmation: false }) }
              />
              {this.state.error ? <p>{this.state.error}</p> : null}
              {this.state.record ? (
                <PatientRecordView
                  record={ this.state.record }
                  patient={ this.state.patient }
                  onlyView
                  editButton={ (state) => this.props.setEdit(state) }
                  deleteButton={ () => this.deleteRecordPreparation() }
                />
              ) : this._renderPlaceholder()}
          </div>
      );
  }
}

export default PatientRecord;
