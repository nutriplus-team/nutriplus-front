import React, { Component } from 'react';
import { Grid, Header, Segment} from 'semantic-ui-react';

class DisplayMenu extends Component {

    /*const mapNumberToPhysicalActivityOption = (number) => {
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
    };*/

    render() {
        return (
            <>
            <Grid
                textAlign="center"
                style={ { height: '10vh' } }
            >
                {console.log(this.props)}
                <Grid.Column style={ { maxWidth: 900 }}>
                    <Header as="h2" color="teal" textAlign="center">
                        Resumo
                    </Header>

                    <Grid columns="equal">
                        <Grid.Row>
                            <Grid.Column>
                                <Segment><h4>Taxa de gordura por :</h4>  </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment><h4>Taxa metabólica por :</h4> </Segment>
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
                                <Segment><h4>Peso:</h4> Kg</Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment><h4>Altura:</h4>  m</Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment><h4>IMC:</h4> </Segment>
                            </Grid.Column>
                        </Grid>

                        <Grid
                        columns="equal"
                        textAlign="center"
                        >
                            <Grid.Column>
                                <Segment><h4>Massa muscular:</h4>  </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment><h4>Necessidades energéticas:</h4>  </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment><h4>Densidade corporal:</h4>  </Segment>
                            </Grid.Column>
                        </Grid>

                        <Grid
                        columns="equal"
                        textAlign="center"
                        >
                            <Grid.Column>
                                <Segment><h4>Atleta:</h4>  </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment><h4>Nível de atividade física:</h4> 
                                </Segment>
                            </Grid.Column>
                        </Grid>

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
                                                <Segment>Abdominal:  cm</Segment>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Segment>Quadril:  cm</Segment>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Segment>Braço direito:  cm</Segment>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Segment>Coxa média:  cm</Segment>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Segment>Panturrilha:  cm</Segment>
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
                                
                                </Segment>
                            </Segment.Group>
                        </Segment>
                </Segment>
                </Grid.Column>
            </Grid>
            </>
        );
    };
};

export default DisplayMenu;
