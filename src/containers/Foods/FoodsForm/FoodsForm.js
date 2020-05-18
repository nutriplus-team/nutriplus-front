import React, {useState} from 'react';

import { Button, Form, Segment, Message, Checkbox } from 'semantic-ui-react';

import { numberValidator } from '../../../utility/validators';

const FoodsForm = (props) => {
    const [error, setError] = useState({content: '', header: ''});
    const [isLoading, setIsLoading] = useState(false);
  
    const [name, setName] = useState(props.food['food_name']);
    const [group, setGroup] = useState(props.food['food_group']);
    const [totalGrams, setTotalGrams] = useState(props.food['measure_total_grams']);
    const [type, setType] = useState(props.food['measure_type']);
    const [amount, setAmount] = useState(props.food['measure_amount']);
    const [nutritionFacts, setNutritionFacts] = useState(props.food['nutrition_facts']);
    const [mealSet, setMealSet] = useState(props.food['meal_set']);

    const handleNutritionFactsChange = (name, newValue) => {
        const update = {...nutritionFacts};
        update[name] = newValue;
        setNutritionFacts(update);
    };

    const handleToggle = (number) => {
        const previous = [...mealSet];

        console.log(previous);

        let update = [];
        if (previous.includes(number))
            update = previous.filter((num) => num !== number);
        else {
            previous.push(number);
            update = previous;
        }

        setMealSet(update);
    };

    const submit = () => {
        setIsLoading(true);

        const updatedFood = {
            'food_name': name,
            'food_group': group,
            'measure_total_grams': totalGrams,
            'measure_type': type,
            'measure_amount': amount,
            'nutrition_facts': nutritionFacts,
            'meal_set': mealSet
        };

        let valid = 
          ['measure_total_grams', 'measure_amount']
              .map((key) => numberValidator(updatedFood[key], 4, true, 1))
              .reduce((prev, curr) => prev && curr);

        valid &= Object
            .keys(updatedFood['nutrition_facts'])
            .map((key) => numberValidator(updatedFood['nutrition_facts'][key], 4, true, 1))
            .reduce((prev, curr) => prev && curr);

        if (!valid) {
            setError({
                header: 'Dados Inválidos',
                content: 'Alguns valores precisam ser numéricos.'
            });
            setIsLoading(false);
            return;
        }

        // Make HTTP request
        setError({content: '', header: ''});
        setIsLoading(false);
        props.afterSubmit();
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
          <Form.Field>
              <label>Quantidade da Medida</label>
              <Form.Input 
                fluid
                value={ type }
                onChange={ (event) => setType(event.target.value) }
              />
          </Form.Field>
          <Form.Field>
              <label>Unidade da Medida</label>
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
          <Form.Field>
              <label>Proteínas</label>
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
          <Button color='teal' fluid size='large'>
            Login
          </Button>
        </Segment>
      </Form>
    );
};

export default FoodsForm;
