import React from 'react';

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import FoodsTable from './FoodsTable';
import FoodsTableRow from './FoodsTableRow/FoodsTableRow';

import { Button, Table } from 'semantic-ui-react';

import { Placeholder } from 'semantic-ui-react';

configure({ adapter: new Adapter() });

const validFood = {
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

const defaultArgs = {
    loaded: true,
    error: false,
    setError: () => {},
    foodInfo: { 
        results: [validFood]
    },
    setFoodInfo: () => {},
    hasPrevious: false,
    setHasPrevious: () => {},
    hasNext: true,
    setHasNext: () => {},
    handleAdd: () => {},
    handleClick: () => {},
    handleRemove: () => {}
};

describe('<FoodsTable />', () => {
    it('should render Placeholder if not loaded', () => {
        const args = {
            ...defaultArgs,
            loaded: false
        };

        const wrapper = mount(
            <FoodsTable 
              { ...args }
            />
        );

        expect(wrapper.find(Placeholder).length).toBeGreaterThan(1);
    });

    it('should render FoodsTableRow if loaded', () => {
        const wrapper = mount(
            <FoodsTable 
              { ...defaultArgs }
            />
        );

        expect(wrapper.find(FoodsTableRow).length).toBeGreaterThanOrEqual(1);
    });

    it('should pass on handleClick and handleButton', () => {
        const mock = jest.fn();

        const args = {
            ...defaultArgs,
            handleClick: (id, idx) => mock(id, idx),
            handleRemove: (id, idx) => mock(id, idx)
        };
        const wrapper = mount(
            <FoodsTable 
              { ...args }
            />
        );

        const row = wrapper.find(FoodsTableRow);

        row.prop('handleClick')();
        expect(mock).toHaveBeenCalledTimes(1);
        expect(mock).toHaveBeenCalledWith(1, 0);

        row.prop('handleButton')();
        expect(mock).toHaveBeenCalledTimes(2);
        expect(mock).toHaveBeenCalledWith(1, 0);
    });

    it('should render Header correctly', () => {
        const wrapper = mount(
            <FoodsTable 
              { ...defaultArgs }
            />
        );

        expect(wrapper.find(Table.HeaderCell).length).toBe(12);
        expect(wrapper.find(Table.Header).find(Button).length).toBe(1);
    });

    it('should call handleAdd', () => {
        const mock = jest.fn();

        const args = {
            ...defaultArgs,
            handleAdd: () => mock()
        };

        const wrapper = mount(
            <FoodsTable 
              { ...args }
            />
        );

        const btn = wrapper.find(Table.Header).find(Button);
        btn.simulate('click');

        expect(mock).toHaveBeenCalledTimes(1);
    });
});
