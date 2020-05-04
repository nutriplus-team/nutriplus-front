import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

class Infos extends Component {
  state = {
      nutritionFacts: this.props.nutritionFacts,
  };

  componentDidUpdate = (prevProps) => {
      if (this.props.nutritionFacts !== prevProps.nutritionFacts) {
          this.setState({ nutritionFacts: this.props.nutritionFacts });
      }
  };

  generateTable = () => {
      const table = (
          <Table>
              <Table.Header>
                  <Table.Row>
                      <Table.HeaderCell>Infos</Table.HeaderCell>
                  </Table.Row>
              </Table.Header>
              <Table.Body>
                  {this.state.nutritionFacts.map((value) => (
                      <Table.Row key={ value[0] }>
                          <Table.Cell>{value[0]}</Table.Cell>
                          <Table.Cell>{value[1].toFixed(2)}</Table.Cell>
                      </Table.Row>
                  ))}
              </Table.Body>
          </Table>
      );
      return table;
  };

  render() {
      const table = this.generateTable();
      return table;
  }
}

export default Infos;
