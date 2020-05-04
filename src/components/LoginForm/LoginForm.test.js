import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Form, Message } from 'semantic-ui-react';
import LoginForm from './LoginForm';

configure({ adapter: new Adapter() });

describe('<LoginForm />', () => {
    it('should display username and password', () => {
        const wrapper = shallow(
            <LoginForm
              username='username_teste'
              password='password_test'
              handleUsername={ () => { } }
              handlePassword={ () => { } }
              handleLogin={ () => { } }
              isLoading={ false }
              hasError={ false }
              errorMsg={ {
                  header: '',
                  content: '',
              } }
            />
        );

        const inputs = wrapper.find(Form.Input);

        expect(inputs.at(0).props().value).toBe('username_teste');
        expect(inputs.at(1).props().value).toBe('password_test');
    });

    it('should update username and password', () => {
        let username = '';
        let password = '';

        const wrapper = shallow(
            <LoginForm
              username='username_teste'
              password='password_test'
              handleUsername={ (newUsername) => { username = newUsername; } }
              handlePassword={ (newPassword) => { password = newPassword; } }
              handleLogin={ () => { } }
              isLoading={ false }
              hasError={ false }
              errorMsg={ {
                  header: '',
                  content: '',
              } }
            />
        );

        const inputs = wrapper.find(Form.Input);
        const usernameInput = inputs.at(0);
        const passwordInput = inputs.at(1);

        usernameInput.simulate('change', { target: { value: 'username_teste' } });
        passwordInput.simulate('change', { target: { value: 'password_test' } });

        expect(username).toBe('username_teste');
        expect(password).toBe('password_test');
    });

    it('should call handleLogin on submit', () => {
        let login = false;
        const wrapper = shallow(
            <LoginForm
              username=''
              password=''
              handleUsername={ () => { } }
              handlePassword={ () => { } }
              handleLogin={ () => { login = true; } }
              isLoading={ false }
              hasError={ false }
              errorMsg={ {
                  header: '',
                  content: '',
              } }
            />
        );

        const form = wrapper.find(Form);
        form.simulate('submit');

        expect(login).toBe(true);
    });

    it('should set loading', () => {
        const wrapper = shallow(
            <LoginForm
              username=''
              password=''
              handleUsername={ () => { } }
              handlePassword={ () => { } }
              handleLogin={ () => { } }
              isLoading={ true }
              hasError={ false }
              errorMsg={ {
                  header: '',
                  content: '',
              } }
            />
        );

        const form = wrapper.find(Form);
        expect(form.prop('loading')).toBe(true);
    });

    it('should handle erro', () => {
        const wrapper = shallow(
            <LoginForm
              username=''
              password=''
              handleUsername={ () => { } }
              handlePassword={ () => { } }
              handleLogin={ () => { } }
              isLoading={ false }
              hasError={ true }
              errorMsg={ {
                  header: 'error_header',
                  content: 'error_content',
              } }
            />
        );

        const form = wrapper.find(Form);
        expect(form.prop('error')).toBe(true);

        const message = wrapper.find(Message);
        expect(message.prop('header')).toBe('error_header');
        expect(message.prop('content')).toBe('error_content');
    });
});
