import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import FoodsModal from './FoodsModal';

configure({ adapter: new Adapter() });

describe('<FoodsModal />', () => {
    it('should close onEscape and onDimmerClick', () => {
        const wrapper = shallow(
            <FoodsModal 
              open={ true } 
              handleClose={ () => {} } 
            />
        );

        expect(wrapper.prop('closeOnEscape')).toBe(true);
        expect(wrapper.prop('closeOnDimmerClick')).toBe(true);
    });
});
