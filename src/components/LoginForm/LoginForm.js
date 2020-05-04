import React from 'react';

import { Button, Form, Segment, Message } from 'semantic-ui-react';

const loginForm = (props) => {
    return (
    <Form
      size='large'
      onSubmit={ () => props.handleLogin() }
      error={ props.hasError }
      loading={ props.isLoading }
    >
      <Segment stacked>
        <Message error header={ props.errorMsg.header } content={ props.errorMsg.content }/>

        <Form.Input
          fluid
          icon='user'
          iconPosition='left'
          placeholder={ 'Nome de usuário' }
          value={ props.username }
          onChange={ (event) => props.handleUsername(event.target.value) }
        />

        <Form.Input
          fluid
          icon='lock'
          iconPosition='left'
          type='password'
          placeholder={ 'Senha' }
          value={ props.password }
          onChange={ (event) => props.handlePassword(event.target.value) }
        />

        <Button color='teal' fluid size='large'>
          Login
        </Button>
      </Segment>
    </Form>
    );
};

export default loginForm;
