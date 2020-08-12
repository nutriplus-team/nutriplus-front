import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import EndSuggestions from './EndSuggestions';
import MainSuggestions from './MainSuggestions';
import { sendAuthenticatedRequest } from '../../utility/httpHelper';

class FoodSuggestions extends Component {
  state = {
      attributes: null,
      global: null,
      foodRestrictions: null,
  };

  componentDidMount = async () => {
      this.setState({
          mounted: 1,
          attributes: ['Calorias (kcal)', 'Proteínas (g)', 'Carboidratos (g)', 'Lipídios (g)', 'Fibra Alimentar (g)']
      });
      sendAuthenticatedRequest(
          '/graphql/get/',
          'post',
          () => {},
          (info) => {
              this.setState({ foodRestrictions: info.data.getFoodRestrictions });
          },
          `{
            getFoodRestrictions(uuidPatient: "${this.props.match.params.id}")
        {
            uuid, foodName
        }
        }`
      );
  };

  handleGlobal = (global) => {
      this.setState({ global: global });
  };

  render() {
      let routes;
      if (this.state.attributes) {
          routes = (
              <Switch>
                  <Route
                    path="/cardapio/:id/principal"
                    render={ (props) => (
                          <MainSuggestions
                            { ...props }
                            attributes={ this.state.attributes }
                            handleGlobal={ this.handleGlobal }
                            foodRestrictions={ this.state.foodRestrictions }
                          />
                    ) }
                  />
                  <Route
                    path="/cardapio/:id/fim"
                    render={ (props) => (
                          <EndSuggestions
                            { ...props }
                            attributes={ this.state.attributes }
                            global={ this.state.global }
                          />
                    ) }
                  />

                  <Redirect
                    to={ `/cardapio/${this.props.match.params.id}/principal` }
                  />
              </Switch>
          );
      }

      if (this.state.mounted && this.state.attributes) {
          return <div>{routes}</div>;
      } return '';
  }
}

export default FoodSuggestions;
