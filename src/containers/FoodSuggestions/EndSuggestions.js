import React, { Component } from 'react';
import { Table, Button, Grid } from 'semantic-ui-react';
import { sendAuthenticatedRequest } from '../../utility/httpHelper';

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
    'Lipídeos (g)': 'lipids',
    'Fibra Alimentar (g)': 'fiber',
};

class EndCardapio extends Component {
  state = {
      newMenus: [
          [[], [], []],
          [[], [], []],
          [[], [], []],
          [[], [], []],
          [[], [], []],
          [[], [], []],
      ],
      newFactors: [
          [[], [], []],
          [[], [], []],
          [[], [], []],
          [[], [], []],
          [[], [], []],
          [[], [], []],
      ],
      options: [[], [], [], [], [], []],
      mounted: 0,
  };

  computeNF = (menu, meal) => {
      const factors = this.props.global.factors[meal];
      let nutritionalFacts;
      const { attributes } = this.props;
      attributes.forEach((attribute) => {
          let nfVal = 0;
          menu.forEach((food) => {
              nfVal
          += food.nutrition_facts[attributesMap[attribute]]
            * factors[food.food_name];
          });
          const vn = [attribute, nfVal];
          if (nutritionalFacts) nutritionalFacts.push(vn);
          else nutritionalFacts = [vn];
      });
      return nutritionalFacts;
  };

  generateNewMenu = async (meal, i, actualNF) => {
      await this.handleFetch(actualNF, meal, i);

      let options = [];
      let j = 0;
      const appendToOptions = (actual, index) => {
          options = [
              ...options,
              <Table.Body key={ `${actual.food_name}_${j}_${index}` }>
                  <Table.Row>
                      <Table.Cell>{actual.food_name}</Table.Cell>
                      <Table.Cell>
                          {`${(
                              Number(this.state.newFactors[meal][j][index])
                * actual.measure_amount
                          ).toFixed(2)
                          } ${
                              actual.measure_type}`}
                      </Table.Cell>
                      <Table.Cell>
                          {`${(
                              Number(this.state.newFactors[meal][j][index])
                * actual.measure_total_grams
                          ).toFixed(2)} g`}
                      </Table.Cell>
                  </Table.Row>
              </Table.Body>,
          ];
      };
      while (j < 3) {
          options = [
              ...options,
              <Table.Body key={ j }>
                  <Table.Row active>
                      <Table.Cell />
                      <Table.Cell textAlign="center">
                          <Button
                            type={ j }
                            onClick={ (event, { type }) => this.generateNewMenu(meal, type, actualNF) }
                            color="orange"
                          >
                Gerar outra opção
                          </Button>
                      </Table.Cell>
                      <Table.Cell />
                  </Table.Row>
              </Table.Body>,
          ];
          this.state.newMenus[meal][j].forEach(appendToOptions);
          j += 1;
      }

      const totalOptions = this.state.options;
      totalOptions[meal] = options;
      await new Promise((resolve) => {
          this.setState({ totalOptions }, () => {
              resolve();
          });
      });
  };

  componentDidMount = async () => {
      this.props.global.menus.map(async (menu, meal) => {
          if (menu.length === 0) {
              return;
          }
          const actualNF = this.computeNF(menu, meal);
          let i = 0;

          let options = [];
          const appendToOptions = (actual, index) => {
              options = [
                  ...options,
                  <Table.Body key={ `${actual.food_name}_${i}_${index}` }>
                      <Table.Row>
                          <Table.Cell>{actual.food_name}</Table.Cell>
                          <Table.Cell>
                              {`${(
                                  Number(this.state.newFactors[meal][i][index])
                  * actual.measure_amount
                              ).toFixed(2)
                              } ${
                                  actual.measure_type}`}
                          </Table.Cell>
                          <Table.Cell>
                              {`${(
                                  Number(this.state.newFactors[meal][i][index])
                  * actual.measure_total_grams
                              ).toFixed(2)} g`}
                          </Table.Cell>
                      </Table.Row>
                  </Table.Body>,
              ];
          };
          while (i < 3) {
              await this.handleFetch(actualNF, meal, i);
              options = [
                  ...options,
                  <Table.Body key={ i }>
                      <Table.Row active>
                          <Table.Cell />
                          <Table.Cell textAlign="center">
                              <Button
                                type={ i }
                                onClick={ (event, { type }) => this.generateNewMenu(meal, type, actualNF) }
                                color="orange"
                              >
                  Gerar outra opção
                              </Button>
                          </Table.Cell>
                          <Table.Cell />
                      </Table.Row>
                  </Table.Body>,
              ];
              this.state.newMenus[meal][i].forEach(appendToOptions);
              i += 1;
          }
          const totalOptions = this.state.options;
          totalOptions[meal] = options;
          await new Promise((resolve) => {
              this.setState({ totalOptions }, () => {
                  resolve();
              });
          });
      });
      this.setState({ mounted: 1 });
  };

