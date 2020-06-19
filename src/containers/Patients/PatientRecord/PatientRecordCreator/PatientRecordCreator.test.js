import React from 'react';
jest.mock('react-router-dom', () => {
    return {
        Redirect: jest.fn().mockImplementation(() => <p id='redirectTestcfihb'>Redirect mock</p>)
    };
});

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {act} from 'react-dom/test-utils';

import PatientRecordCreator from './PatientRecordCreator';
import {
    Button,
    Form,
    Grid,
    Header,
    Segment,
    TextArea,
    Dropdown,
} from 'semantic-ui-react';

import * as httpHelper from '../../../../utility/httpHelper';

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
            'id': 5,
            'patient': 5,
            'is_athlete': false,
            'age': 34,
            'physical_activity_level': 1,
            'corporal_mass': 1,
            'height': 1,
            'BMI': 1,
            'observations': '1',
            'date_modified': '11/05/2020',
            'subscapular': 1,
            'triceps': 1,
            'chest': 1,
            'axillary': 1,
            'supriailiac': 1,
            'abdominal': 1,
            'thigh': 1,
            'calf': 1,
            'biceps': 1,
            'waist_circ': 1,
            'abdominal_circ': 1,
            'hips_circ': 1,
            'right_arm_circ': 1,
            'thigh_circ': 1,
            'calf_circ': 1,
            'muscular_mass': 6.17396907785606,
            'corporal_density': 1.08937795,
            'tinsley_athlete_non_fat': 0,
            'cunningham_athlete': 0,
            'energy_requirements': 0,
            'body_fat_pollok': 4.38775403889897,
            'body_fat_faulkner': 0,
            'total_weight_methabolic_rate': -312.04
        });
    }
};
const mockFun = jest.fn().mockImplementation((...args) => mock(args[0], args[1], args[3]));
httpHelper.sendAuthenticatedRequest = mockFun;

