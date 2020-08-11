import React, { useState, useRef, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import {
    Button,
    Form,
    Grid,
    Header,
    Segment,
    Input,
    Dropdown,
} from 'semantic-ui-react';
import { sendAuthenticatedRequest } from '../../../utility/httpHelper';
import Paginator from '../../../utility/paginator';
import {
    dateFormatValidator,
    dateValidator,
    emailValidator,
    cpfValidator,
    cpfFormatValidator
} from '../../../utility/validators';
import classes from './Register.module.css';

const pageSize = 10;

const Register = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [cpf, setCpf] = useState('');
    const [sex, setSex] = useState('');
    const [ethnicity, setEthnicity] = useState('');
    const [restrictions, setRestrictions] = useState([]);
    const [restrictionQuery, setRestrictionQuery] = useState('');
    const [message, setMessage] = useState('');
    const [queryResults, setQueryResults] = useState(null);
    const [queryTotal, setQueryTotal] = useState(null);
    const [page, setPage] = useState(null);
    const [editing, setEditing] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const searchRef = useRef();

    const { params } = props.match;

    useEffect(() => {
        if (page != null && restrictionQuery !== '')
            sendAuthenticatedRequest(
                '/graphql/get/',
                'post',
                (message) => setMessage(message),
                (info) => {
                    setQueryResults(info);
                },
                `query {
                  searchFood(partialFoodName: "${restrictionQuery}", indexPage: ${page}, sizePage: ${pageSize}) {
                    uuid,
                    foodName
                  }
              }`
            );
    }, [restrictionQuery, page]);

    useEffect(() => {
        if (params.id) {
            setLoading(true);
            sendAuthenticatedRequest(
                '/graphql/get/',
                'post',
                (message) => setMessage(message),
                (info) => {
                    info = info.data.getPatientInfo;
                    setName(info.name);
                    setEmail(info.email);
                    setDob(info.dateOfBirth);
                    setCpf(info.cpf);
                    setSex(info.biologicalSex === 0 ? 'Feminino' : 'Masculino');
                    setEthnicity(
                        info.ethnicGroup === 0 ? 'Branco/Hispânico' : 'Afroamericano',
                    );
                    //setRestrictions(info.foodRestrictions); --> send another request for food restrictions
                },
                `{
                  getPatientInfo(uuidPatient: "${params.id}")
              {
                  name, email, dateOfBirth, biologicalSex, ethnicGroup, cpf
              }
              }`
            );
            sendAuthenticatedRequest(
                '/graphql/get/',
                'post',
                (message) => setMessage(message),
                (info) => {
                    setRestrictions(info.data.getFoodRestrictions);
                },
                `{
                  getFoodRestrictions(uuidPatient: "${params.id}")
              {
                  uuid, foodName
              }
              }`
            );
            setEditing(true);
        }
    }, [params]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (restrictionQuery === searchRef.current.inputRef.current.value) {
                if (restrictionQuery !== '') {
                    setLoading(true);
                    sendAuthenticatedRequest(
                        '/graphql/get/',
                        'post',
                        (message) => setMessage(message),
                        (info) => {
                            setQueryTotal(info.data['searchFood'].length);
                            setPage(0);
                        },
                        `query {
                          searchFood(partialFoodName: "${restrictionQuery}", indexPage: 0, sizePage: 1000000000) {
                              uuid
                          }
                      }`
                    );
                } else {
                    setQueryResults(null);
                }
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [restrictionQuery, searchRef]);

    const clearFields = () => {
        setName('');
        setEmail('');
        setCpf('');
        setDob('');
        setRestrictionQuery('');
        setQueryResults(null);
        setRestrictions([]);
    };

    const mapSex = (sex) => (sex === 'Feminino' ? 0 : 1);

    const mapEthnicity = (ethnicity) => (ethnicity === 'Branco/Hispânico' ? 0 : 1.1);

    const register = async () => {
        const dateValidatorResult = dateValidator(dob);
        if (dateValidatorResult !== 'Accepted') {
            setMessage(dateValidatorResult);
            return;
        }
        if (!cpfValidator(cpf)) {
            setMessage('CPF inválido!');
            return;
        }
        if (name.length === 0) {
            setMessage('Não há nome!');
            return;
        }
        if (email.length === 0) {
            setMessage('Não há email!');
            return;
        }
        if (!emailValidator(email)) {
            setMessage('Email inválido!');
            return;
        }
        if (sex.length === 0) {
            setMessage('O sexo não foi escolhido!');
            return;
        }
        if (ethnicity.length === 0) {
            setMessage('A etnia não foi escolhida!');
            return;
        }
        if (!editing) {
            setLoading(true);
            sendAuthenticatedRequest(
                '/graphql/get/',
                'post',
                (message) => setMessage(message),
                () => {
                    setMessage('Cadastro realizado com sucesso!');
                    setRedirectUrl('/pacientes');
                    setLoading(false);
                },
                `mutation{
                  createPatient(input: {
    name: "${name}",
    dateOfBirth: "${dob}",
    biologicalSex: ${mapSex(sex)},
    ethnicGroup: ${mapEthnicity(ethnicity)},
    nutritionist: "${localStorage.getItem('nutritionist_name')}",
    email: "${email}",
    cpf: "${cpf}",
    foodRestrictions: [${restrictions.map(res => `"${res.uuid}"`)}]
})
                }`,
            );
        } else {
            setLoading(true);
            sendAuthenticatedRequest(
                '/graphql/get/',
                'post',
                (message) => setMessage(message),
                () => {
                    setMessage('Paciente editado com sucesso!');
                    setRedirectUrl(`/pacientes/${params.id}`);
                    clearFields();
                },
                `mutation{
                  updatePatient(uuidPatient: "${params.id}", input: {
  name: "${name}",
  dateOfBirth: "${dob}",
  biologicalSex: ${mapSex(sex)},
  ethnicGroup: ${mapEthnicity(ethnicity)},
  email: "${email}",
  cpf: "${cpf}",
  foodRestrictions: [${restrictions.map(res => `"${res.uuid}"`)}]
})
              }`,
            );
        }
        
    };

    const handlefoodClick = (food) => {
        setRestrictions([...restrictions, food]);
        setRestrictionQuery('');
        setQueryResults(null);
    };

    const removeRestriction = (food) => {
        setRestrictions([...restrictions].filter((restrFood) => restrFood !== food));
    };

    const sexOptions = [
        {
            key: 'Masculino',
            text: 'Masculino',
            value: 'Masculino',
        },
        {
            key: 'Feminino',
            text: 'Feminino',
            value: 'Feminino',
        },
    ];

    const ethnicityOptions = [
        {
            key: 'Branco/Hispânico',
            text: 'Branco/Hispânico',
            value: 'Branco/Hispânico',
        },
        {
            key: 'Afroamericano',
            text: 'Afroamericano',
            value: 'Afroamericano',
        },
    ];

    return (
        <Grid textAlign="center" style={ { height: '10vh' } } verticalAlign="middle">
            <Grid.Column style={ { maxWidth: 450 } }>
                <Header as="h2" color="teal" textAlign="center">
          Insira as informações do paciente abaixo
                </Header>
                <Form size="large" loading={ loading }>
                    <Segment stacked>
                        <Form.Input
                          icon="id card outline"
                          iconPosition="left"
                          placeholder="Nome do paciente"
                          onChange={ (event) => {
                              setName(event.target.value);
                              setMessage('');
                          } }
                          value={ name }
                        />
                        <Form.Input
                          icon="envelope outline"
                          iconPosition="left"
                          placeholder="Email do paciente"
                          onChange={ (event) => {
                              setEmail(event.target.value);
                              setMessage('');
                          } }
                          value={ email }
                        />
                        <Form.Input
                          icon="calendar"
                          iconPosition="left"
                          placeholder="Data de nascimento (DD/MM/YYYY)"
                          value={ dob }
                          onChange={ (event) => {
                              const result = dateFormatValidator(
                                  event.target.value,
                                  event.target.value.length > dob.length,
                              );
                              if (result === 'accepted') {
                                  setDob(event.target.value);
                                  setMessage('');
                              } else if (result === 'insertSlash') {
                                  setDob(
                                      `${event.target.value.slice(0, -1)
                                      }/${
                                          event.target.value.slice(-1)}`,
                                  );
                              } /* else if (result === 'rejected') {

                              } */
                          } }
                        />
                        <Form.Input
                          icon="id badge outline"
                          iconPosition="left"
                          placeholder="CPF do paciente (XXX.XXX.XXX-XX)"
                          value={ cpf }
                          onChange={ (event) => {
                              const result = cpfFormatValidator(
                                  event.target.value,
                                  event.target.value.length > cpf.length,
                              );
                              if (result === 'accepted') {
                                  setCpf(event.target.value);
                                  setMessage('');
                              } else if (result === 'insertDot') {
                                  setCpf(
                                      `${event.target.value.slice(0, -1)
                                      }.${
                                          event.target.value.slice(-1)}`,
                                  );
                              } else if (result === 'insertHyphen') {
                                  setCpf(
                                      `${event.target.value.slice(0, -1)
                                      }-${
                                          event.target.value.slice(-1)}`,
                                  );
                              } /* else if (result === 'rejected') {

                              } */
                          } }
                        />
                        <Form.Field>
                            <Dropdown
                              placeholder="Sexo"
                              selection
                              value={ sex }
                              onChange={ (event, data) => {
                                  setSex(data.value);
                              } }
                              options={ sexOptions }
                            />
                        </Form.Field>
                        <Form.Field>
                            <Dropdown
                              placeholder="Etnia"
                              selection
                              value={ ethnicity }
                              onChange={ (event, data) => {
                                  setEthnicity(data.value);
                              } }
                              options={ ethnicityOptions }
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input
                              ref={ searchRef }
                              icon="search"
                              iconPosition="left"
                              placeholder="Restrições alimentares (opcional)"
                              onChange={ async (event) => {
                                  setRestrictionQuery(event.target.value);
                                  setMessage('');
                              } }
                              value={ restrictionQuery }
                            />
                        </Form.Field>
                        {restrictions.length === 0 ? null : (
                            <ul>
                                {restrictions.map((food) => (
                                    <li
                                      className={ classes.Food }
                                      key={ food.uuid }
                                      onClick={ () => removeRestriction(food) }
                                    >
                                        {food.foodName}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {queryResults && (
                            <>
                <hr />
                <Paginator
                  queryResults={ queryResults }
                  totalLength={ queryTotal }
                  pageSize={ pageSize }
                  page={ page }
                  changePage={ (pageNumber) => setPage(pageNumber) }
                  queryString={ 'searchFood' }
                  filter={ (food) => !restrictions.some(
                      (state_food) => state_food.foodName === food.foodName,
                  ) }
                  listElementMap={ (obj) => (
                        <p
                          key={ obj.uuid }
                          className={ classes.Food }
                          onClick={ () => handlefoodClick(obj) }
                        >
                            {obj.foodName}
                        </p>
                  ) }
                  setMessage={ setMessage }
                  buttonSize="mini"
                />
                            </>
                        )}
                        <Button
                          type="button"
                          size="medium"
                          onClick={ () => props.history.push(`/pacientes/${props.match.params.id === undefined ? '' : props.match.params.id }`) }
                        >
                        Voltar
                        </Button>
                        <Button color="teal" onClick={ register }>
                            {editing ? 'Editar paciente' : 'Registrar paciente'}
                        </Button>
                        <p>{message}</p>
                    </Segment>
                </Form>
            </Grid.Column>
            {redirectUrl && <Redirect to={ `${redirectUrl}?refresh=true` } />}
        </Grid>
    );
};

export default Register;
