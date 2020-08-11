import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
    Button,
    Form,
    Grid,
    Header,
    Segment,
    TextArea,
    Dropdown,
} from 'semantic-ui-react';
import { sendAuthenticatedRequest } from '../../../../utility/httpHelper';
import { numberValidator } from '../../../../utility/validators';
import PatientRecord from '../PatientRecord';

class PatientRecordCreator extends Component {
  state = {
      anamnese: '',
      exames: '',
      patient: null,
      weight: '',
      height: '',
      imc: '',
      athlete: '',
      physicalActivity: '',
      methabolicAuthor: '',
      energyRequirements: '',
      subscapular: '',
      triceps: '',
      biceps: '',
      chest: '',
      axillary: '',
      supriailiac: '',
      abdominal: '',
      thigh: '',
      calf: '',
      waistCirc: '',
      abdominalCirc: '',
      hipsCirc: '',
      rightArmCirc: '',
      thighCirc: '',
      calfCirc: '',
      message: null,
      editing: false,
      obs: '',
      redirectUrl: null,
      createrecord: true
  };

  componentDidMount = async () => {
      const { params } = this.props.match;
      sendAuthenticatedRequest(
          '/graphql/get/',
          'post',
          (message) => this.setState({
              message: message,
          }),
          (info) => this.setState({patient: info.data.getPatientInfo}),
          `query {
            getPatientInfo(uuidPatient: "${params.id}")
            {
                uuid, name, ethnicGroup, email, dateOfBirth, nutritionist, cpf, biologicalSex
            }
          }`
      );
      if (params.ficha_id) {
          sendAuthenticatedRequest(
              '/graphql/get/',
              'post',
              (message) => this.setState({
                  message: message,
              }),
              (info) => {
                  info = info.data.getSingleRecord;
                  this.setState({
                      weight: info.corporalMass,
                      height: info.height,
                      athlete: info.isAthlete === true ? 'Atleta' : 'Não atleta',
                      physicalActivity: this.mapNumberToPhysicalActivityOption(
                          info.physicalActivityLevel,
                      ),
                      subscapular: info.subscapular,
                      triceps: info.triceps,
                      biceps: info.biceps,
                      chest: info.chest,
                      axillary: info.axillary,
                      supriailiac: info.supriailiac,
                      abdominal: info.abdominal,
                      thigh: info.thigh,
                      calf: info.calf,
                      waistCirc: info.waistCirc,
                      abdominalCirc: info.abdominalCirc,
                      hipsCirc: info.hipsCirc,
                      rightArmCirc: info.rightArmCirc,
                      thighCirc: info.thighCirc,
                      calfCirc: info.calfCirc,
                      obs: info.observations,
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
          this.setState({ editing: true });
      }
  };

  sendForm = async () => {
      const { params } = this.props.match;
      if (
          !(
              +this.state.weight > 0.1
        && +this.state.weight < 1000
        && +this.state.height > 0.1
        && +this.state.height < 3
          )
      ) {
          this.setState({
              message: 'Valores de altura ou peso inválidos!',
          });
          return;
      }
      if (
          this.state.athlete.length === 0
      || this.state.physicalActivity.length === 0
      || this.state.methabolicAuthor.length === 0
      || this.state.energyRequirements.length === 0
      || this.state.subscapular.length === 0
      || this.state.triceps.length === 0
      || this.state.biceps.length === 0
      || this.state.chest.length === 0
      || this.state.axillary.length === 0
      || this.state.supriailiac.length === 0
      || this.state.abdominal.length === 0
      || this.state.thigh.length === 0
      || this.state.calf.length === 0
      || this.state.waistCirc.length === 0
      || this.state.abdominalCirc.length === 0
      || this.state.hipsCirc.length === 0
      || this.state.rightArmCirc.length === 0
      || this.state.thighCirc.length === 0
      || this.state.calfCirc.length === 0
      ) {
          this.setState({
              message: 'Preencha todos os campos!',
          });
          return;
      }
      let setStateFunction;
      if (!this.state.editing) {
          setStateFunction = () => this.setState({
              message: 'Ficha salva com sucesso!',
              weight: '',
              height: '',
              athlete: '',
              physicalActivity: '',
              methabolicAuthor: '',
              energyRequirements: '',
              subscapular: '',
              triceps: '',  
              biceps: '',
              chest: '',
              supriailiac: '',
              axillary: '',
              abdominal: '',
              thigh: '',
              calf: '',
              waistCirc: '',
              abdominalCirc: '',
              hipsCirc: '',
              rightArmCirc: '',
              thighCirc: '',
              calfCirc: '',
              obs: '',
              //redirectUrl: `/pacientes/${params.id}?refresh=true`,
              createrecord: false,
          });
      } else {
          setStateFunction = () => this.setState({
              message: 'Ficha editada com sucesso!',
              weight: '',
              height: '',
              athlete: '',
              physicalActivity: '',
              methabolicAuthor: '',
              energyRequirements: '',
              subscapular: '',
              triceps: '',
              biceps: '',
              chest: '',
              supriailiac: '',
              axillary: '',
              abdominal: '',
              thigh: '',
              calf: '',
              waistCirc: '',
              abdominalCirc: '',
              hipsCirc: '',
              rightArmCirc: '',
              thighCirc: '',
              calfCirc: '',
              obs: '',
              //redirectUrl:
            //`/pacientes/${params.id}/ficha/${params.ficha_id}`,
          });
      }
      /* console.log(
      "sent",
      JSON.stringify({
        corporal_mass: (+this.state.weight).toFixed(2),
        height: (+this.state.height).toFixed(2),
        BMI: BMI.toFixed(2),
        is_athlete: this.state.athlete === "Atleta",
        physical_activity_level: this.mapPhysicalActivityOptionToNumber(
          this.state.physicalActivity
        ),
        methabolic_author: this.state.methabolicAuthor,
        energy_method: this.mapEnergyRequirementsOptionToNumber(
          this.state.energyRequirements
        ),
        subscapular: this.state.subscapular,
        triceps: this.state.triceps,
        biceps: this.state.biceps,
        chest: this.state.chest,
        supriailiac: this.state.supriailiac,
        axillary: this.state.axillary,
        abdominal: this.state.abdominal,
        thigh: this.state.thigh,
        calf: this.state.calf,
        waist_circ: this.state.waistCirc,
        abdominal_circ: this.state.abdominalCirc,
        hips_circ: this.state.hipsCirc,
        right_arm_circ: this.state.rightArmCirc,
        thigh_circ: this.state.thighCirc,
        calf_circ: this.state.calfCirc,
        observations: this.state.obs
      })
    ); */
      sendAuthenticatedRequest(
          '/graphql/get/',
          'post',
          (message) => {
              this.setState({
                  message: message,
              });
          },
          setStateFunction,
          `mutation {
            ${this.state.editing ?
              `updatePatientRecord(uuidPatient: "${params.id}", uuidPatientRecord: "${params.ficha_id}"`
              : `createPatientRecord(uuidPatient: "${params.id}"`},
                                input: {
                                    methodBodyFat: "${this.state.methabolicAuthor}",
                                    methodMethabolicRate: "${this.state.energyRequirements}",
                                    corporalMass: ${(+this.state.weight).toFixed(2)},
                                    height: ${(+this.state.height).toFixed(2)},
                                    isAthlete: ${this.state.athlete === 'Atleta'},
                                    physicalActivityLevel: ${this.mapPhysicalActivityOptionToNumber(this.state.physicalActivity)},
                                    observations: "${this.state.obs}",
                                    subscapular: ${this.state.subscapular},
                                    triceps: ${this.state.triceps},
                                    biceps: ${this.state.biceps},
                                    chest: ${this.state.chest},
                                    axillary: ${this.state.axillary},
                                    abdominal: ${this.state.abdominal},
                                    supriailiac: ${this.state.supriailiac},
                                    thigh: ${this.state.thigh},
                                    calf: ${this.state.calf},
                                    waistCirc: ${this.state.waistCirc},
                                    abdominalCirc: ${this.state.abdominalCirc},
                                    hipsCirc:   ${this.state.hipsCirc},
                                    rightArmCirc: ${this.state.rightArmCirc},
                                    thighCirc:  ${this.state.thighCirc},
                                    calfCirc:   ${this.state.calfCirc},
                                })
          }`
      );
  };

  athleteOptions = [
      {
          key: 'Atleta',
          text: 'Atleta',
          value: 'Atleta',
      },
      {
          key: 'Não atleta',
          text: 'Não atleta',
          value: 'Não atleta',
      },
  ];

  physicalActivityOptions = [
      {
          key: 'Não faz atividade física',
          text: 'Não faz atividade física',
          value: 'Não faz atividade física',
      },
      {
          key: 'Sedentário',
          text: 'Sedentário',
          value: 'Sedentário',
      },
      {
          key: 'Atividade física leve',
          text: 'Atividade física leve',
          value: 'Atividade física leve',
      },
      {
          key: 'Atividade física moderada',
          text: 'Atividade física moderada',
          value: 'Atividade física moderada',
      },
      {
          key: 'Atividade física intensa',
          text: 'Atividade física intensa',
          value: 'Atividade física intensa',
      },
  ];

  methabolicAuthorOptions = [
      {
          key: 'Pollok',
          text: 'Pollok',
          value: 'pollok',
      },
      {
          key: 'Faulkner',
          text: 'Faulkner',
          value: 'faulkner',
      },
  ];

  energyRequirementsOptions = [
      {
          key: 'Tinsley com peso total',
          text: 'Tinsley com peso total',
          value: 'tinsley',
      },
      {
          key: 'Tinsley com peso livre de gordura',
          text: 'Tinsley com peso livre de gordura',
          value: 'tinsley_no_fat',
      },
      {
          key: 'Cunningham com peso livre de gordura',
          text: 'Cunningham com peso livre de gordura',
          value: 'cunningham',
      },
      {
          key: 'Mifflin (não atletas)',
          text: 'Mifflin (não atletas)',
          value: 'mifflin',
      },
  ];

  mapPhysicalActivityOptionToNumber = (option) => {
      switch (option) {
      case 'Não faz atividade física':
          return 1;
      case 'Sedentário':
          return 1.2;
      case 'Atividade física leve':
          return 1.3;
      case 'Atividade física moderada':
          return 1.5;
      case 'Atividade física intensa':
          return 1.7;
      default:
          return -1;
      }
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

  mapEnergyRequirementsOptionToNumber = (option) => {
      switch (option) {
      case 'Tinsley com peso total':
          return 1;
      case 'Tinsley com peso livre de gordura':
          return 2;
      case 'Cunningham com peso livre de gordura':
          return 3;
      case 'Mifflin (não atletas)':
          return 4;
      default:
          return -1;
      }
  };

  render() {
      const { params } = this.props.match;

      return (
          <>
          {this.state.createrecord ? 
          (<div>
              <h4>
Paciente:
                  {this.state.patient ? this.state.patient.name : null}
              </h4>
              <Grid
                textAlign="center"
                style={ { height: '10vh' } }
                //verticalAlign="middle"
              >
                  <Grid.Column style={ { maxWidth: 900 }}>
                      <Header as="h2" color="teal" textAlign="center">
              Insira as informações do paciente abaixo
                      </Header>
                      <Form size="large">
                          <Segment stacked>
                              <Form.TextArea
                                label='Anamnese'
                                onChange={ (event) => {
                                    this.setState({
                                        anamnese: event.target.value,
                                        message: '',
                                    });
                                } }
                                value={ this.state.anamnese }
                              />
                              <Form.TextArea
                                label='Exames'
                                onChange={ (event) => {
                                    this.setState({
                                        exame: event.target.value,
                                        message: '',
                                    });
                                } }
                                value={ this.state.exame }
                              />
                               <Form.Group widths='equal'>
                                <Form.Input
                                    icon="weight"
                                    label='Peso'
                                    iconPosition="left"
                                    placeholder="Peso (em kg). Ex: 51.53"
                                    onChange={ (event) => {
                                        if (!numberValidator(event.target.value, 3, true, 2)) return;
                                        this.setState({ weight: event.target.value, message: '' });
                                    } }
                                    value={ this.state.weight }
                                />
                                <Form.Input
                                    icon="long arrow alternate up"
                                    iconPosition="left"
                                    label='Altura'
                                    placeholder="Altura(em m). Ex: 1.81"
                                    value={ this.state.height }
                                    onChange={ (event) => {
                                        if (!numberValidator(event.target.value, 1, true, 2)) return;
                                        this.setState({ height: event.target.value, message: '' });
                                    } }
                                />
                               </Form.Group>
                               <Form.Group widths='equal'>
                                    <Form.Field>
                                        <Dropdown
                                            placeholder="Atleta"
                                            selection
                                            value={ this.state.athlete }
                                            onChange={ (event, data) => {
                                                this.setState({ athlete: data.value });
                                            } }
                                            options={ this.athleteOptions }
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Dropdown
                                            placeholder="Nível de atividade física"
                                            selection
                                            value={ this.state.physicalActivity }
                                            onChange={ (event, data) => {
                                                this.setState({ physicalActivity: data.value });
                                            } }
                                            options={ this.physicalActivityOptions }
                                        />
                                    </Form.Field>
                               </Form.Group>
                               <Form.Group widths='equal'>
                                    <Form.Field>
                                        <Dropdown
                                            placeholder="Autor para taxa metabólica"
                                            selection
                                            value={ this.state.methabolicAuthor }
                                            onChange={ (event, data) => {
                                                this.setState({ methabolicAuthor: data.value });
                                            } }
                                            options={ this.methabolicAuthorOptions }
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Dropdown
                                            placeholder="Método para calcular as necessidades energéticas"
                                            selection
                                            value={ this.state.energyRequirements }
                                            onChange={ (event, data) => {
                                                this.setState({ energyRequirements: data.value });
                                            } }
                                            options={ this.energyRequirementsOptions }
                                        />
                                    </Form.Field>
                              </Form.Group>
                              <Segment> <h3>Medidas de gordura</h3>
                              <Form.Group widths='equal'>
                              <Form.Input
                                icon="male"
                                iconPosition="left"
                                label='Subscapular'
                                placeholder="Subscapular (em mm)"
                                value={ this.state.subscapular }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 4, true, 1)) return;
                                    this.setState({
                                        subscapular: event.target.value,
                                        message: '',
                                    });
                                } }
                              />
                              <Form.Input
                                icon="male"
                                iconPosition="left"
                                label='Triceps'
                                placeholder="Triceps (em mm)"
                                value={ this.state.triceps }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 4, true, 1)) return;
                                    this.setState({ triceps: event.target.value, message: '' });
                                } }
                              />
                              <Form.Input
                                icon="male"
                                iconPosition="left"
                                label='Biceps'
                                placeholder="Biceps (em mm)"
                                value={ this.state.biceps }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 4, true, 1)) return;
                                    this.setState({ biceps: event.target.value, message: '' });
                                } }
                              />
                              </Form.Group>
                              <Form.Group widths='equal'>
                              <Form.Input
                                icon="male"
                                iconPosition="left"
                                label='Peitoral'
                                placeholder="Peitoral (em mm)"
                                value={ this.state.chest }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 4, true, 1)) return;
                                    this.setState({ chest: event.target.value, message: '' });
                                } }
                              />
                              <Form.Input
                                icon="male"
                                iconPosition="left"
                                label='Axilar média'
                                placeholder="Axilar média (em mm)"
                                value={ this.state.axillary }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 4, true, 1)) return;
                                    this.setState({
                                        axillary: event.target.value,
                                        message: '',
                                    });
                                } }
                              />
                              <Form.Input
                                icon="male"
                                iconPosition="left"
                                label='Suprailíaca'
                                placeholder="Suprailíaca (em mm)"
                                value={ this.state.supriailiac }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 4, true, 1)) return;
                                    this.setState({
                                        supriailiac: event.target.value,
                                        message: '',
                                    });
                                } }
                              />
                              </Form.Group>
                              <Form.Group widths='equal'>
                              <Form.Input
                                icon="male"
                                label='Abdominal'
                                iconPosition="left"
                                placeholder="Abdominal (em mm)"
                                value={ this.state.abdominal }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 4, true, 1)) return;
                                    this.setState({
                                        abdominal: event.target.value,
                                        message: '',
                                    });
                                } }
                              />
                              <Form.Input
                                icon="male"
                                iconPosition="left"
                                label='Coxa'
                                placeholder="Coxa (em mm)"
                                value={ this.state.thigh }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 4, true, 1)) return;
                                    this.setState({ thigh: event.target.value, message: '' });
                                } }
                              />
                              <Form.Input
                                icon="male"
                                iconPosition="left"
                                label='Panturrilha'
                                placeholder="Panturrilha (em mm)"
                                value={ this.state.calf }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 4, true, 1)) return;
                                    this.setState({ calf: event.target.value, message: '' });
                                } }
                              />
                              </Form.Group>
                              </Segment>
                              <Segment> <h3>Circunferências</h3>
                              <Form.Group widths='equal'>
                              <Form.Input
                                icon="arrows alternate horizontal"
                                iconPosition="left"
                                label='Cintura'
                                placeholder="Circunferência da cintura (em cm)"
                                value={ this.state.waistCirc }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 3, true, 1)) return;
                                    this.setState({
                                        waistCirc: event.target.value,
                                        message: '',
                                    });
                                } }
                              />
                              <Form.Input
                                icon="arrows alternate horizontal"
                                iconPosition="left"
                                label='Abdominal'
                                placeholder="Circunferência abdominal (em cm)"
                                value={ this.state.abdominalCirc }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 3, true, 1)) return;
                                    this.setState({
                                        abdominalCirc: event.target.value,
                                        message: '',
                                    });
                                } }
                              />
                              <Form.Input
                                icon="arrows alternate horizontal"
                                iconPosition="left"
                                label='Quadril'
                                placeholder="Circunferência do quadril (em cm)"
                                value={ this.state.hipsCirc }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 3, true, 1)) return;
                                    this.setState({
                                        hipsCirc: event.target.value,
                                        message: '',
                                    });
                                } }
                              />
                              </Form.Group>
                              <Form.Group widths='equal'>
                              <Form.Input
                                icon="arrows alternate horizontal"
                                iconPosition="left"
                                label='Braço direito'
                                placeholder="Circunferência do braço direito (em cm)"
                                value={ this.state.rightArmCirc }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 3, true, 1)) return;
                                    this.setState({
                                        rightArmCirc: event.target.value,
                                        message: '',
                                    });
                                } }
                              />
                              <Form.Input
                                icon="arrows alternate horizontal"
                                iconPosition="left"
                                label='Coxa média'
                                placeholder="Circunferência da coxa média (em cm)"
                                value={ this.state.thighCirc }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 3, true, 1)) return;
                                    this.setState({
                                        thighCirc: event.target.value,
                                        message: '',
                                    });
                                } }
                              />
                              <Form.Input
                                icon="arrows alternate horizontal"
                                iconPosition="left"
                                label='Panturrilha'
                                placeholder="Circunferência da panturrilha (em cm)"
                                value={ this.state.calfCirc }
                                onChange={ (event) => {
                                    if (!numberValidator(event.target.value, 3, true, 1)) return;
                                    this.setState({
                                        calfCirc: event.target.value,
                                        message: '',
                                    });
                                } }
                              />
                              </Form.Group>
                              </Segment>
                              <TextArea
                                placeholder="Observações"
                                onChange={ (event) => {
                                    this.setState({
                                        obs: event.target.value,
                                        message: '',
                                    });
                                } }
                                value={ this.state.obs }
                                style={ { marginBottom: '10px' } }
                              />
                              {this.state.editing ? <Button size='large' onClick={ () => this.props.history.push(`/pacientes/${params.id}`) }>
                                Voltar
                              </Button> : ''}
                              <Button color="teal" size="large" onClick={ this.sendForm }>
                                  {this.state.editing ? 'Editar ficha' : 'Adicionar ficha'}
                              </Button>
                              {this.state.message && <p>{this.state.message}</p>}
                          </Segment>
                      </Form>
                  </Grid.Column>
              </Grid>
              {this.state.redirectUrl && <Redirect to={ this.state.redirectUrl } />}
          </div>)
          : <PatientRecord {...this.props} />}
          </>
      );
  }
}

export default PatientRecordCreator;
