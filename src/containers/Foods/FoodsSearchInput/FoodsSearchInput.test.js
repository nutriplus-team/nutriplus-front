import React from 'react';

import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {act} from 'react-dom/test-utils';

import FoodsSearchInput from './FoodsSearchInput';

import { Input } from 'semantic-ui-react';

configure({ adapter: new Adapter() });

describe('<FoodsSearchInput />', () => {
    beforeAll(() => jest.useFakeTimers());
    afterAll(() => jest.useRealTimers());

    it('should not call handleSearch when empty initialized', () => {
        const mock = jest.fn();

        shallow(
            <FoodsSearchInput
              disabled={ false } 
              foodName={ '' } 
              handleSearch={ () => mock() }
            />
        );

        expect(mock).not.toHaveBeenCalled();
    });

    it('should not call handleSearch when non-empty initialized', () => {
        const mock = jest.fn();

        shallow(
            <FoodsSearchInput
              disabled={ false } 
              foodName={ 'test' } 
              handleSearch={ () => mock() }
            />
        );

        expect(mock).not.toHaveBeenCalled();
    });

    it('should call handleSearch when modified', () => {
        const mock = jest.fn();
        
        const wrapper = mount(
            <FoodsSearchInput
              disabled={ false } 
              foodName={ 'original' } 
              handleSearch={ (name) => mock(name) }
            />
        );

        // Same input => nothing should happen
        jest.useFakeTimers();
        act(() => {
            wrapper.find(Input).props().onChange({target: {value: 'original'}});
        });
        expect(setTimeout).not.toHaveBeenCalled();

        act(() => {
            wrapper.update();
        });
        expect(wrapper.find(Input).props().value).toBe('original');

        // Different input => things should happen
        jest.useFakeTimers();
        act(() => {
            wrapper.find(Input).props().onChange({target: {value: 'other'}});
        });
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);

        act(() => {
            wrapper.update();
        });
        expect(wrapper.find(Input).props().value).toBe('other');

        act(() => {
            jest.runAllTimers();
        });
        expect(mock).toHaveBeenCalledTimes(1);
        expect(mock).toHaveBeenCalledWith('other');
    });
});
