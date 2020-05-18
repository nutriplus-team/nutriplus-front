import React, { useRef, useEffect, useState } from 'react';

import { Form, Input } from 'semantic-ui-react';

const FoodSearchInput = (props) => {
    const [inputInfo, setInputInfo] = useState('');
    const [search, setSearch] = useState('');

    const searchRef = useRef();

    useEffect(() => {
        const timer = setTimeout(() => {
            const value = searchRef.current.inputRef.current.value;
            if (value !== search) {
                setSearch(value);
                props.handleSearch(value);
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [inputInfo]);

    return (
        <Form 
          size='big'
          onSubmit={ () => props.handleSearch(inputInfo) }
        >
            <Form.Field>
                <Input focus
                  ref={ searchRef }
                  disabled={ props.disabled }
                  icon="search"
                  iconPosition="left"
                  placeholder="Nome da comida"
                  onChange={ (event) => setInputInfo(event.target.value) }
                  value={ inputInfo }
                />
            </Form.Field>
        </Form>
    );
};

export default FoodSearchInput;
