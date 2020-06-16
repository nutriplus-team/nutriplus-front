import React from 'react';

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {act} from 'react-dom/test-utils';

import Foods from './Foods';
import FoodsModal from '../../components/FoodsModal/FoodsModal';
import FoodsTable from '../../components/FoodsTable/FoodsTable';
import FoodsSearchInput from './FoodsSearchInput/FoodsSearchInput';

import * as httpHelper from '../../utility/httpHelper';

configure({ adapter: new Adapter() });

const validInitialFoods = [
    {
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
    }
];

describe('<Foods />', () => {
    it('should render properly', () => {
        const mock = (func) => {
            func({
                count: 1,
                next: 'SOME_URL/page=2',
                previous: null,
                results: validInitialFoods}); 
        };
        const mockFun = jest.fn().mockImplementation((...args) => mock(args[3]));
        httpHelper.sendAuthenticatedRequest = mockFun;

        const wrapper = mount(
            <Foods />
        );

        act(() => {
            wrapper.update();
        });

        expect(mockFun).toHaveBeenCalledTimes(1);

        expect(wrapper.find(FoodsModal).prop('open')).toBe(false);

        expect(wrapper.find(FoodsSearchInput).prop('foodName')).toBe('');

        expect(wrapper.find(FoodsTable).prop('loaded')).toBe(true);
        expect(wrapper.find(FoodsTable).prop('error')).toBe(null);
        expect(wrapper.find(FoodsTable).prop('hasNext')).toBe(true);
    });
});
