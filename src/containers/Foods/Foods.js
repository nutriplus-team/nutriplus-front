import React, { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';

import FoodsSearchInput from './FoodsSearchInput/FoodsSearchInput';

import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import FoodsModal from '../../components/FoodsModal/FoodsModal';
import FoodsTable from './FoodsTable/FoodsTable';

import { sendAuthenticatedRequest } from '../../utility/httpHelper';

const pageSize = 10;

const FoodDatabaseEditor = () => {
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [openFoodsModal, setOpenFoodsModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [foodInfo, setFoodInfo] = useState({info: null, queryString:''});
    const [foodNameQuery, setFoodNameQuery] = useState('');
    const [error, setError] = useState(null);

    //const [queryString, setQueryString] = useState('');
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

                //setQueryString('listFoodPaginated');
                setFoodInfo({info, queryString: 'listFoodPaginated'});

                setError(null);
                setLoaded(true);
            },
            `query {
                listFoodPaginated(indexPage: ${currPage}, sizePage: ${pageSize}) {
                    uuid,
                    foodName,
                    foodGroup,
                    custom,
                    created,
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
            requestFoodInfo(page);
        }
        else {
            sendAuthenticatedRequest(
                '/graphql/get/',
                'post',
                (message) => setError(message),
                (info) => {
                    setTotalLength(info.data['searchFood'] === null ? 0 : info.data['searchFood'].length);

                    //setQueryString('searchFood');
                    if (info.data.searchFood === null)
                        info.data.searchFood = [];
                    setFoodInfo({info, queryString: 'searchFood'});
                    setError(null);
                    
                    setLoaded(true);
                    setError(null);
                },
                `query {
                    searchFood(partialFoodName: "${foodName}", indexPage: ${0}, sizePage: ${pageSize}) {
                        uuid,
                        foodName,
                        foodGroup,
                        custom,
                        created,
                        measureTotalGrams,
                        measureType,
                        measureAmount,
                    }
                }`
            );     
        } 
    };

    const clickEdition = (foodId, foodIdx) => {
        const food = foodInfo.info.data[foodInfo.queryString][foodIdx];
        if (food.uuid !== foodId)
            return;
        setSelectedFood(food);
        setOpenFoodsModal(true);
    };

    const buttonRemove = (foodId) => {
        setFoodNameQuery('');
        setLoaded(false);
        
        sendAuthenticatedRequest(
            '/graphql/get/',
            'post',
            (message) => setError(message),
            () => {
                requestFoodInfo(page);
                setLoaded(true);
                setOpenConfirmationModal(false);
            },
            `mutation {
                removeFood(uuidFood: "${foodId}")
            }`
        );    
    };

    const removeFoodPreparation = (foodId, foodIdx) => {
        const food = foodInfo.info.data[foodInfo.queryString][foodIdx];
        if (food.uuid !== foodId)
            return;
        setSelectedFood(food);
        setOpenConfirmationModal(true);
    };

    const buttonAdd = () => {
        setSelectedFood();
        setOpenFoodsModal(true);
    };

    const handleCloseFoodsModal = () => {
        setFoodNameQuery('');
        setOpenFoodsModal(false);
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
            <ConfirmationModal
              message='Você quer mesmo excluir este alimento?'
              open={ openConfirmationModal }
              handleConfirmation={ () => buttonRemove(selectedFood.uuid) }
              handleRejection={ () => setOpenConfirmationModal(false) }
            />
            <FoodsModal 
              open={ openFoodsModal } 
              handleClose={ handleCloseFoodsModal } 
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
                      foodInfo={ foodInfo.info }
                      queryString={ foodInfo.queryString }
                      totalLength={ totalLength }
                      pageSize={ pageSize }
                      page={ page }
                      changePage={ changePage }
                      handleAdd={ buttonAdd }
                      handleClick={ clickEdition }
                      handleRemove={ removeFoodPreparation }
                    />
                </Grid.Column>
            </Grid>
        </>
    );
};

export default FoodDatabaseEditor;
