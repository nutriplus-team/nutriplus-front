import React, { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';

import FoodsSearchInput from './FoodsSearchInput/FoodsSearchInput';

import FoodsModal from '../../components/FoodsModal/FoodsModal';
import FoodsTable from './FoodsTable/FoodsTable';

import { sendAuthenticatedRequest } from '../../utility/httpHelper';

const pageSize = 10;

const FoodDatabaseEditor = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [foodInfo, setFoodInfo] = useState(null);
    const [foodNameQuery, setFoodNameQuery] = useState('');
    const [error, setError] = useState(null);

    const [queryString, setQueryString] = useState('');
    const [totalLength, setTotalLength] = useState(0);
    const [page, setPage] = useState(0);

    const requestFoodInfo = (currPage) => {
        sendAuthenticatedRequest(
            '/graphql/get/',
            'post',
            (message) => setError(message),
            (info) => {
                const newTotalLength = (currPage * pageSize) + info.data['listFoodPaginated'].length + 1;
                console.log(currPage, pageSize, info.data['listFoodPaginated'].length, newTotalLength);
                setTotalLength(newTotalLength);

                setQueryString('listFoodPaginated');
                setFoodInfo(info);

                setError(null);
                setLoaded(true);
            },
            `query {
                listFoodPaginated(indexPage: ${currPage}, sizePage: ${pageSize}) {
                    uuid,
                    foodName,
                    foodGroup,
                    measureTotalGrams,
                    measureType,
                    measureAmount
                }
            }`
        );
    };
    useEffect(() => {
        requestFoodInfo(page);
    }, [page]);

    const makeQuery = (foodName) => {
        setFoodNameQuery(foodName);
        setLoaded(false);

        if (foodName === ''){
            console.log('been here', page);
            requestFoodInfo(page);
        }
        else {
            console.log('or here');
            sendAuthenticatedRequest(
                '/graphql/get/',
                'post',
                (message) => setError(message),
                (info) => {
                    setTotalLength(info.data['searchFood'] === null ? 0 : info.data['searchFood'].length);

                    setQueryString('searchFood');
                    if (info.data.searchFood === null)
                        info.data.searchFood = [];
                    setFoodInfo(info);
                    setError(null);
                    
                    setLoaded(true);
                    setError(null);
                },
                `query {
                    searchFood(partialFoodName: "${foodName}", indexPage: ${0}, sizePage: ${pageSize}) {
                        uuid,
                        foodName,
                        foodGroup,
                        measureTotalGrams,
                        measureType,
                        measureAmount,
                    }
                }`
            );     
        } 
    };

    const clickEdition = (foodId, foodIdx) => {
        console.log('clicked');
        const food = foodInfo.data[queryString][foodIdx];
        if (food.uuid !== foodId)
            return;
        setSelectedFood(food);
        setOpenModal(true);
    };

    const buttonRemove = (foodId, foodIdx) => {
        const food = foodInfo.data[queryString][foodIdx];
        if (food.uuid !== foodId)
            return;

        console.log('Tentando remover ', foodId);
        setFoodNameQuery('');
        setLoaded(false);
        console.log(foodId);
        sendAuthenticatedRequest(
            '/graphql/get/',
            'post',
            (message) => setError(message),
            () => {
                requestFoodInfo(page);
            },
            `mutation {
                removeFood(uuidFood: "${foodId}")
            }`
        );    
    };

    const buttonAdd = () => {
        setSelectedFood();
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setFoodNameQuery('');
        setOpenModal(false);
        setLoaded(false);
        requestFoodInfo(page);
    };

    const changePage = (page) => {
        console.log(page);
        setLoaded(false);
        setPage(page);
    };

    return (
        <>
            <FoodsModal 
              open={ openModal } 
              handleClose={ handleCloseModal } 
              selectedFood={ selectedFood }
            />
            <Grid centered>
                <Grid.Column width={ 12 }>
                    <FoodsSearchInput
                      disabled={ !loaded } 
                      foodName={ foodNameQuery } 
                      handleSearch={ makeQuery } 
                    />
                    <FoodsTable 
                      loaded={ loaded }
                      error={ error }
                      setError={ setError }
                      foodInfo={ foodInfo }
                      queryString={ queryString }
                      totalLength={ totalLength }
                      pageSize={ pageSize }
                      page={ page }
                      changePage={ changePage }
                      setFoodInfo={ setFoodInfo }
                      handleAdd={ buttonAdd }
                      handleClick={ clickEdition }
                      handleRemove={ buttonRemove }
                    />
                </Grid.Column>
            </Grid>
        </>
    );
};

export default FoodDatabaseEditor;
