import React from 'react';
jest.mock('react-router-dom', () => {
    return {
        Redirect: jest.fn().mockImplementation(() => <p id='redirectTestcfihb'>Redirect mock</p>)
    };
});

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {act} from 'react-dom/test-utils';

import Register from './Register';
import Paginator from '../../../utility/paginator';
import {
    Button,
    Form,
    Grid,
    Header,
    Segment,
    Input,
    Dropdown,
    Table,
} from 'semantic-ui-react';

import * as httpHelper from '../../../utility/httpHelper';

configure({ adapter: new Adapter() });

const mock = (url, type, func) => {
    if (type == 'post'){
        func();
        return;
    }
    if (url.substr(0, 19) == '/patients/get-info/'){
        func({
            'id': 5,
            'name': 'Anna Amorim Leite',
            'date_of_birth': '14/11/1986',
            'food_restrictions': [],
            'biological_sex': 0,
            'ethnic_group': 0
        });
    }
    else{
        func({
            'count': 99,
            'next': 'URL/foods/search/a/?page=2',
            'previous': null,
            'results': [
                {
                    'id': 135,
                    'food_name': 'Abacate',
                    'food_group': 'Frutas',
                    'measure_total_grams': 100,
                    'measure_type': 'Colher de sopa',
                    'measure_amount': 4,
                    'nutrition_facts': {
                        'calories': 99,
                        'proteins': 1.2,
                        'carbohydrates': 6,
                        'lipids': 8.4,
                        'fiber': 6.3
                    },
                    'meal_set': [
                        1,
                        2,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': 3,
                    'food_name': 'Abóbora Cabotiá',
                    'food_group': 'Tubérculos e derivados',
                    'measure_total_grams': 100,
                    'measure_type': 'Colher de sopa',
                    'measure_amount': 4,
                    'nutrition_facts': {
                        'calories': 49,
                        'proteins': 1.4,
                        'carbohydrates': 10.8,
                        'lipids': 0.7,
                        'fiber': 2.5
                    },
                    'meal_set': [
                        6,
                        3
                    ]
                },
                {
                    'id': 2,
                    'food_name': 'Abobrinha',
                    'food_group': 'Verduras e Legumes',
                    'measure_total_grams': 100,
                    'measure_type': 'Colher de servir',
                    'measure_amount': 1,
                    'nutrition_facts': {
                        'calories': 15,
                        'proteins': 1.1,
                        'carbohydrates': 3,
                        'lipids': 0.2,
                        'fiber': 1.6
                    },
                    'meal_set': [
                        6,
                        3
                    ]
                },
                {
                    'id': 5,
                    'food_name': 'Açúcar',
                    'food_group': 'Açúcar',
                    'measure_total_grams': 100,
                    'measure_type': 'Colher de sopa',
                    'measure_amount': 7,
                    'nutrition_facts': {
                        'calories': 406,
                        'proteins': 0,
                        'carbohydrates': 104,
                        'lipids': 0,
                        'fiber': 0
                    },
                    'meal_set': []
                },
                {
                    'id': 6,
                    'food_name': 'Açúcar de coco',
                    'food_group': 'Açúcar',
                    'measure_total_grams': 100,
                    'measure_type': 'Colher de chá',
                    'measure_amount': 20,
                    'nutrition_facts': {
                        'calories': 373,
                        'proteins': 0,
                        'carbohydrates': 105,
                        'lipids': 0,
                        'fiber': 0
                    },
                    'meal_set': []
                },
                {
                    'id': 7,
                    'food_name': 'Açúcar demerara',
                    'food_group': 'Açúcar',
                    'measure_total_grams': 100,
                    'measure_type': 'Colher de chá',
                    'measure_amount': 20,
                    'nutrition_facts': {
                        'calories': 400,
                        'proteins': 0,
                        'carbohydrates': 100,
                        'lipids': 0,
                        'fiber': 0
                    },
                    'meal_set': []
                },
                {
                    'id': 8,
                    'food_name': 'Açúcar mascavo',
                    'food_group': 'Açúcar',
                    'measure_total_grams': 100,
                    'measure_type': 'Colher de chá',
                    'measure_amount': 20,
                    'nutrition_facts': {
                        'calories': 400,
                        'proteins': 0,
                        'carbohydrates': 100,
                        'lipids': 0,
                        'fiber': 0
                    },
                    'meal_set': []
                },
                {
                    'id': 9,
                    'food_name': 'Água de coco',
                    'food_group': 'Frutas',
                    'measure_total_grams': 100,
                    'measure_type': '200mL',
                    'measure_amount': 1,
                    'nutrition_facts': {
                        'calories': 41,
                        'proteins': 0,
                        'carbohydrates': 10,
                        'lipids': 0,
                        'fiber': 1
                    },
                    'meal_set': [
                        1,
                        2,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': 12,
                    'food_name': 'Ameixa',
                    'food_group': 'Frutas',
                    'measure_total_grams': 100,
                    'measure_type': 'Unidade',
                    'measure_amount': 1,
                    'nutrition_facts': {
                        'calories': 53,
                        'proteins': 0.8,
                        'carbohydrates': 13.9,
                        'lipids': 0,
                        'fiber': 2.4
                    },
                    'meal_set': [
                        1,
                        2,
                        4,
                        5
                    ]
                },
                {
                    'id': 16,
                    'food_name': 'Arroz Branco',
                    'food_group': 'Cereais, pães e massas',
                    'measure_total_grams': 100,
                    'measure_type': 'Colher de sopa',
                    'measure_amount': 5,
                    'nutrition_facts': {
                        'calories': 128,
                        'proteins': 2.5,
                        'carbohydrates': 28.1,
                        'lipids': 0.2,
                        'fiber': 0
                    },
                    'meal_set': [
                        6,
                        3
                    ]
                }
            ]
        });
    }
};
const mockFun = jest.fn().mockImplementation((...args) => mock(args[0], args[1], args[3]));
httpHelper.sendAuthenticatedRequest = mockFun;

describe('<Register />', () => {
    beforeEach(() => {
        mockFun.mockClear();
    });

    it('should render properly on register', async () => {
        const wrapper = mount(
            <Register match={ { params: {} } } history={ [] }/>
        );

        await act( async () => {
            await wrapper.update();
        });

        expect(mockFun).toHaveBeenCalledTimes(0);

        expect(wrapper.find(Grid).length).toBe(1);
        expect(wrapper.find(Grid.Column).length).toBe(1);
        expect(wrapper.find(Header).length).toBe(1);
        expect(wrapper.find(Form).length).toBe(1);
        expect(wrapper.find(Segment).length).toBe(1);
        expect(wrapper.find(Form.Input).length).toBe(2);
        expect(wrapper.find(Form.Field).length).toBe(5);
        expect(wrapper.find(Input).length).toBe(3);
        expect(wrapper.find(Dropdown).length).toBe(2);
        expect(wrapper.find(Button).length).toBe(2);
        expect(wrapper.find('ul').length).toBe(0);
        expect(wrapper.find('#redirectTestcfihb').length).toBe(0);
        expect(wrapper.find(Table).length).toBe(0);

        for (let i = 0; i < 2; i++)
            expect(wrapper.find(Form.Input).at(i).props().value).toBe('');
        for (let i = 0; i < 2; i++)
            expect(wrapper.find(Dropdown).at(i).props().value).toBe('');
        expect(wrapper.find(Input).at(2).props().value).toBe('');
        expect(wrapper.find(Button).at(0).props().children).toBe('Voltar');
        expect(wrapper.find(Button).at(1).props().children).toBe('Registrar paciente');
    });

    it('should render properly on edit', async () => {
        const wrapper = mount(
            <Register match={ { params: {id: 5} } } history={ [] }/>
        );

        await act( async () => {
            await wrapper.update();
        });

        expect(mockFun).toHaveBeenCalledTimes(1);

        expect(wrapper.find(Grid).length).toBe(1);
        expect(wrapper.find(Grid.Column).length).toBe(1);
        expect(wrapper.find(Header).length).toBe(1);
        expect(wrapper.find(Form).length).toBe(1);
        expect(wrapper.find(Segment).length).toBe(1);
        expect(wrapper.find(Form.Input).length).toBe(2);
        expect(wrapper.find(Form.Field).length).toBe(5);
        expect(wrapper.find(Input).length).toBe(3);
        expect(wrapper.find(Dropdown).length).toBe(2);
        expect(wrapper.find(Button).length).toBe(2);
        expect(wrapper.find('ul').length).toBe(0);
        expect(wrapper.find('#redirectTestcfihb').length).toBe(0);
        expect(wrapper.find(Table).length).toBe(0);

        expect(mockFun.mock.calls[0]).toContain(`/patients/get-info/${5}/`);
        expect(mockFun.mock.calls[0]).toContain('get');
        expect(wrapper.find(Form.Input).at(0).props().value).toBe('Anna Amorim Leite');
        expect(wrapper.find(Form.Input).at(1).props().value).toBe('14/11/1986');
        expect(wrapper.find(Dropdown).at(0).props().value).toBe('Feminino');
        expect(wrapper.find(Dropdown).at(1).props().value).toBe('Branco/Hispânico');
        expect(wrapper.find(Input).at(2).props().value).toBe('');
        expect(wrapper.find(Button).at(0).props().children).toBe('Voltar');
        expect(wrapper.find(Button).at(1).props().children).toBe('Editar paciente');
    });

    it('should search food correctly', async () => {
        const wrapper = mount(
            <Register match={ { params: {} } } history={ [] }/>
        );

        await act( async () => {
            await wrapper.update();
        });

        jest.useFakeTimers();
        act(() => {
            wrapper.find(Input).at(2).props().onChange({target: {value: 'a'}});
        });
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);
        act(() => {
            wrapper.update();
        });
        expect(wrapper.find(Input).at(2).props().value).toBe('a');
        act(() => {
            jest.runAllTimers();
        });
        expect(mockFun).toHaveBeenCalledTimes(1);
        expect(mockFun.mock.calls[0]).toContain('/foods/search/a/');
        expect(mockFun.mock.calls[0]).toContain('get');

        act(() => {
            wrapper.update();
        });
        
        expect(wrapper.find(Paginator).prop('hasNext')).toBe(true);
        expect(wrapper.find(Table).length).toBe(1);
        expect(wrapper.find(Table.Row).length).toBe(10);
        wrapper.find(Table.Row).forEach((row) => expect(row).toHaveProperty('key'));
        expect(wrapper.find(Table.Cell).length).toBe(10);
        expect(wrapper.find(Table.Cell).at(0).children().children().text()).toBe('Abacate');
        expect(wrapper.find(Table.Cell).at(1).children().children().text()).toBe('Abóbora Cabotiá');
        expect(wrapper.find(Table.Cell).at(2).children().children().text()).toBe('Abobrinha');
        expect(wrapper.find(Table.Cell).at(3).children().children().text()).toBe('Açúcar');
        expect(wrapper.find(Table.Cell).at(4).children().children().text()).toBe('Açúcar de coco');
        expect(wrapper.find(Table.Cell).at(5).children().children().text()).toBe('Açúcar demerara');
        expect(wrapper.find(Table.Cell).at(6).children().children().text()).toBe('Açúcar mascavo');
        expect(wrapper.find(Table.Cell).at(7).children().children().text()).toBe('Água de coco');
        expect(wrapper.find(Table.Cell).at(8).children().children().text()).toBe('Ameixa');
        expect(wrapper.find(Table.Cell).at(9).children().children().text()).toBe('Arroz Branco');
        
        act(() => {
            wrapper.find(Table.Cell).at(9).children().children().simulate('click');
        });

        await act(async () => {
            await wrapper.update();
        });

        expect(wrapper.find(Input).at(2).props().value).toBe('');
        expect(wrapper.find(Table).length).toBe(0);
        expect(wrapper.find('ul').length).toBe(1);
        expect(wrapper.find('ul').children.length).toBe(1);
        expect(wrapper.find('ul').children()).toHaveProperty('key');

        act(() => {
            wrapper.find('ul').children().simulate('click');
        });

        await act(async () => {
            wrapper.update();
        });
        
        expect(wrapper.find('ul').length).toBe(0);
    });

    it('should send information properly on register', async () => {
        const wrapper = mount(
            <Register match={ { params: {} } } history={ [] }/>
        );

        await act( async () => {
            await wrapper.update();
        });

        act(() => {
            wrapper.find(Form.Input).at(0).props().onChange({target: {value: 'Anna Amorim Café'}});
        });
        act(() => {
            wrapper.find(Form.Input).at(1).props().onChange({target: {value: '14/11/1999'}});
        });
        act(() => {
            wrapper.find(Dropdown).at(0).props().onChange('', {value: 'Feminino'});
        });
        act(() => {
            wrapper.find(Dropdown).at(1).props().onChange('', {value: 'Afroamericano'});
        });
        act(() => {
            wrapper.find(Button).at(1).simulate('click');
        });
        expect(mockFun).toHaveBeenCalledTimes(1);
        expect(mockFun.mock.calls[0]).toContain('/patients/add-new/');
        expect(mockFun.mock.calls[0]).toContain('post');
        expect(mockFun.mock.calls[0]).toContain(JSON.stringify({
            patient: 'Anna Amorim Café',
            date_of_birth: '14/11/1999',
            biological_sex: 0,
            ethnic_group: 1.1,
            food_restrictions: [].reduce(
                (total, actual, index, arr) => total + actual.id + (index === arr.length - 1 ? '' : '&'),
                '',
            ),
        }));

        await act( async () => {
            await wrapper.update();
        });

        expect(wrapper.find('#redirectTestcfihb').length).toBe(1);
    });

    it('should send information properly on edit', async () => {
        const wrapper = mount(
            <Register match={ { params: {id: 5} } } history={ [] }/>
        );

        await act( async () => {
            await wrapper.update();
        });

        act(() => {
            wrapper.find(Form.Input).at(0).props().onChange({target: {value: 'Anna Amorim Café'}});
        });
        act(() => {
            wrapper.find(Form.Input).at(1).props().onChange({target: {value: '14/11/1997'}});
        });
        act(() => {
            wrapper.find(Dropdown).at(0).props().onChange('', {value: 'Feminino'});
        });
        act(() => {
            wrapper.find(Dropdown).at(1).props().onChange('', {value: 'Afroamericano'});
        });
        act(() => {
            wrapper.find(Button).at(1).simulate('click');
        });
        expect(mockFun).toHaveBeenCalledTimes(2);
        expect(mockFun.mock.calls[1]).toContain(`/patients/edit/${5}/`);
        expect(mockFun.mock.calls[1]).toContain('post');
        expect(mockFun.mock.calls[1]).toContain(JSON.stringify({
            patient: 'Anna Amorim Café',
            date_of_birth: '14/11/1997',
            biological_sex: 0,
            ethnic_group: 1.1,
            food_restrictions: [].reduce(
                (total, actual, index, arr) => total + actual.id + (index === arr.length - 1 ? '' : '&'),
                '',
            ),
        }));

        await act( async () => {
            await wrapper.update();
        });

        expect(wrapper.find('#redirectTestcfihb').length).toBe(1);
    });
});
