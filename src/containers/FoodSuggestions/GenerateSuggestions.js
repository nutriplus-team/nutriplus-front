import React, { Component } from "react";
import { Table, Input } from "semantic-ui-react";
import { sendAuthenticatedRequest } from "../../utility/httpHelper";
import { Button } from "semantic-ui-react";
import { numberValidator } from "../../utility/validators";

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
      let NF = this.state.NF;
      NF = NF.map((item) => {
        if (item === value) {
          return [value[0], event.target.value];
        }
        return item;
      });
      await new Promise((resolve) => {
        this.setState({ NF: NF }, () => {
          resolve();
        });
      });
      this.props.handleNFs(NF, this.props.meal);
    }
  };

  generateTable = () => {
    let content;
    content = this.state.NF.map((value) => {
      return (
        <Table.Row key={value[0]}>
          <Table.Cell>{value[0]}</Table.Cell>
          <Table.Cell>
            <Input
              value={value[1]}
              onChange={(e) => {
                if (!numberValidator(e.target.value, 5)) return;
                this.setNewNF(value, e);
              }}
            ></Input>
          </Table.Cell>
        </Table.Row>
      );
    });
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
    let content = {};
    this.state.NF.forEach((atribute) => {
      content[this.props.translationMap[atribute[0]]] = atribute[1].toString(
        10
      );
    });
    let response;
    await sendAuthenticatedRequest(
      `/menu/generate/${this.props.meal + 1}/${this.props.patient_id}/`,
      "post",
      () => {},
      (resp) => (response = resp),
      JSON.stringify(content)
    );
    if (response["Quantities"].length && response["Suggestions"].length) {
      this.props.handleMenus(this.props.meal, response["Suggestions"]);
      this.setFactor(
        this.props.meal,
        response["Suggestions"],
        response["Quantities"]
      );
    }
  };

  setFactor = (meal, foods, quantities) => {
    let factors = this.props.factors[meal];
    foods.forEach((food, index) => {
      factors[food.food_name] = quantities[index];
    });
    this.props.handleFactors(this.props.meal, factors);
  };

  render() {
    let table = this.generateTable();
    if (table) {
      return (
        <React.Fragment>
          <center>
            <br></br>
            <h3> Gerador de cardápios</h3>
            {table}
          </center>
          <Button onClick={() => this.handleFetch()}>Gerar!</Button>
        </React.Fragment>
      );
    } else return "";
  }
}

export default GenerateSuggestions;
