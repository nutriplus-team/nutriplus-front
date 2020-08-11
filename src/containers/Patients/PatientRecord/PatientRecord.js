import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { Button, Placeholder } from 'semantic-ui-react';

import { sendAuthenticatedRequest } from '../../../utility/httpHelper';

import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import PatientRecordView from '../PatientRecord/PatientRecordView/PatientRecordView';

class PatientRecord extends Component {
  state = {
      record: null, 
      error: null, 
      patient: null, 
      redirectUrl: null,
      confirmation: false
  };

  componentDidMount = async () => {
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
            getSingleRecord(uuidRecord: "${params.ficha_id}")
            {
                corporalMass, height, isAthlete, physicalActivityLevel, subscapular, triceps, biceps, chest, axillary,
                supriailiac, abdominal, thigh, calf, waistCirc, abdominalCirc, hipsCirc, rightArmCirc, thighCirc, calfCirc, observations
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

  mapNumberToPhysicalActivityOption = (number) => {
      switch (+number) {
      case 1:
          return 'Não faz atividade física';
      case 1.2:
          return 'Sedentário';
      case 1.3:
          return 'Atividade física leve';
      case 1.5:
          return 'Atividade física moderada';
      case 1.7:
          return 'Atividade física intensa';
      default:
          return 'Wrong function usage';
      }
  };

  processObjectKey = (key) => {
      if (key === 'patient') {
          return (
              `Paciente: ${this.state.patient ? this.state.patient.name : null}`
          );
      }
      if (key === 'corporalMass') {
          return `Peso: ${this.state.record[key].toFixed(2)} kg`;
      }
      if (key === 'height') {
          return `Altura: ${this.state.record[key].toFixed(2)} m`;
      }
      if (key === 'BMI') {
          return `IMC: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'observations') {
          return `Observações: ${this.state.record[key]}`;
      }
      if (key === 'dateModified') {
          return `Data de modificação: ${this.state.record[key]}`;
      }
      if (key === 'subscapular') {
          return `Subscapular: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'triceps') {
          return `Tríceps: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'biceps') {
          return `Biceps: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'chest') {
          return `Peito: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'axillary') {
          return `Axilar média: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'supriailiac') {
          return `Supraíliaca: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'abdominal') {
          return `Abdominal: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'thigh') {
          return `Coxa: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'calf') {
          return `Panturrilha: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'waistCirc') {
          return `Circunferência da cintura: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'abdominalCirc') {
          return `Circunferência abdominal: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'hipsCirc') {
          return `Circunferência do quadril: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'rightArmCirc') {
          return (
              `Circunferência do braço direito: ${this.state.record[key].toFixed(2)}`
          );
      }
      if (key === 'thighCirc') {
          return (
              `Circunferência da coxa média: ${this.state.record[key].toFixed(2)}`
          );
      }
      if (key === 'calfCirc') {
          return (
              `Circunferência da panturrilha: ${this.state.record[key].toFixed(2)}`
          );
      }
      if (key === 'bodyFatFaulkner') {
          return (
              `Taxa de gordura por Faulkner: ${this.state.record[key].toFixed(2)}`
          );
      }
      if (key === 'bodyFatPollok') {
          return `Taxa de gordura por Pollok: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'corporalDensity') {
          return `Densidade corporal: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'cunninghamAthlete') {
          return (
              `Taxa metabólica por Cunningham: ${this.state.record[key].toFixed(2)}`
          );
      }
      if (key === 'energyRequirements') {
          return `Necessidades energéticas: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'muscularMass') {
          return `Massa muscular: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'isAthlete') {
          return `Atleta: ${this.state.record[key] ? 'Sim' : 'Não'}`;
      }
      if (key === 'physicalActivityLevel') {
          return (
              `Nível de atividade física: ${
                  this.mapNumberToPhysicalActivityOption(this.state.record[key])}`
          );
      }
      if (key === 'tinsleyAthleteNonFat') {
          return (
              `Taxa metabólica por Tinsley: ${this.state.record[key].toFixed(2)}`
          );
      }
      if (key === 'totalWeightMethabolicRate') {
          return (
              `Taxa metabólica com peso total: ${this.state.record[key].toFixed(2)}`
          );
      }
      return null;
  };

  deleteRecord = async () => {
      const { params } = this.props.match;
      sendAuthenticatedRequest(
          `/patients/remove-record/${params.ficha_id}/`,
          'get',
          (message) => {
              this.setState({
                  error: message,
              });
          },
          () => {
              this.setState({
                  redirectUrl: `/pacientes/${params.id}/?refresh=true`,
              });
          },
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
       console.log("patientRecord state", this.state);
      const { params } = this.props.match;
      return (
          <div>
              <ConfirmationModal
                message='Você quer mesmo excluir esta ficha?'
                open={ this.state.confirmation }
                handleConfirmation={ () => this.deleteRecord() }
                handleRejection={ () => this.setState({ confirmation: false }) }
              />
              {this.state.error ? <p>{this.state.error}</p> : null}
                <PatientRecordView
                    record={this.state.record}
                    patient={this.state.patient}
                />
              
              <Button
                style={ { margin: '10px' } }
                color="teal"
                size="small"
                onClick={ () => this.props.history.push(
                    `/pacientes/${
                        params.id
                    }/ficha/${
                        params.ficha_id
                    }/edit`,
                ) }
              >
          Editar ficha do paciente
              </Button>
              <Button
                style={ { margin: '200px auto' } }
                color="red"
                size="small"
                onClick={ this.deleteRecordPreparation }
              >
          Excluir ficha
              </Button>
              <Button
                style={ { margin: '10px' } }
                color="teal"
                size="medium"
                onClick={ () => this.props.history.push(`/pacientes/${params.id}`) }
              >
          Voltar à página do paciente
              </Button>
              {this.state.redirectUrl && <Redirect to={ this.state.redirectUrl } />}
          </div>
      );
  }
}

export default PatientRecord;
