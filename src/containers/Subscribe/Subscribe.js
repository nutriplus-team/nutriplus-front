import React, { Component } from 'react';
import {
    Grid,
    Header,
    Message,
    Button,
    Form,
    Segment,
} from 'semantic-ui-react';
import { emailValidator } from '../../utility/validators';

class Subscribe extends Component {
  state = {
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      password2: '',
      loading: false,
      hasError: false,
      displayMessage: false,
      errorMsg: {
          header: '',
          content: '',
      },
  };

  handleName = (newName) => {
      this.setState({
          name: newName,
      });
  };

  handleSurname = (newSurname) => {
      this.setState({
          surname: newSurname,
      });
  };

  handleUsername = (newUsername) => {
      this.setState({
          username: newUsername,
      });
  };

  handleEmail = (newEmail) => {
      this.setState({
          email: newEmail,
      });
  };

  handlePassword = (newPassword) => {
      this.setState({
          password: newPassword,
      });
  };

  handlePassword2 = (newPassword2) => {
      this.setState({
          password2: newPassword2,
      });
  };

  register = async () => {
      const oldState = {
          ...this.state,
      };

      if (this.state.name.length === 0 || this.state.username.length === 0 || this.state.surname.length === 0 || 
        this.state.email.length === 0 || this.state.password.length === 0 || this.state.password2.length === 0){
          this.setState({
              displayMessage: true,
              hasError: true,
              errorMsg: {
                  header: 'Campos não preenchidos.',
                  content: 'Preencha todos os campos.',
              }
          });
          return;
      }

      if (this.state.password !== this.state.password2){
          this.setState({
              displayMessage: true,
              hasError: true,
              errorMsg: {
                  header: 'As senhas são são iguais!',
                  content: 'Escreva a mesma senha nos dois campos',
              }
          });
          return;
      }

      if (!emailValidator(this.state.email)) {
          this.setState({
              displayMessage: true,
              hasError: true,
              errorMsg: {
                  header: 'Email inválido.',
                  content: 'Digite um email válido.',
              }
          });
          return;
      }

      this.setState({ loading: true });

      const backUrl = process.env.REACT_APP_BACKEND_URL + '/user/register/';
      console.log(backUrl);
      console.log(JSON.stringify({
          username: oldState.username,
          password1: oldState.password,
          password2: oldState.password2,
          firstName: oldState.name,
          lastName: oldState.surname,
          email: oldState.email,
      }));
      const res = await fetch(backUrl, {
          method: 'post',
          body: JSON.stringify({
              username: oldState.username,
              password1: oldState.password,
              password2: oldState.password2,
              firstName: oldState.name,
              lastName: oldState.surname,
              email: oldState.email,
          }),
          headers: new Headers({ 'Content-Type': 'application/json' }),
      });
      console.log('res', res);
      const info = await res.json();
      console.log('info', info);
      if (res.status === 200) {
          this.setState({
              name: '',
              surname: '',
              username: '',
              email: '',
              password: '',
              password2: '',
              loading: false,
              hasError: false,
              displayMessage: true,
              errorMsg: {
                  header: 'Cadastro realizado.',
                  content: 'Complete o cadastro verificando o seu e-mail.',
              }
          });
      } else {
          if (info.message.substr(0, 8) === 'Password')
              this.setState({
                  loading: false,
                  hasError: true,
                  displayMessage: true,
                  errorMsg: {
                      header: 'Senha fraca.',
                      content: 'Use uma senha mais forte.',
                  },
              });
          else
              this.setState({
                  loading: false,
                  hasError: true,
                  displayMessage: true,
                  errorMsg: {
                      header: 'Erro ao se comunicar com o serviço.',
                      content: 'Por favor, tente mais tarde.',
                  },
              });
      }
  };

  render() {
      return (
      <Grid
        textAlign='center'
        style={ { height: '10vh' } }
        verticalAlign='middle'
      >
        <Grid.Column style={ { maxWidth: 450 } }>
          <Header as='h2' color='teal' textAlign='center'>
            Faça seu cadastro abaixo
          </Header>
          <Form
            size='large'
            onSubmit={ this.register }
            error={ this.state.displayMessage }
            loading={ this.state.loading }
          >
            <Segment stacked>
              <Message hidden={ !this.state.displayMessage } error={ this.state.hasError } header={ this.state.errorMsg.header } content={ this.state.errorMsg.content }/>

              <Form.Input
                fluid
                icon='address card'
                iconPosition='left'
                placeholder={ 'Nome' }
                value={ this.state.name }
                onChange={ (event) => this.handleName(event.target.value) }
              />

              <Form.Input
                fluid
                icon='address card'
                iconPosition='left'
                placeholder={ 'Sobrenome' }
                value={ this.state.surname }
                onChange={ (event) => this.handleSurname(event.target.value) }
              />

              <Form.Input
                fluid
                icon='user'
                iconPosition='left'
                placeholder={ 'Nome de usuário' }
                value={ this.state.username }
                onChange={ (event) => this.handleUsername(event.target.value) }
              />

              <Form.Input
                fluid
                icon='at'
                iconPosition='left'
                placeholder={ 'Email' }
                value={ this.state.email }
                onChange={ (event) => this.handleEmail(event.target.value) }
              />

              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                type='password'
                placeholder={ 'Senha' }
                value={ this.state.password }
                onChange={ (event) => this.handlePassword(event.target.value) }
              />

              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                type='password'
                placeholder={ 'Senha (digite novamente)' }
                value={ this.state.password2 }
                onChange={ (event) => this.handlePassword2(event.target.value) }
              />

              <Button
                type="button"
                size="medium"
                onClick={ () => this.props.history.push('/auth') }
              >
              Voltar
              </Button>
              <Button color='teal' size='medium'>
                Cadastrar
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
      );
  }
}

export default Subscribe;
