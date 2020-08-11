import React from 'react';
import { Grid, Header, Segment, Button} from 'semantic-ui-react';

const patientRecordView = (props) => {

    /*{this.state.record ? (
        <div>
            {Object.keys(this.state.record).map((key) => (
                <p key={ key }>{this.processObjectKey(key)}</p>
            ))}
        </div>
    ) : null}*/

    return (
        <>
        <Grid
            textAlign="center"
            style={ { height: '10vh' } }
        >
            <Grid.Column style={ { maxWidth: 900 }}>
                <Header as="h2" color="teal" textAlign="center">
                    Resumo
                </Header>

                <Segment textAlign="left">
                    <h3>Taxas metabólicas:</h3>
                    <Segment.Group>
                        <Segment>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        <Segment><h4>Tinsley com peso total:</h4> </Segment>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Segment><h4>Tinsley livre de gordura:</h4> </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Segment><h4>Cunninghan:</h4> </Segment>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Segment><h4>Miffin:</h4> </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Segment.Group>
                </Segment>

                <Segment textAlign="left">
                    <h3>Taxa de gordurda:</h3>
                    <Segment.Group>
                        <Segment>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        <Segment><h4>Pollok:</h4> </Segment>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Segment><h4>Foulkner:</h4> </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Segment.Group>
                </Segment>

                <Segment>
                    <Segment textAlign="left">
                        <h4>Anamnese:</h4>
                        <Segment.Group>
                            <Segment>
                                asojdasijd
                            </Segment>
                        </Segment.Group>
                    </Segment>

                    <Segment textAlign="left">
                        <h4>Exame:</h4>
                        <Segment.Group>
                            <Segment>
                                asojdasijd
                            </Segment>
                        </Segment.Group>
                    </Segment>

                    <Grid
                      columns="equal"
                      textAlign="left"
                    >
                        <Grid.Column>
                            <Segment><h4>Peso:</h4> </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment><h4>Altura:</h4> </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment><h4>IMC:</h4></Segment>
                        </Grid.Column>
                    </Grid>

                    <Grid
                      columns="equal"
                      textAlign="left"
                    >
                        <Grid.Column>
                            <Segment><h4>Massa muscular:</h4> </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment><h4>Necessidades energéticas:</h4> </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment><h4>Densidade corporal:</h4></Segment>
                        </Grid.Column>
                    </Grid>

                    <Grid
                      columns="equal"
                      textAlign="left"
                    >
                        <Grid.Column>
                            <Segment><h4>Atleta:</h4> </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment><h4>Nível de atividade física:</h4> </Segment>
                        </Grid.Column>
                    </Grid>

                    <Segment textAlign="left">
                        <h3>Pregas:</h3>
                        <Segment.Group>
                            <Segment>
                                <Grid columns="equal">
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment>Subscapula: mm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Triceps: mm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Biceps: mm</Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment>Peitoral: mm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Axiola média: mm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Suproilíaca: mm</Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment>Abdominal: mm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Coxa: mm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Panturrilha: mm</Segment>
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
                                            <Segment>Cintura: cm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Abdominal: cm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Quadril: cm</Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment>Braço direito: cm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Coxa média: cm</Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>Panturrilha: cm</Segment>
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
                                asojdasijd
                            </Segment>
                        </Segment.Group>
                    </Segment>
                </Segment>
            <Grid.Row>
                <Button
                   style={ { margin: '10px' } }
                   color="teal"
                   size="small"
                   onClick={ props.editButton }
                >Editar ficha do paciente</Button>
                <Button
                   style={ { margin: '200px auto' } }
                   color="red"
                   size="small"
                   onClick={ props.deleteButton }
                >Excluir ficha</Button>
            { props.onlyView ? 
            (<Button
                    style={ { margin: '10px' } }
                    color="teal"
                    size="medium"
                    onClick={ props.returnButton }
                >
            Voltar à página do paciente
                </Button>) 
            : null
            }
            </Grid.Row>
            
            </Grid.Column>
        </Grid>
        </>
    );
};

export default patientRecordView;