import React, { Component } from 'react';
import {
    Table, Segment, Button, Icon, Input,
} from 'semantic-ui-react';
import { numberValidator } from '../../utility/validators';

const mealMap = {
    0: 'Café da manhã',
    1: 'Lanche da manhã',
    2: 'Almoço',
    3: 'Lanche da tarde',
    4: 'Jantar',
    5: 'Lanche da noite',
};

const attributesMap = {
    'Calorias (kcal)': 'calories',
    'Proteínas (g)': 'proteins',
    'Carboidratos (g)': 'carbohydrates',
    'Lipídios (g)': 'lipids',
    'Fibra Alimentar (g)': 'fiber',
};

class Meal extends Component {
  state = {
      available: [],
      menu: [],
  };

  componentDidMount = () => {
      this.setState({
          available: this.props.available[this.props.meal],
          menu: this.props.menus[this.props.meal],
          nutritionFact: this.compute_NF(this.props.menus[this.props.meal]),
          factors: this.props.factors[this.props.meal],
      });
  };

  // condensar NF e NFs_i em uma só
  compute_NF = (menu) => {
      let nutritionFact;
      const factors = this.props.factors[this.props.meal];
      const { attributes } = this.props;
      attributes.forEach((attribute) => {
          let nfVal = 0;
          menu.forEach((food) => {
              nfVal
          += food.nutritionFacts[attributesMap[attribute]]
            * factors[food.foodName];
          });
          const nf = [attribute, nfVal];
          if (nutritionFact) nutritionFact.push(nf);
          else nutritionFact = [nf];
      });
      return nutritionFact;
  };

  compute_NFs_i = (menu, index) => {
      let nutritionFact;
      const factors = this.props.factors[index];
      const { attributes } = this.props;
      attributes.forEach((attribute) => {
          let nfVal = 0;
          menu.forEach((food) => {
              nfVal
          += food.nutritionFacts[attributesMap[attribute]]
            * factors[food.foodName];
          });
          const nf = [attribute, nfVal];
          if (nutritionFact) nutritionFact.push(nf);
          else nutritionFact = [nf];
      });
      return nutritionFact;
  };

  compute_NFs = (menus) => {
      let nutritionFact;
      menus.forEach((menu, index) => {
          if (nutritionFact) {
              nutritionFact = this.attributeSum(
                  nutritionFact,
                  this.compute_NFs_i(menu, index),
              );
          } else nutritionFact = this.compute_NFs_i(menu, index);
      });
      this.props.handleInfos(nutritionFact);
  };

  attributeSum = (nutritionFact1, nutritionFact2) => {
      for (let i = 0; i < this.props.attributes.length; i++) {
          nutritionFact1[i][1] = nutritionFact1[i][1] + nutritionFact2[i][1];
      }
      return nutritionFact1;
  };

  componentDidUpdate = (prevProps) => {
      if (
          prevProps.meal !== this.props.meal
      || prevProps.menus !== this.props.menus
      || prevProps.factors !== this.props.factors
      ) {
          this.setState({
              available: this.props.available[this.props.meal],
              menu: this.props.menus[this.props.meal],
              nutritionFact: this.compute_NF(this.props.menus[this.props.meal]),
              factors: this.props.factors[this.props.meal],
          });
          this.compute_NFs(this.props.menus);
      }
  };

  // somente calcula o NF local
  handleMenu = (menu) => {
      this.setState({
          nutritionFact: this.compute_NF(menu),
      });
  };

  generateTable = () => {
      const { available } = this.state;
      const { menu } = this.state;
      if (available || menu) {
          const availableTable = available.map((food) => (
              <Segment.Group compact key={ food.foodName }>
                  <Segment inverted color="green">
                      <center>{food.foodName}</center>
                  </Segment>
                  <Button.Group>
                      <Button
                        food={ food }
                        type="Close Disponíveis"
                        onClick={ this.handleItemClick }
                        icon
                      >
                          <Icon name="window close outline" />
                      </Button>

                      <Button
                        food={ food }
                        type="available"
                        onClick={ this.handleItemClick }
                        icon
                      >
                          <Icon name="angle double right" />
                      </Button>
                  </Button.Group>
              </Segment.Group>
          ));
          const menuTable = menu.map((food) => (
              <Segment.Group compact key={ food.foodName }>
                  <Segment inverted color="blue">
                      <center>{food.foodName}</center>
                  </Segment>
                  <Button.Group>
                      <Button
                        food={ food }
                        type="menu"
                        onClick={ this.handleItemClick }
                        icon
                      >
                          <Icon name="angle double left" />
                      </Button>
                      <Button
                        food={ food }
                        type="Close menu"
                        onClick={ this.handleItemClick }
                        icon
                      >
                          <Icon name="window close outline" />
                      </Button>
                  </Button.Group>
              </Segment.Group>
          ));
          const table = (
              <div>
                  {' '}
                  <Table collapsing celled>
                      <Table.Header>
                          <Table.Row>
                              <Table.HeaderCell width={ 6 }>
                                  <center>Alimentos disponíveis</center>
                              </Table.HeaderCell>
                              <Table.HeaderCell width={ 6 }>
                                  <center>Cardápio</center>
                              </Table.HeaderCell>
                          </Table.Row>
                      </Table.Header>
                      <Table.Body>
                          <Table.Row textAlign="center">
                              <Table.Cell>{availableTable}</Table.Cell>
                              <Table.Cell>{menuTable}</Table.Cell>
                          </Table.Row>
                      </Table.Body>
                  </Table>
              </div>
          );
          return table;
      } return null;
  };

