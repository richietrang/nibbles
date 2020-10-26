import React from 'react';
import './ModalComponent.css';
import ButtonComponent from '../components/ButtonComponent';

const ModalComponent = ({ children, enableCloseButton, closeButtonCb, alternateButtonText, alternateButtonCb }) => {
  return (
    <div className="semi-transparent-page-wrapper">
      <div className="modal-border">
        <div className="modal-container">
          <div className="modal-children-wrapper">
          {children}
          </div>
          { enableCloseButton &&
            <div className="modal-buttons-wrapper">
              <ButtonComponent 
                buttonText="Close"
                backgroundColor='#efefef'
                onClick={closeButtonCb}
              />
              <ButtonComponent 
                buttonText={`${alternateButtonText}`}
                backgroundColor='#febd2e'
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default ModalComponent;
