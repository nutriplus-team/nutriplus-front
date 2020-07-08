import React, { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';

import FoodsSearchInput from './FoodsSearchInput/FoodsSearchInput';

import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import FoodsModal from '../../components/FoodsModal/FoodsModal';
import FoodsTable from '../../components/FoodsTable/FoodsTable';

import { sendAuthenticatedRequest } from '../../utility/httpHelper';

const FoodDatabaseEditor = () => {
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [openFoodsModal, setOpenFoodsModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [foodInfo, setFoodInfo] = useState(null);
    const [foodNameQuery, setFoodNameQuery] = useState('');
    const [error, setError] = useState(null);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [hasNext, setHasNext] = useState(false);

    const requestFoodInfo = () => {
        sendAuthenticatedRequest(
            '/foods/list-foods-pagination/',
            'get',
            (message) => setError(message),
            (info) => {
                setFoodInfo(info);
                setError(null);
                setHasPrevious(false);
                setHasNext(info.next !== null);
                setLoaded(true);
                setError(null);
            },
        );
    };
    useEffect(() => {
        requestFoodInfo();
    }, []);

    const makeQuery = (foodName) => {
        setFoodNameQuery(foodName);
        setLoaded(false);

        if (foodName === '')
            requestFoodInfo();
        else
            sendAuthenticatedRequest(
                `/foods/search/${foodName}/`,
                'get',
                (message) => setError(message),
                (info) => {
                    setFoodInfo(info);
                    setError(null);
                    setHasPrevious(false);
                    setHasNext(info.next !== null);
                    setLoaded(true);
                    setError(null);
                },
            );      
    };

    const clickEdition = (foodId, foodIdx) => {
        const food = foodInfo.results[foodIdx];
        if (food.id !== foodId)
            return;
        setSelectedFood(food);
        setOpenFoodsModal(true);
    };

    const removeFood = () => {
        const foodId = selectedFood.id;
        setFoodNameQuery('');
        setLoaded(false);
        setOpenConfirmationModal(false);
        sendAuthenticatedRequest(
            `/foods/remove/${foodId}/`,
            'get',
            (message) => setError(message),
            () => {
                requestFoodInfo();
            },
        );  
    };

    const removeFoodPreparation = (foodId, foodIdx) => {
        const food = foodInfo.results[foodIdx];
        if (food.id !== foodId)
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
        requestFoodInfo();
    };

    return (
        <>
            <ConfirmationModal
              message='Você quer mesmo excluir este alimento?'
              open={ openConfirmationModal }
              handleConfirmation={ () => removeFood() }
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
                      foodInfo={ foodInfo }
                      setFoodInfo={ setFoodInfo }
                      hasPrevious={ hasPrevious }
                      setHasPrevious={ setHasPrevious }
                      hasNext={ hasNext }
                      setHasNext={ setHasNext }
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
