import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import EndSuggestions from "./EndSuggestions";
import MainSuggestions from "./MainSuggestions";
import { sendAuthenticatedRequest } from "../../utility/httpHelper";

const displayMap = {
  calories: "Calorias",
  proteins: "Proteínas",
  carbohydrates: "Carboidratos",
  lipids: "Lipídeos",
  fiber: "Fibra Alimentar",
};

class FoodSuggestions extends Component {
  state = {
    attributes: null,
    global: null,
  };

  componentDidMount = async () => {
    this.setState({
      mounted: 1,
    });
    sendAuthenticatedRequest(
      "/foods/get-units/",
      "get",
      () => {},
      (info) => {
        let attributes = Object.keys(info).map(
          (key) => `${displayMap[key]} (${info[key]})`
        );
        this.setState({
          attributes: attributes,
        });
      }
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
            render={(props) => (
              <MainSuggestions
                {...props}
                attributes={this.state.attributes}
                handleGlobal={this.handleGlobal}
              />
            )}
          />
          <Route
            path="/cardapio/:id/fim"
            render={(props) => (
              <EndSuggestions
                {...props}
                attributes={this.state.attributes}
                global={this.state.global}
              />
            )}
          />

          <Redirect
            to={`/cardapio/${this.props.match.params["id"]}/principal`}
          />
        </Switch>
      );
    }

    if (this.state.mounted && this.state.attributes) {
      return <div>{routes}</div>;
    } else return "";
  }
}

export default FoodSuggestions;
