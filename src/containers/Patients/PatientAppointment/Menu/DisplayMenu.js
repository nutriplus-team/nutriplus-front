import React, { Component } from 'react';

import {  Button } from 'semantic-ui-react';

import { sendAuthenticatedRequest } from '../../../../utility/httpHelper';

import DisplayMenuViewer from '../../../../components/DisplayMenuViewer/DisplayMenuViewer';

class DisplayMenu extends Component {
  state = {
      menus: [
          [null,null,null],
          [null,null,null],
          [null,null,null],
          [null,null,null],
          [null,null,null],
          [null,null,null],
      ],
      factors: [
          [null,null,null],
          [null,null,null],
          [null,null,null],
          [null,null,null],
          [null,null,null],
          [null,null,null],
      ],
  };

  componentDidMount = () => {
      const menuIds = this.props.menuIds;
      console.log(menuIds);

      menuIds.forEach((menuId) => {
          sendAuthenticatedRequest(
              '/graphql/get/',
              'post',
              (message) => console.log('Deu ruim... Abortar!!!', message),
              (info) => {
                  const newMenus = [...this.state.menus];
                  newMenus[info.data['getMenu'].mealType] = info.data['getMenu'].portions.map((portion) => portion.food);
  
                  const newFactors = [...this.state.factors];
                  newFactors[info.data['getMenu'].mealType] = info.data['getMenu'].portions.map((portion) => portion.quantity);
  
                  this.setState({menus: newMenus, factors: newFactors});
              },
              `query {
              getMenu(uuidMenu: "${menuId}", uuidPatient: "${this.props.match.params.id}") {
                 uuid
                 mealType
                 portions {
                    quantity
                    food {
                       uuid
                       foodName
                       measureAmount,
                      measureType,
                      measureTotalGrams
                    }
                 }
              }
           }`
          );});
  };

  render() {
      return (
          <>
            <DisplayMenuViewer menus={ this.state.menus } factors={ this.state.factors }/>
            <Button
              style={ { margin: '20px auto' } }
              color="red"
              size="small"
              onClick={ () => {} }
            >Excluir Menu</Button>
          </>
      );
  }
}

export default DisplayMenu;
