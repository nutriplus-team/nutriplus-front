import React, {Component} from 'react';

import { Button, Modal, Input } from 'semantic-ui-react';

class AppointmentModal extends Component {
    state = {
        'email': '',
        'error': {content: '', header: ''}
    }

    

    render = () => (
        <Modal 
          open={ this.props.open } 
          onClose={ this.props.handleRejection }
          closeOnEscape
          closeOnDimmerClick
          dimmer='blurring'
          centered={ false }
          size='large'
        >
        <Modal.Header >Você deseja enviar o cardápio por menu?</Modal.Header>
        <Modal.Content>
            <Input value/>
            <Button color="teal" size="large" onClick={ this.props.handleConfirmation }>
                Confirmar
            </Button>
            <Button color="red" size='large' onClick={ this.props.handleRejection }>
                Cancelar
            </Button>
        </Modal.Content>
    </Modal>
    );
}

export default AppointmentModal;
