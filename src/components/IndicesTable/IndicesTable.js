import React from 'react';
import { Table } from 'semantic-ui-react';

const indicesTable = (props) => (props.indices &&
    <Table>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Informações Específicas</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            <Table.Row>
                <Table.Cell>Taxa de Gordura por <b>{props.indices['bodyFat'].name}</b></Table.Cell>
                <Table.Cell>{props.indices['bodyFat'].value.toFixed(2)}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Taxa Metabólica por <b>{props.indices['methabolicRate'].name}</b></Table.Cell>
                <Table.Cell>{props.indices['methabolicRate'].value.toFixed(2)}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>{props.indices['energyRequirements'].name}</Table.Cell>
                <Table.Cell>{props.indices['energyRequirements'].value.toFixed(2)}</Table.Cell>
            </Table.Row>
        </Table.Body>
    </Table>
);

export default indicesTable;