  handleFetch = async (actualNF, meal, i) => {
      const content = {};
      actualNF.forEach((attribute) => {
          content[attributesMap[attribute[0]]] = attribute[1].toString(10);
      });
      let response;
      await sendAuthenticatedRequest(
          `/menu/generate/${meal + 1}/${this.props.match.params.id}/`,
          'post',
          () => {},
          (resp) => (response = resp),
          JSON.stringify(content),
      );
      if (response.Quantities.length && response.Suggestions.length) {
          const newMenus = [...this.state.newMenus];
          newMenus[meal][i] = response.Suggestions;
          const newFactors = [...this.state.newFactors];
          newFactors[meal][i] = response.Quantities;
          await new Promise((resolve) => {
              this.setState({ newMenus, newFactors }, () => {
                  resolve();
              });
          });
      }
  };

  generateContent = () => {
      const content = this.props.global.menus.map((menu, meal) => {
          let content_i;
          // todas as refeicoes, todas as tabelas
          if (menu.length === 0) {
              return null;
          }
          content_i = menu.map((actual) =>
          // uma refeicao, uma tabela com varios "ou"
              (
                  <Table.Body key={ actual.food_name }>
                      <Table.Row>
                          <Table.Cell>{actual.food_name}</Table.Cell>
                          <Table.Cell>
                              {`${(
                                  Number(this.props.global.factors[meal][actual.food_name])
                  * actual.measure_amount
                              ).toFixed(2)
                              } ${
                                  actual.measure_type}`}
                          </Table.Cell>
                          <Table.Cell>
                              {`${(
                                  Number(this.props.global.factors[meal][actual.food_name])
                  * actual.measure_total_grams
                              ).toFixed(2)} g`}
                          </Table.Cell>
                      </Table.Row>
                  </Table.Body>
              ),
          '');

          const options = this.state.options[meal];
          content_i = [...content_i, ...options];
          return (
              <React.Fragment key={ meal }>
                  <Grid centered>
                      <Grid.Column width={ 9 }>
                          <Table>
                              <Table.Header>
                                  <Table.Row>
                                      <Table.HeaderCell width={ 3 }>
                                          {mealMap[meal]}
                                      </Table.HeaderCell>
                                      <Table.HeaderCell width={ 3 }>
                      Quantidade caseira
                                      </Table.HeaderCell>
                                      <Table.HeaderCell width={ 3 }>
                      Quantidade em gramas
                                      </Table.HeaderCell>
                                  </Table.Row>
                              </Table.Header>
                              {content_i}
                          </Table>
                      </Grid.Column>
                  </Grid>
              </React.Fragment>
          );
      });
      return content;
  };

  handleEndCardapio = () => {
      this.props.global.menus.forEach((menu, meal) => {
          if (menu.length === 0) {
              return null;
          }
          const body = {};
          const factors = this.props.global.factors[meal];
          body.meal_type = meal + 1;
          let ansCardapio = '';
          let ansQuantities = '';
          menu.forEach((food) => {
              ansCardapio += `${food.id}&`;
              ansQuantities += `${factors[food.food_name]}&`;
          });
          ansCardapio = ansCardapio.slice(0, -1);
          ansQuantities = ansQuantities.slice(0, -1);
          body.foods = ansCardapio;
          body.quantities = ansQuantities;
          sendAuthenticatedRequest(
              `/menu/add-new/${this.props.match.params.id}/`,
              'post',
              /*(mes) => {
                  console.log('mes: ', mes);
              },
              (res) => {
                  console.log('res: ', res);
              },*/
              () => {},
              () => {},
              JSON.stringify(body),
          );
      });

      this.state.newMenus.forEach((opcoes, meal) => {
          opcoes.forEach((menu, i) => {
              if (menu.length === 0) {
                  return;
              }
              const body = {};
              const factors = this.state.newFactors[meal][i];
              body.meal_type = meal + 1;
              let ansCardapio = '';
              let ansQuantities = '';
              menu.forEach((food, index) => {
                  ansCardapio += `${food.id}&`;
                  ansQuantities += `${factors[index]}&`;
              });
              ansCardapio = ansCardapio.slice(0, -1);
              ansQuantities = ansQuantities.slice(0, -1);
              body.foods = ansCardapio;
              body.quantities = ansQuantities;
              sendAuthenticatedRequest(
                  `/menu/add-new/${this.props.match.params.id}/`,
                  'post',
                  /*(mes) => {
                      console.log('mes: ', mes);
                  },
                  (res) => {
                      console.log('res: ', res);
                  },*/
                  () => {},
                  () => {},
                  JSON.stringify(body),
              );
          });
      });

      this.props.history.push('/');
  };

  render() {
      if (this.state.mounted === 1) {
          const content = this.generateContent();
          return (
              <div>
                  <h1>Resumo do Cardapio</h1>
                  <center>{content}</center>

                  <Button onClick={ () => this.handleEndCardapio() }>Fim</Button>
              </div>
          );
      }
      return '';
  }
}

export default EndCardapio;
