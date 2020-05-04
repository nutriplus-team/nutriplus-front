import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Grid,
    Header,
    Message,
} from 'semantic-ui-react';

import LoginForm from '../../components/LoginForm/LoginForm';

class Login extends Component {
  state = {
      username: '',
      password: '',
      loading: false,
      hasError: false,
      errorMsg: {
          header: '',
          content: '',
      },
  };

  handleUsername = (newUsername) => {
      this.setState({
          username: newUsername,
      });
  };

  handlePassword = (newPassword) => {
      this.setState({
          password: newPassword,
      });
  };

  login = async () => {
      const oldState = {
          ...this.state,
      };
      this.setState({ loading: true });

      const backUrl = process.env.REACT_APP_BACKEND_URL + '/user/login/';
      const res = await fetch(backUrl, {
          method: 'post',
          body: JSON.stringify({
              username: oldState.username,
              password: oldState.password,
          }),
          headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      const answ = await res;
      const info = await answ.json();
      if (answ.status === 200) {
          this.setState({ loading: false });

          this.props.updateLogin();

          localStorage.setItem('stored_token', info.token);
          localStorage.setItem('stored_refresh', info.refresh);
          localStorage.setItem('stored_auth', 1);
      } else if (answ.status === 400) {
          this.setState({
              loading: false,
              hasError: true,
              errorMsg: {
                  header: 'Usuário ou senha incorretos.',
                  content: 'Por favor, insira as informação corretas.',
              },
          });
      } else {
          this.setState({
              loading: false,
              hasError: true,
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
            Faça seu login abaixo
          </Header>
          <LoginForm
            username={ this.state.username }
            password={ this.state.password }
            handleUsername={ this.handleUsername }
            handlePassword={ this.handlePassword }
            handleLogin={ this.login }
            isLoading={ this.state.loading }
            hasError={ this.state.hasError }
            errorMsg={ this.state.errorMsg }
          />
          <Message>
            Acabou de chegar? <NavLink to='/subscription'>Inscreva-se!</NavLink>
          </Message>
        </Grid.Column>
      </Grid>
      );
  }
}

export default Login;
