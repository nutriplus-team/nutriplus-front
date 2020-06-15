import React from 'react';

import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Form, Checkbox, Button } from 'semantic-ui-react';
import FoodsForm from './FoodsForm';

configure({ adapter: new Adapter() });

const validFood = {
    'food_name': 'test_name',
    'food_group': 'test_group',
    'measure_total_grams': 555,
    'measure_type': 'test_measure_type',
    'measure_amount': 555,
    'nutrition_facts': {
        'calories': 5,
        'proteins': 5,
        'carbohydrates': 5,
        'lipids': 5,
        'fiber': 5,               
    },
    'meal_set': [1, 2, 3, 4, 5, 6]
};

describe('<FoodsForm />', () => {
    it('should display food info', () => {
        const food = validFood;
        const wrapper = shallow(
            <FoodsForm
              food={ food }
              afterSubmit={ () => {} }
              afterCancel={ () => {} }
            />
        );

        const inputs = wrapper.find(Form.Input);

        expect(inputs.at(0).props().value).toBe('test_name');
        expect(inputs.at(1).props().value).toBe('test_group');
        expect(inputs.at(2).props().value).toBe(555);
        expect(inputs.at(3).props().value).toBe('test_measure_type');
        expect(inputs.at(4).props().value).toBe(555);
        expect(inputs.at(5).props().value).toBe(5);
        expect(inputs.at(6).props().value).toBe(5);
        expect(inputs.at(7).props().value).toBe(5);
        expect(inputs.at(8).props().value).toBe(5);
        expect(inputs.at(9).props().value).toBe(5);

        const checkboxes = wrapper.find(Checkbox);

        for (let i = 0; i < 6; i++)
            expect(checkboxes.at(i).props().checked).toBe(true);
    });

    it('should not throw error if no food is passed', () => {
        expect(() => shallow(
            <FoodsForm
              afterSubmit={ () => {} }
              afterCancel={ () => {} }
            />
        )).not.toThrow();
    });
    
    it('should render properly if no food is passed', () => {
        const wrapper = shallow(
            <FoodsForm
              afterSubmit={ () => {} }
              afterCancel={ () => {} }
            />
        );

        const inputs = wrapper.find(Form.Input);

        expect(inputs.at(0).props().value).toBe('');
        expect(inputs.at(1).props().value).toBe('');
        expect(inputs.at(2).props().value).toBe(0);
        expect(inputs.at(3).props().value).toBe('');
        expect(inputs.at(4).props().value).toBe(0);
        expect(inputs.at(5).props().value).toBe(0);
        expect(inputs.at(6).props().value).toBe(0);
        expect(inputs.at(7).props().value).toBe(0);
        expect(inputs.at(8).props().value).toBe(0);
        expect(inputs.at(9).props().value).toBe(0);

        const checkboxes = wrapper.find(Checkbox);

        for (let i = 0; i < 6; i++)
            expect(checkboxes.at(i).props().checked).toBe(false);
    });

    it('should check for numbers in Total Grams', () => {
        let invalid = validFood;

        invalid['measure_total_grams'] = 'test';
        const wrapper = mount(
            <FoodsForm
              food={ invalid }
              afterSubmit={ () => {} }
              afterCancel={ () => {} }
            />
        );
        const form = wrapper.find(Form);
        expect(form.prop('error')).toBe(true);
    });

    it('should check for numbers in Measure Amount', () => {
        const invalid = {...validFood};

        invalid['measure_amount'] = 'test';
        const wrapper = mount(
            <FoodsForm
              food={ invalid }
              afterSubmit={ () => {} }
              afterCancel={ () => {} }
            />
        );
        const form = wrapper.find(Form);
        expect(form.prop('error')).toBe(true);
    });

    it('should check for numbers in Nutrition Facts', () => {
        Object.keys(validFood).map((key) => {
            const invalid = {...validFood};
            invalid['nutrition_facts'][key] = 'test';

            const wrapper = mount(
                <FoodsForm
                  food={ invalid }
                  afterSubmit={ () => {} }
                  afterCancel={ () => {} }
                />
            );
            const form = wrapper.find(Form);
            expect(form.prop('error')).toBe(true);
        });
    });

    it('should call afterCancel when cancel button is pressed', () => {
        const mock = jest.fn();

        const wrapper = shallow(
            <FoodsForm
              afterSubmit={ () => {} }
              afterCancel={ () => mock() }
            />
        );

        const btn = wrapper.find(Button).at(1);
        btn.simulate('click');

        expect(mock).toHaveBeenCalled();
    });
});
