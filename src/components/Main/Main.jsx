import React, { Component } from 'react';
import { Grid, GridRow } from 'semantic-ui-react';
import MeuCarousel from '..//Carousel/Carousel.jsx';
import Logo from '../Logo/Logo';
import './Main.css';

class Main extends Component {

    render (){
        return (
            <Grid divided='vertically' textAlign="center">
                    <Grid.Row>
                        <Grid.Column><div className="logo"><Logo/></div></Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column></Grid.Column>
                        <Grid.Column width={ 12 }><p style={ { textAlign: 'justify', fontSize: 20 } }>
                            Bem vindo à NutriPlus. Aqui você pode gerar
                            cardápios personalizados de acordo com necessidades energéticas específicas.
                            Cadastre seus pacientes e crie uma ficha com
                            medidas de peso e de altura. Insira, na página do paciente, 
                            as necessidades nutricionais para gerar uma 
                            sugestão de cardápio.</p>
                        </Grid.Column>
                        <Grid.Column></Grid.Column>
                    </Grid.Row>
                    <GridRow width={ 4 }>
                        <MeuCarousel/>
                    </GridRow>
             </Grid>
        );
    }
}

export default Main;
