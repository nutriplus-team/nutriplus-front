import React, { Component } from 'react';
import { Table, Input, Button } from 'semantic-ui-react';
import { sendAuthenticatedRequest } from '../../utility/httpHelper';

import { numberValidator } from '../../utility/validators';

class GenerateSuggestions extends Component {
  state = {
      name: this.props.name,
      NF: this.props.NF[this.props.meal],
  };

  componentDidUpdate = (prevProps) => {
      if (prevProps !== this.props) {
          this.setState({ NF: this.props.NF[this.props.meal] });
      }
  };

  setNewNF = async (value, event) => {
      if (event) {
          let { NF } = this.state;
          NF = NF.map((item) => {
              if (item === value) {
                  return [value[0], event.target.value];
              }
              return item;
          });
          await new Promise((resolve) => {
              this.setState({ NF }, () => {
                  resolve();
              });
          });
          this.props.handleNFs(NF, this.props.meal);
      }
  };

  generateTable = () => {
      let content;
      content = this.state.NF.map((value) => (
          <Table.Row key={ value[0] }>
              <Table.Cell>{value[0]}</Table.Cell>
              <Table.Cell>
                  <Input
                    value={ value[1] }
                    onChange={ (e) => {
                        if (!numberValidator(e.target.value, 5)) return;
                        this.setNewNF(value, e);
                    } }
                  />
              </Table.Cell>
          </Table.Row>
      ));
      return (
          <Table>
              <Table.Header>
                  <Table.Row>
                      <Table.HeaderCell>{this.state.name}</Table.HeaderCell>
                  </Table.Row>
                  {content}
              </Table.Header>
          </Table>
      );
  };

  handleFetch = async () => {
      const content = {};
      this.state.NF.forEach((atribute) => {
          content[this.props.translationMap[atribute[0]]] = +atribute[1];
      });
      let response;
      await sendAuthenticatedRequest(
          `/diet/generate/${this.props.patient_id}/${this.props.meal}/`,
          'post',
          () => {},
          (resp) => (response = resp),
          JSON.stringify(content),
          false,
          true
      );
      if (response.quantities.length && response.suggestions.length) {
          this.props.handleMenus(this.props.meal, response.suggestions);
          this.setFactor(
              this.props.meal,
              response.suggestions,
              response.quantities,
          );
      }
  };

  setFactor = (meal, foods, quantities) => {
      const factors = this.props.factors[meal];
      foods.forEach((food, index) => {
          factors[food.foodName] = quantities[index];
      });
      this.props.handleFactors(this.props.meal, factors);
  };

  render() {
      const table = this.generateTable();
      if (table) {
          return (
              <>
          <center>
              <br />
              <h3> Gerador de cardápios</h3>
              {table}
          </center>
          <Button onClick={ () => this.handleFetch() }>Gerar!</Button>
              </>
          );
      } return '';
  }
}

export default GenerateSuggestions;
