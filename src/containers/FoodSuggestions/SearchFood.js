import React, { useState, useRef, useEffect } from 'react';
import { Form, Input } from 'semantic-ui-react';
import { sendAuthenticatedRequest } from '../../utility/httpHelper';
import Paginator from '../../utility/paginator';

const pageSize = 10;

const SearchFood = (props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [queryTotal, setQueryTotal] = useState('');
    const [queryResults, setQueryResults] = useState(null);
    const [page, setPage] = useState(null);
    const searchRef = useRef();

    useEffect(() => {
        if (page != null && searchQuery !== '')
            sendAuthenticatedRequest(
                '/graphql/get/',
                'post',
                () => {},
                (info) => {
                    setQueryResults(info);
                },
                `query {
                  searchFood(partialFoodName: "${searchQuery}", indexPage: ${page}, sizePage: ${pageSize}) {
                    uuid,
                    foodName,
                    measureType,
                    measureAmount,
                    nutritionFacts {
                      calories,
                      proteins,
                      carbohydrates,
                      lipids,
                      fiber
                    }
                  }
              }`
            );
    }, [searchQuery, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery === searchRef.current.inputRef.current.value) {
                if (searchQuery !== '') {
                    sendAuthenticatedRequest(
                        '/graphql/get/',
                        'post',
                        () => {},
                        (info) => {
                            setQueryTotal(info.data['searchFood'].length);
                            setPage(0);
                        },
                        `query {
                          searchFood(partialFoodName: "${searchQuery}", indexPage: 0, sizePage: 1000000000) {
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
    }, [searchQuery, searchRef]);

    return (
        <div>
            <Form.Field>
                <Input
                  ref={ searchRef }
                  icon="search"
                  iconPosition="left"
                  placeholder="Comidas a inserir"
                  onChange={ async (event) => {
                      setSearchQuery(event.target.value);
                  } }
                  value={ searchQuery }
                />
            </Form.Field>
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
            filter={ () => true }
            listElementMap={ (obj) => (
              <p
                style={ { cursor: 'pointer' } }
                key={ obj.uuid }
                onClick={ () => props.handlefoodClick(
                    obj,
                    props.meal,
                    setQueryResults,
                    setSearchQuery,
                ) }
              >
                  {obj.foodName}
              </p>
            ) }
            setResults={ setQueryResults }
            setMessage={ () => {} }
            buttonSize="mini"
          />
                </>
            )}
        </div>
    );
};

export default SearchFood;
