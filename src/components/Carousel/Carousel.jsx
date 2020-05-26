import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import register from '../../assets/images/register.png';
import gen_menu from '../../assets/images/resumoo.png';
import gen_options from '../../assets/images/gen_menu.jpg';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

class MeuCarousel extends Component {
    render() {
        return (
            <Carousel autoPlay={ true } 
              transitionTime= { 500 }
              interval={ 5000 } 
              infiniteLoop={ true } 
              stopOnHover={ true }
              showThumbs={ false }
            >
                <div>
                    <img src={ register } alt="Registro de um paciente"/>
                    <p className="legend">Você pode inserir pacientes em um banco de dados, que fica salvo
            na nuvem, sem ocupar espaço de seu computador.</p>
                </div>
                <div>
                    <img src={ gen_options } alt="Exemplo de criacao de cardapios"/>
                    <p className="legend"> Criar cardápios agora ficou muito fácil! Você pode criar e
            configurar cardápios, de cada refeição, para cada um de seus
            pacientes.</p>
                </div>
                <div>
                    <img src={ gen_menu } alt="Exemplo de cardapio gerado"/>
                    <p className="legend">Você também obtém um resumo do cardápio montado, além de várias
            opções equivalentes! Você também pode solicitar novas opções para
            cada refeição.</p>
                </div>
            </Carousel>
        );
    }
}

export default MeuCarousel;