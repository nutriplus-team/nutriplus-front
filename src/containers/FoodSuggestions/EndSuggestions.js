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
          += food.nutritionFacts[attributesMap[attribute]]
            * factors[food.foodName];
          });
          const vn = [attribute, nfVal];
          if (nutritionalFacts) nutritionalFacts.push(vn);
          else nutritionalFacts = [vn];
      });
      return nutritionalFacts;
  };

  generateNewMenu = async (meal, i, actualNF) => {
      await this.handleFetch(meal, i);

      let options = [];
      let j = 0;
      const appendToOptions = (actual, index) => {
          options = [
              ...options,
              <Table.Body key={ `${actual.foodName}_${j}_${index}` }>
                  <Table.Row>
                      <Table.Cell>{actual.foodName}</Table.Cell>
                      <Table.Cell>
                          {`${(
                              Number(this.state.newFactors[meal][j][index])
                * actual.measureAmount
                          ).toFixed(2)
                          } ${
                              actual.measureType}`}
                      </Table.Cell>
                      <Table.Cell>
                          {`${(
                              Number(this.state.newFactors[meal][j][index])
                * actual.measureTotalGrams
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
          this.setState({ 'totalOptions': totalOptions }, () => {
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
                  <Table.Body key={ `${actual.foodName}_${i}_${index}` }>
                      <Table.Row>
                          <Table.Cell>{actual.foodName}</Table.Cell>
                          <Table.Cell>
                              {`${(
                                  Number(this.state.newFactors[meal][i][index])
                  * actual.measureAmount
                              ).toFixed(2)
                              } ${
                                  actual.measureType}`}
                          </Table.Cell>
                          <Table.Cell>
                              {`${(
                                  Number(this.state.newFactors[meal][i][index])
                  * actual.measureTotalGrams
                              ).toFixed(2)} g`}
                          </Table.Cell>
                      </Table.Row>
                  </Table.Body>,
              ];
          };
          while (i < 3) {
              await this.handleFetch(meal, i);
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

  handleFetch = async (meal, i) => {
      console.log(this.props.global);
      const content = {
          foods: this.props.global.menus[meal].map(food => food.uuid),
          quantities: this.props.global.menus[meal].map(food => this.props.global.factors[meal][food.foodName]),
      };
      let response;
      await sendAuthenticatedRequest(
          `/diet/replace/${this.props.match.params.id}/${meal}/`,
          'post',
          () => {},
          (resp) => (response = resp),
          JSON.stringify(content),
          false,
          true
      );
      if (response.quantities.length && response.suggestions.length) {
          const newMenus = [...this.state.newMenus];
          newMenus[meal][i] = response.suggestions;
          const newFactors = [...this.state.newFactors];
          newFactors[meal][i] = response.quantities;
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
                  <Table.Body key={ actual.foodName }>
                      <Table.Row>
                          <Table.Cell>{actual.foodName}</Table.Cell>
                          <Table.Cell>
                              {`${(
                                  Number(this.props.global.factors[meal][actual.foodName])
                  * actual.measureAmount
                              ).toFixed(2)
                              } ${
                                  actual.measureType}`}
                          </Table.Cell>
                          <Table.Cell>
                              {`${(
                                  Number(this.props.global.factors[meal][actual.foodName])
                  * actual.measureTotalGrams
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

  handleEndCardapio = async () => {
      const promises1 = this.props.global.menus.map(async (menu, meal) => {
          if (menu.length === 0) {
              return;
          }
          const factors = this.props.global.factors[meal];

          return sendAuthenticatedRequest(
              '/graphql/get/',
              'post',
              () => {},
              () => {},
              `mutation
              {
                  addMenu(mealType: ${meal}, uuidRecord: "${this.props.match.params.ficha_id}", uuidPatient: "${this.props.match.params.id}", 
                    uuidFoods: [${menu.map(food => `"${food.uuid}"`)}], quantities: [${menu.map(food => parseFloat(factors[food.foodName]).toFixed(1))}])
              }`,
          );
      });

      const promises2 = this.state.newMenus.map(async (opcoes, meal) => {
          opcoes.forEach((menu) => {
              if (menu.length === 0) {
                  return;
              }
              const factors = this.props.global.factors[meal];

              return sendAuthenticatedRequest(
                  '/graphql/get/',
                  'post',
                  () => {},
                  () => {},
                  `mutation
                  {
                    addMenu(mealType: ${meal}, uuidRecord: "${this.props.match.params.ficha_id}", uuidPatient: "${this.props.match.params.id}", 
                        uuidFoods: [${menu.map(food => `"${food.uuid}"`)}], 
                        quantities: [${menu.map(food => parseFloat(factors[food.foodName]).toFixed(1))}])
                  }`,
              );
          });
      });

      const promises = [...promises1, ...promises2];

      await Promise.all(promises);
      this.props.history.push(`/pacientes/${this.props.match.params.id}/ficha/${this.props.match.params.ficha_id}`);
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
