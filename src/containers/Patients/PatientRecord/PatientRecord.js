import React, { Component } from 'react';

import { Placeholder } from 'semantic-ui-react';

import { sendAuthenticatedRequest } from '../../../utility/httpHelper';

import PatientRecordView from '../PatientRecord/PatientRecordView/PatientRecordView';

class PatientRecord extends Component {
  state = {
      record: null, 
      error: null, 
      patient: null
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
              {this.state.error ? <p>{this.state.error}</p> : null}
              {this.state.record ? (
                <PatientRecordView
                  record={ this.state.record }
                  patient={ this.state.patient }
                  onlyView
                  editButton={ (state) => this.props.setEdit(state) }
                />
              ) : this._renderPlaceholder()}
          </div>
      );
  }
}

export default PatientRecord;
