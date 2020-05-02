import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

class MealTable extends Component {
  state = {};
  render() {
    let meal = this.props.meal;
    let name = "Infos";
    return (
      <center>
        <Menu vertical>
          <Menu.Item>
            <Menu.Header>Refeições</Menu.Header>
            <Menu.Menu>
              <Menu.Item
                name={name}
                value={0}
                active={meal === 0}
                onClick={this.props.handleMeal}
              >
                Café da manhã
              </Menu.Item>
              <Menu.Item
                name={name}
                value={1}
                active={meal === 1}
                onClick={this.props.handleMeal}
              >
                Lanche da manhã
              </Menu.Item>
              <Menu.Item
                name={name}
                value={2}
                active={meal === 2}
                onClick={this.props.handleMeal}
              >
                Almoço
              </Menu.Item>
              <Menu.Item
                name={name}
                value={3}
                active={meal === 3}
                onClick={this.props.handleMeal}
              >
                Lanche da tarde
              </Menu.Item>
              <Menu.Item
                name={name}
                value={4}
                active={meal === 4}
                onClick={this.props.handleMeal}
              >
                Jantar
              </Menu.Item>
              <Menu.Item
                name={name}
                value={5}
                active={meal === 5}
                onClick={this.props.handleMeal}
              >
                Lanche da noite
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>
        </Menu>
      </center>
    );
  }
}

export default MealTable;