  handleItemClick = (e, { food, type }) => {
      const { available } = this.state;
      const { menu } = this.state;
      if (type === 'available') {
          available.splice(available.indexOf(food), 1);
          menu.push(food);
      }
      if (type === 'menu') {
          menu.splice(menu.indexOf(food), 1);
          available.push(food);
      }
      if (type === 'Close Disponíveis') {
          available.splice(available.indexOf(food), 1);
      }
      if (type === 'Close menu') {
          menu.splice(menu.indexOf(food), 1);
      }
      this.setState({
          available,
          menu,
      });
      this.handleMenu(menu);
      this.props.handleMenus(this.state.meal, menu);
      this.props.handleAvailable(this.state.meal, available);
      this.compute_NFs(this.props.menus);
  };

  generateChart = () => {
      const { nutritionFact } = this.state;
      let content;
      if (nutritionFact) {
          content = nutritionFact.map((valor) => (
              <Table.Body key={ valor[0] }>
                  <Table.Row>
                      <Table.Cell>{valor[0]}</Table.Cell>
                      <Table.Cell>{valor[1].toFixed(2)}</Table.Cell>
                  </Table.Row>
              </Table.Body>
          ));
      }
      const table = (
          <Table>
              <Table.Header>
                  <Table.Row>
                      <Table.HeaderCell>Infos locais</Table.HeaderCell>
                  </Table.Row>
              </Table.Header>
              {content}
          </Table>
      );
      return table;
  };

  searchFactor = (food) => {
      const factors = this.props.factors[this.props.meal];
      return factors[food];
  };

  setFactor = async (food, event) => {
      if (event) {
          let factors = this.props.factors[this.props.meal];
          factors = factors ? factors : {}; 
          factors[food.foodName] = event.target.value;
          await new Promise((resolve) => {
              this.setState({ factors }, () => {
                  resolve();
              });
          });
          this.handleMenu(this.state.menu);
          this.props.handleFactors(this.props.meal, factors);
          this.compute_NFs(this.props.menus);
      }
  };

  gerenateFactor = () => {
      const { menu } = this.state;
      let content;
      if (menu) {
          content = menu.map((food) => (
              <Table.Row key={ food.foodName }>
                  <Table.Cell>{food.foodName}</Table.Cell>
                  <Table.Cell>
                      <Input
                        value={ this.searchFactor(food.foodName) }
                        onChange={ (e) => {
                            if (!numberValidator(e.target.value, 2, true, 1)) return;
                            this.setFactor(food, e);
                        } }
                      />
                  </Table.Cell>
                  <Table.Cell>
                      {`${(
                          food.measureAmount * Number(this.searchFactor(food.foodName))
                      ).toFixed(2)
                      } ${
                          food.measureType}`}
                  </Table.Cell>
              </Table.Row>
          ));
      }
      const table = (
          <Table>
              <Table.Header>
                  <Table.Row>
                      <Table.HeaderCell>Alimento</Table.HeaderCell>
                      <Table.HeaderCell>Quantidade (porções)</Table.HeaderCell>
                      <Table.HeaderCell>Porções caseiras</Table.HeaderCell>
                  </Table.Row>
              </Table.Header>
              <Table.Body>{content}</Table.Body>
          </Table>
      );
      return table;
  };

  render() {
      const table = this.generateTable();
      const chart = this.generateChart();
      const fator = this.gerenateFactor();
      const { meal } = this.props;
      if (table) {
          return (
              <div>
                  <h2>{mealMap[meal]}</h2>
                  <center>{table}</center>
                  <br />
                  <br />
                  <center>{fator}</center>
                  <br />
                  <br />
                  <center>{chart}</center>
              </div>
          );
      } return null;
  }
}

export default Meal;
