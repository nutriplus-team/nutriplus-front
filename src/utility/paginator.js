import React from 'react';
import { Button, Icon, Table, List, Grid } from 'semantic-ui-react';

import { sendAuthenticatedRequest } from './httpHelper';

const paginator = (props) => {
    // use as handleChangePage("next") or handleChangePage("previous")
    const handleChangePage = async (str) => {
        sendAuthenticatedRequest(
            props.queryResults[str],
            'get',
            (message) => props.setMessage(message),
            (info) => {
                props.setResults(info);
                props.setHasPrevious(info.previous !== null);
                props.setHasNext(info.next != null);
            },
            null,
            true,
        );
    };

    let results = props.queryResults.results
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

    const sortByDate = (resultA, resultB) => {
        if(resultA.props.children[0].props.children[1] === undefined)
            return 0;

        const dateA = new Date(
            resultA.props.children[0].props.children[1]
                .split('/').reverse().join('-')
        );

        const dateB = new Date(
            resultB.props.children[0].props.children[1]
                .split('/').reverse().join('-')
        );
        return dateB - dateA;
    };
    if (props.isConsultList) {
        results = (
            <Grid>
                {results.sort(sortByDate).map((result, idx) => {
                    return (
                    <Grid.Row key={ result.key } style = { {textAlign: 'left' } } columns="equal">
                        <Grid.Column>
                            <h3>{ results.length - idx }. {result.props.children[0].props.children}</h3>
                        </Grid.Column>
                        <Grid.Column>
                            <h4 style={ {'margin': '0'} }>{result.props.children[1].props.children}</h4>
                            <h4 style={ {'margin': '0'} }>{result.props.children[2].props.children}</h4>
                            <h4 style={ {'margin': '0'} }>{result.props.children[3].props.children}</h4>
                        </Grid.Column>
                        <Grid.Column>
                            <Button
                              onClick={ () => result.props.onClick() } 
                            >
                            Visualizar
                            </Button>
                        </Grid.Column>
                        <Grid.Column>

                        </Grid.Column>
                    </Grid.Row>);
                })}
            </Grid>
        );
    }

    const prevButton = (
        <Button
          onClick={ () => handleChangePage('previous') }
          icon
          floated='left'
          size={ props.buttonSize || 'medium' }
          disabled={ !props.hasPrevious }
        >
            <Icon name="angle double left" />
        </Button>
    );
    const nextButton = (
        <Button
          onClick={ () => handleChangePage('next') }
          disabled={ !props.hasNext }
          icon
          floated='right'
          size={ props.buttonSize || 'medium' }
        >
            <Icon name="angle double right" />
        </Button>
    );

    return (
        <>
      {results}
      {(props.queryResults.next || props.queryResults.previous) && (
          <>
          {prevButton}
          {nextButton}
          </>
      )}
        </>
    );
};

export default paginator;