describe('<PatientRecordCreator />', () => {
    beforeEach(() => {
        mockFun.mockClear();
    });

    it('should render properly on create', async () => {
        const wrapper = mount(
            <PatientRecordCreator match={ { params: {id: 5} } }/>
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
        expect(wrapper.find(Form.Input).length).toBe(17);
        expect(wrapper.find(Form.Field).length).toBe(21);
        expect(wrapper.find(Dropdown).length).toBe(4);
        expect(wrapper.find(Button).length).toBe(1);
        expect(wrapper.find('#redirectTestcfihb').length).toBe(0);
        expect(wrapper.find(TextArea).length).toBe(1);
        expect(wrapper.find('h4').length).toBe(1);

        expect(mockFun.mock.calls[0]).toContain(`/patients/get-info/${5}/`);
        expect(mockFun.mock.calls[0]).toContain('get');
        for (let i = 0; i < 17; i++)
            expect(wrapper.find(Form.Input).at(i).props().value).toBe('');
        for (let i = 0; i < 4; i++)
            expect(wrapper.find(Dropdown).at(i).props().value).toBe('');
        expect(wrapper.find(TextArea).at(0).props().value).toBe('');
        expect(wrapper.find(Button).at(0).props().children).toBe('Adicionar ficha');
        expect(wrapper.find('h4').at(0).props().children[1]).toBe('Anna Amorim Leite');
    });

    it('should render properly on edit', async () => {
        const wrapper = mount(
            <PatientRecordCreator match={ { params: {id: 5, ficha_id: 6} } }/>
        );

        await act( async () => {
            await wrapper.update();
        });

        expect(mockFun).toHaveBeenCalledTimes(2);

        expect(wrapper.find(Grid).length).toBe(1);
        expect(wrapper.find(Grid.Column).length).toBe(1);
        expect(wrapper.find(Header).length).toBe(1);
        expect(wrapper.find(Form).length).toBe(1);
        expect(wrapper.find(Segment).length).toBe(1);
        expect(wrapper.find(Form.Input).length).toBe(17);
        expect(wrapper.find(Form.Field).length).toBe(21);
        expect(wrapper.find(Dropdown).length).toBe(4);
        expect(wrapper.find(Button).length).toBe(1);
        expect(wrapper.find('#redirectTestcfihb').length).toBe(0);
        expect(wrapper.find(TextArea).length).toBe(1);
        expect(wrapper.find('h4').length).toBe(1);

        expect(mockFun.mock.calls[0]).toContain(`/patients/get-info/${5}/`);
        expect(mockFun.mock.calls[0]).toContain('get');
        expect(mockFun.mock.calls[1]).toContain(`/patients/get-single-record/${6}/`);
        expect(mockFun.mock.calls[1]).toContain('get');
        for (let i = 0; i < 17; i++)
            expect(wrapper.find(Form.Input).at(i).props().value).toBe(1);
        expect(wrapper.find(Dropdown).at(0).props().value).toBe('Não atleta');
        expect(wrapper.find(Dropdown).at(1).props().value).toBe('Não faz atividade física');
        expect(wrapper.find(Dropdown).at(2).props().value).toBe('');
        expect(wrapper.find(Dropdown).at(3).props().value).toBe('');
        expect(wrapper.find(TextArea).at(0).props().value).toBe('1');
        expect(wrapper.find(Button).at(0).props().children).toBe('Editar ficha');
        expect(wrapper.find('h4').at(0).props().children[1]).toBe('Anna Amorim Leite');
    });

    it('should send information properly on create', async () => {
        const wrapper = mount(
            <PatientRecordCreator match={ { params: {id: 5} } }/>
        );

        await act( async () => {
            await wrapper.update();
        });

        for (let i = 0; i < 17; i++)
            act(() => {
                wrapper.find(Form.Input).at(i).props().onChange({target: {value: '1'}});
            });
        act(() => {
            wrapper.find(Dropdown).at(0).props().onChange('', {value: 'Atleta'});
        });
        act(() => {
            wrapper.find(Dropdown).at(1).props().onChange('', {value: 'Não faz atividade física'});
        });
        act(() => {
            wrapper.find(Dropdown).at(2).props().onChange('', {value: 'Pollok'});
        });
        act(() => {
            wrapper.find(Dropdown).at(3).props().onChange('', {value: 'Tinsley com peso total'});
        });
        act(() => {
            wrapper.find(TextArea).props().onChange({target: {value: '1'}});
        });
        act(() => {
            wrapper.find(Button).simulate('click');
        });
        expect(mockFun).toHaveBeenCalledTimes(2);
        expect(mockFun.mock.calls[1]).toContain(`/patients/add-record/${5}/`);
        expect(mockFun.mock.calls[1]).toContain('post');
        expect(mockFun.mock.calls[1]).toContain(JSON.stringify({
            corporal_mass: (1).toFixed(2),
            height: (1).toFixed(2),
            BMI: (1).toFixed(2),
            is_athlete: true,
            physical_activity_level: 1,
            methabolic_author: 'Pollok',
            energy_method: 1,
            subscapular: '1',
            triceps: '1',
            biceps: '1',
            chest: '1',
            supriailiac: '1',
            axillary: '1',
            abdominal: '1',
            thigh: '1',
            calf: '1',
            waist_circ: '1',
            abdominal_circ: '1',
            hips_circ: '1',
            right_arm_circ: '1',
            thigh_circ: '1',
            calf_circ: '1',
            observations: '1',
        }));

        await act( async () => {
            await wrapper.update();
        });

        expect(wrapper.find('#redirectTestcfihb').length).toBe(1);
    });

    it('should send information properly on edit', async () => {
        const wrapper = mount(
            <PatientRecordCreator match={ { params: {id: 5, ficha_id: 6} } }/>
        );

        await act( async () => {
            await wrapper.update();
        });

        for (let i = 0; i < 17; i++)
            act(() => {
                wrapper.find(Form.Input).at(i).props().onChange({target: {value: '2'}});
            });
        act(() => {
            wrapper.find(Dropdown).at(0).props().onChange('', {value: 'Atleta'});
        });
        act(() => {
            wrapper.find(Dropdown).at(1).props().onChange('', {value: 'Atividade física intensa'});
        });
        act(() => {
            wrapper.find(Dropdown).at(2).props().onChange('', {value: 'Pollok'});
        });
        act(() => {
            wrapper.find(Dropdown).at(3).props().onChange('', {value: 'Tinsley com peso total'});
        });
        act(() => {
            wrapper.find(TextArea).props().onChange({target: {value: '10'}});
        });
        act(() => {
            wrapper.find(Button).simulate('click');
        });
        expect(mockFun).toHaveBeenCalledTimes(3);
        expect(mockFun.mock.calls[2]).toContain(`/patients/edit-record/${6}/`);
        expect(mockFun.mock.calls[2]).toContain('post');
        expect(mockFun.mock.calls[2]).toContain(JSON.stringify({
            corporal_mass: (2).toFixed(2),
            height: (2).toFixed(2),
            BMI: (0.5).toFixed(2),
            is_athlete: true,
            physical_activity_level: 1.7,
            methabolic_author: 'Pollok',
            energy_method: 1,
            subscapular: '2',
            triceps: '2',
            biceps: '2',
            chest: '2',
            supriailiac: '2',
            axillary: '2',
            abdominal: '2',
            thigh: '2',
            calf: '2',
            waist_circ: '2',
            abdominal_circ: '2',
            hips_circ: '2',
            right_arm_circ: '2',
            thigh_circ: '2',
            calf_circ: '2',
            observations: '10',
        }));

        await act( async () => {
            await wrapper.update();
        });

        expect(wrapper.find('#redirectTestcfihb').length).toBe(1);
    });
});
