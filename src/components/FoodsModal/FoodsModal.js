import React from 'react';

import { Modal } from 'semantic-ui-react';

import FoodsForm from '../../containers/Foods/FoodsForm/FoodsForm';

const FoodsModal = (props) => (
    <Modal 
      open={ props.open } 
      onClose={ props.handleClose }
      closeOnEscape
      closeOnDimmerClick
      dimmer='blurring'
      centered={ false }
      size='large'
    >
        <Modal.Header >Insira/Altere informações do alimento.</Modal.Header>
        <Modal.Content>
            <FoodsForm
              food={ props.selectedFood }
              afterSubmit={ props.handleClose }
              afterCancel={ props.handleClose }
            />
        </Modal.Content>
    </Modal>
);

export default FoodsModal;
