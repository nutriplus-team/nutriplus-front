import React from 'react';
import { Button, Icon, Table, List } from 'semantic-ui-react';

const paginator = (props) => {
    const totalLength = props.queryResults.data[props.queryString].length;

    let results = props.queryResults.data[props.queryString]
        .filter(props.filter)
        .map(props.listElementMap);

    if (props.isList) {
        results = (
            <List divided relaxed>
                {results.map((result) => {
                    return (
                    <List.Item key={ result.key }>
                        <List.Icon name='user circle' size='large' verticalAlign='middle' />
                        <List.Content>
                            <List.Header style = { {textAlign: 'left', marginLeft: '10px' } }>{result}</List.Header>
                        </List.Content>
                    </List.Item>);
                })}
            </List>
        );
    }

    if (props.isTable) {
        results = (
            <Table>
                {props.tableHeader}
                <Table.Body>{results}</Table.Body>
            </Table>
        );
    }

    const prevButton = (
        <Button
          onClick={ () => props.changePage(props.page - 1) }
          icon
          floated='left'
          size={ props.buttonSize || 'medium' }
          disabled={ props.page === 0 }
        >
            <Icon name="angle double left" />
        </Button>
    );
    const nextButton = (
        <Button
          onClick={ () => props.changePage(props.page + 1) }
          icon
          floated='right'
          size={ props.buttonSize || 'medium' }
          disabled={ props.page + 1 >= (totalLength/props.pageSize) }
        >
            <Icon name="angle double right" />
        </Button>
    );

    return (
        <>
      {results}
      {(totalLength > props.pageSize) && (
          <>
          {prevButton}
          {nextButton}
          </>
      )}
        </>
    );
};

export default paginator;
