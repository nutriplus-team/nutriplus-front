import React, { Component } from 'react';

import {  Button } from 'semantic-ui-react';

import { sendAuthenticatedRequest } from '../../../../utility/httpHelper';

import DisplayMenuViewer from '../../../../components/DisplayMenuViewer/DisplayMenuViewer';

class DisplayMenu extends Component {
  state = {
      menuIds: [],
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
      removeBtnDisabled: false
  };

  componentDidMount = async () => {
      const { params } = this.props.match;
      
      await sendAuthenticatedRequest(
          '/graphql/get/',
          'post',
          (message) => this.setState({
              message: message,
          }),
          (info) => {
              if (info.data.getSingleRecord !== null)
                  this.setState({menuIds: [...info.data.getSingleRecord.menus]});
          },
          `query {
            getSingleRecord(uuidRecord:"${params.ficha_id}")
            {
                menus
            }
        }`
      );

      this.state.menuIds.forEach((menuId) => {
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
          );
      });
  };

  removeMenu = async () => {
      this.setState({removeBtnDisabled: true});

      const promises = this.state.menuIds.map(async (menuId) => 
          sendAuthenticatedRequest(
              '/graphql/get/',
              'post',
              (message) => console.log('Deu ruim... Abortar!!!', message),
              () => {},
              `mutation
                {
                    removeMenu(uuidMenu: "${menuId}")
                }`
          )
      );

      await Promise.all(promises);
      this.setState({removeBtnDisabled: false});
      this.props.removeMenu();
  }

  render() {
      return (
          <>
            <DisplayMenuViewer menus={ this.state.menus } factors={ this.state.factors }/>
            <Button
              style={ { margin: '20px auto' } }
              color="red"
              size="small"
              disabled={ this.state.removeBtnDisabled }
              onClick={ this.removeMenu }
            >Excluir Menu</Button>
          </>
      );
  }
}

export default DisplayMenu;
