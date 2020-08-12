import React from 'react';
import { Grid, Header, Segment, Button} from 'semantic-ui-react';

const patientRecordView = (props) => {

    const mapNumberToPhysicalActivityOption = (number) => {
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

    return (
        <>
        <Grid
            textAlign="center"
            style={ { height: '10vh' } }
        >
            {console.log(props)}
            <Grid.Column style={ { maxWidth: 900 }}>
                <Header as="h2" color="teal" textAlign="center">
                    Resumo
                </Header>

                <Grid columns="equal">
                    <Grid.Row>
                        <Grid.Column>
                            <Segment><h4>Taxa de gordura por {props.record.methodBodyFat}:</h4> {props.record.bodyFat.toFixed(2)} </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment><h4>Taxa metabólica por {props.record.methodMethabolicRate}:</h4> {props.record.methabolicRate.toFixed(2)} </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Segment>
                    <Segment textAlign="left">
                        <h4>Anamnese:</h4>
                        <Segment.Group>
                            <Segment>
                                TODO
                            </Segment>
                        </Segment.Group>
                    </Segment>

                    <Segment textAlign="left">
                        <h4>Exame:</h4>
                        <Segment.Group>
                            <Segment>
                                TODO
                            </Segment>
                        </Segment.Group>
                    </Segment>

                    <Grid
                      columns="equal"
                      textAlign="center"
                    >
                        <Grid.Column>
                            <Segment><h4>Peso:</h4> {props.record.corporalMass} Kg</Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment><h4>Altura:</h4> {props.record.height} m</Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment><h4>IMC:</h4> {(props.record.corporalMass/(props.record.height*props.record.height)).toFixed(2)}</Segment>
                        </Grid.Column>
                    </Grid>

                    <Grid
                      columns="equal"
                      textAlign="center"
                    >
                        <Grid.Column>
                            <Segment><h4>Massa muscular:</h4> {props.record.muscularMass.toFixed(3)} </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment><h4>Necessidades energéticas:</h4> {props.record.energyRequirements.toFixed(2)} </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment><h4>Densidade corporal:</h4> {props.record.corporalDensity.toFixed(3)} </Segment>
                        </Grid.Column>
                    </Grid>

                    <Grid
                      columns="equal"
                      textAlign="center"
                    >
                        <Grid.Column>
                            <Segment><h4>Atleta:</h4> {props.record.isAthlete ? 'Sim' : 'Não'} </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment><h4>Nível de atividade física:</h4> 
                            {mapNumberToPhysicalActivityOption(props.record.physicalActivityLevel)} </Segment>
                        </Grid.Column>
                    </Grid>

                    <Segment textAlign="left">
                        <h3>Pregas:</h3>
                        <Segment.Group>
                            <Segment>
                                <Grid columns="equal">
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment>Subscapula: {props.record.subscapular} mm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Triceps: {props.record.triceps} mm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Biceps: {props.record.biceps} mm</Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment>Peitoral: {props.record.chest} mm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Axiola média: {props.record.axillary} mm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Suproilíaca: {props.record.supriailiac} mm</Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment>Abdominal: {props.record.abdominal} mm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Coxa: {props.record.thigh} mm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Panturrilha: {props.record.calf} mm</Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Segment.Group>
                    </Segment>

                    <Segment textAlign="left">
                        <h3>Circunferências:</h3>
                        <Segment.Group>
                            <Segment>
                                <Grid columns="equal">
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment>Cintura: {props.record.waistCirc} cm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Abdominal: {props.record.abdominalCirc} cm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Quadril: {props.record.hipsCirc} cm</Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment>Braço direito: {props.record.rightArmCirc} cm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Coxa média: {props.record.thighCirc} cm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Panturrilha: {props.record.calfCirc} cm</Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Segment.Group>
                    </Segment>

                    <Segment textAlign="left">
                        <h4>Observações:</h4>
                        <Segment.Group>
                            <Segment>
                            {props.record.observations}
                            </Segment>
                        </Segment.Group>
                    </Segment>
                
            <Grid.Row>
                <Button
                   style={ { margin: '10px' } }
                   color="teal"
                   size="small"
                   onClick={ () => props.editButton(true) }
                >Editar ficha do paciente</Button>
                <Button
                   style={ { margin: '200px auto' } }
                   color="red"
                   size="small"
                   onClick={ props.deleteButton }
                >Excluir ficha</Button>
            </Grid.Row>
            </Segment>
            </Grid.Column>
        </Grid>
        </>
    );
};

export default patientRecordView;
