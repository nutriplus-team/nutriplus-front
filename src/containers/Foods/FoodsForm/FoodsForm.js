import React, { useState, useEffect, useCallback } from 'react';

import { Button, Form, Segment, Message, Checkbox } from 'semantic-ui-react';

import { numberValidator } from '../../../utility/validators';
import { sendAuthenticatedRequest } from '../../../utility/httpHelper';

const FoodsForm = (props) => {
    let isEditing = true;
    if (props.food === undefined)
        isEditing = false;

    let food;
    if (isEditing)
        food = props.food;
    else
        food = {};

    const [error, setError] = useState({content: '', header: ''});
    const [isLoading, setIsLoading] = useState(false);
  
    const [name, setName] = useState(food['food_name'] || '');
    const [group, setGroup] = useState(food['food_group'] || '');
    const [totalGrams, setTotalGrams] = useState(food['measure_total_grams'] || 0);
    const [type, setType] = useState(food['measure_type'] || '');
    const [amount, setAmount] = useState(food['measure_amount'] || 0);
    
    const [nutritionFacts, setNutritionFacts] = useState(
        isEditing
            ? props.food['nutrition_facts']
            : {            
                'calories': 0,
                'proteins': 0,
                'carbohydrates': 0,
                'lipids': 0,
                'fiber': 0,
            }
    );

    const [mealSet, setMealSet] = useState(
        isEditing
            ? props.food['meal_set']
            : []
    );

    const handleNutritionFactsChange = (name, newValue) => {
        const update = {...nutritionFacts};
        update[name] = newValue;
        setNutritionFacts(update);
    };

    const handleToggle = (number) => {
        const previous = [...mealSet];

        let update = [];
        if (previous.includes(number))
            update = previous.filter((num) => num !== number);
        else {
            previous.push(number);
            update = previous;
        }

        setMealSet(update);
    };

    const validateInputs = useCallback(() => {
        let valid = true;

        if (!numberValidator(totalGrams, 4, true, 1))
            valid = false;

        if (!numberValidator(amount, 4, true, 1))
            valid = false;

        valid &= Object.keys(nutritionFacts).map((key) => numberValidator(nutritionFacts[key], 4, true, 1))
            .reduce((prev, curr) => prev && curr);

        if (!valid) {
            setError({
                header: 'Dados Inválidos',
                content: 'Alguns valores precisam ser numéricos.'
            });
        } else {
            setError({
                header: '',
                content: ''
            });
        }

        return valid;
    }, [totalGrams, amount, nutritionFacts]);
    useEffect(() => {
        validateInputs();
    }, [validateInputs]);
    useEffect(() => {
        validateInputs();
    }, [totalGrams, amount, nutritionFacts, validateInputs]);

    const submit = async () => {
        setIsLoading(true);

        const updatedFood = {
            'food_name': name,
            'food_group': group,
            'measure_total_grams': totalGrams,
            'measure_type': type,
            'measure_amount': amount,
            'calories': nutritionFacts['calories'],
            'proteins': nutritionFacts['proteins'],
            'carbohydrates': nutritionFacts['carbohydrates'],
            'lipids': nutritionFacts['lipids'],
            'fiber': nutritionFacts['fiber'],
            'meal_set': mealSet.join('&')
        };

        let valid = validateInputs();
        if (!valid)
            return;

        let url;
        if (isEditing)
            url = `/foods/edit-food/${food.id}/`;
        else
            url = '/foods/add-new/';

        sendAuthenticatedRequest(
            url,
            'post',
            () => {
                setError({
                    header: 'Erro ao se comunicar com o serviço.',
                    content: 'Por favor, tente mais tarde.'
                });
                setIsLoading(false);
            },
            () => {
                setError({content: '', header: ''});
                setIsLoading(false);
                props.afterSubmit();
            },
            JSON.stringify(updatedFood)
        );
    };

    return (
      <Form
        size='large'
        onSubmit={ submit }
        error={ error.header !== '' }
        loading={ isLoading }
      >
        <Segment stacked>
          <Message error header={ error.header } content={ error.content }/>
          <Form.Group widths='equal'>
            <Form.Field>
                <label>Nome do Alimento</label>
                <Form.Input 
                  fluid
                  value={ name }
                  onChange={ (event) => setName(event.target.value) }
                />
            </Form.Field>
            <Form.Field>
                <label>Grupo do Alimento</label>
                <Form.Input 
                  fluid
                  value={ group }
                  onChange={ (event) => setGroup(event.target.value) }
                />
            </Form.Field>
            <Form.Field>
                <label>Peso da Porção (em gramas)</label>
                <Form.Input 
                  fluid
                  value={ totalGrams }
                  onChange={ (event) => setTotalGrams(event.target.value) }
                />
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field>
                <label>Unidade da Medida</label>
                <Form.Input 
                  fluid
                  value={ type }
                  onChange={ (event) => setType(event.target.value) }
                />
            </Form.Field>
            <Form.Field>
                <label>Quantidade da Medida</label>
                <Form.Input 
                  fluid
                  value={ amount }
                  onChange={ (event) => setAmount(event.target.value) }
                />
            </Form.Field>
            <Form.Field>
                <label>Valor Energético (kcal)</label>
                <Form.Input 
                  fluid
                  value={ nutritionFacts['calories'] }
                  onChange={ (event) => handleNutritionFactsChange('calories', event.target.value) }
                />
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field>
                <label>Proteínas (g)</label>
                <Form.Input 
                  fluid
                  value={ nutritionFacts['proteins'] }
                  onChange={ (event) => handleNutritionFactsChange('proteins', event.target.value) }
                />
            </Form.Field>
            <Form.Field>
                <label>Carboidratos (g)</label>
                <Form.Input 
                  fluid
                  value={ nutritionFacts['carbohydrates'] }
                  onChange={ (event) => handleNutritionFactsChange('carbohydrates', event.target.value) }
                />
            </Form.Field>
            <Form.Field>
                <label>Lipídios (g)</label>
                <Form.Input 
                  fluid
                  value={ nutritionFacts['lipids'] }
                  onChange={ (event) => handleNutritionFactsChange('lipids', event.target.value) }
                />
            </Form.Field>
            <Form.Field>
                <label>Fibra Alimentar (g)</label>
                <Form.Input 
                  fluid
                  value={ nutritionFacts['fiber'] }
                  onChange={ (event) => handleNutritionFactsChange('fiber', event.target.value) }
                />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <Checkbox
              label='Café da manhã'
              onChange={ () => handleToggle(1) }
              checked={ mealSet.includes(1) }
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label='Lanche da manhã'
              onChange={ () => handleToggle(2) }
              checked={ mealSet.includes(2) }
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label='Almoço'
              onChange={ () => handleToggle(3) }
              checked={ mealSet.includes(3) }
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label='Lanche da tarde'
              onChange={ () => handleToggle(4) }
              checked={ mealSet.includes(4) }
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label='Jantar'
              onChange={ () => handleToggle(5) }
              checked={ mealSet.includes(5) }
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label='Lanche da noite'
              onChange={ () => handleToggle(6) }
              checked={ mealSet.includes(6) }
            />
          </Form.Field>
          <Button type='submit' color='teal' size='large'>
            Salvar
          </Button>
          <Button onClick={ props.afterCancel } size='large'>
            Voltar
          </Button>
        </Segment>
      </Form>
    );
};

export default FoodsForm;
