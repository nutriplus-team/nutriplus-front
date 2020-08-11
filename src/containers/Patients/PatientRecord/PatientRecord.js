import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { sendAuthenticatedRequest } from '../../../utility/httpHelper';

class PatientRecord extends Component {
  state = {
      record: null, error: null, patient: null, redirectUrl: null,
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
                dateModified, corporalMass, height, age, isAthlete, physicalActivityLevel, subscapular, triceps, biceps, chest, axillary,
                supriailiac, abdominal, thigh, calf, waistCirc, abdominalCirc, hipsCirc, rightArmCirc, thighCirc, calfCirc, observations,
                muscularMass, corporalDensity, bodyFat, methabolicRate, energyRequirements, methodBodyFat, methodMethabolicRate
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
      if (key === 'bodyFat') {
          return (
              `Taxa de gordura: ${this.state.record[key].toFixed(2)} (${this.state.record['methodBodyFat']})`
          );
      }
      if (key === 'corporalDensity') {
          return `Densidade corporal: ${this.state.record[key].toFixed(2)}`;
      }
      if (key === 'methabolicRate') {
          return (
              `Taxa metabólica: ${this.state.record[key].toFixed(2)} (${this.state.record['methodMethabolicRate']})`
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
      return null;
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
              this.setState({
                  redirectUrl: `/pacientes/${params.id}/?refresh=true`,
              });
          },
          `mutation {
              removePatientRecord(uuidPatientRecord: "${params.ficha_id}")
          }`
      );
  };

  render() {
      // console.log("patientRecord state", this.state);
      const { params } = this.props.match;
      return (
          <div>
              {this.state.error ? <p>{this.state.error}</p> : null}
              {this.state.record ? (
                  <div>
                      {Object.keys(this.state.record).map((key) => (
                          <p key={ key }>{this.processObjectKey(key)}</p>
                      ))}
                  </div>
              ) : null}
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
                onClick={ this.deleteRecord }
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
