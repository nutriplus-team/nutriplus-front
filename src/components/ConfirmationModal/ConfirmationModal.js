import React from 'react';

import { Button, Modal } from 'semantic-ui-react';

const confirmationModal = ( props ) => {
    return (
        <Modal 
          open={ props.open } 
          onClose={ props.handleRejection }
          closeOnEscape
          closeOnDimmerClick
          dimmer='blurring'
          centered={ false }
          size='large'
        >
        <Modal.Header >{props.message}</Modal.Header>
        <Modal.Content>
            <Button color="teal" size="large" onClick={ props.handleConfirmation }>
                Confirmar
            </Button>
            <Button color="red" size='large' onClick={ props.handleRejection }>
                Cancelar
            </Button>
        </Modal.Content>
    </Modal>
    );
};

export default confirmationModal;
