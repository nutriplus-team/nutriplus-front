import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import FoodsTableRow from './FoodsTableRow';

import { Table, Button } from 'semantic-ui-react';

configure({ adapter: new Adapter() });

const validFoodExample = {
    'id': 1,
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

describe('<FoodsTableRow />', () => {
    it('should render correctly with valid food', () => {
        const wrapper = shallow(
            <FoodsTableRow 
              food={ validFoodExample }
              handleClick={ () => {} }
              handleButton={ () => {} }
            />
        );

        expect(wrapper.find(Table.Cell)).toHaveLength(12);
        wrapper.find(Table.Cell).forEach((cell) => expect(cell).toHaveProperty('key'));

        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(Button).prop('icon')).toBe('remove');
    });

    it('should call handleClick', () => {
        const mock = jest.fn();

        const wrapper = shallow(
            <FoodsTableRow 
              food={ validFoodExample }
              handleClick={ () => mock() }
              handleButton={ () => {} }
            />
        );

        wrapper.simulate('doubleClick');
        expect(mock).toHaveBeenCalledTimes(1);
    });

    it('should call handleButton', () => {
        const mock = jest.fn();

        const wrapper = shallow(
            <FoodsTableRow 
              food={ validFoodExample }
              handleClick={ () => {} }
              handleButton={ () => mock() }
            />
        );

        wrapper.find(Button).simulate('click');
        expect(mock).toHaveBeenCalledTimes(1);
    });
});
