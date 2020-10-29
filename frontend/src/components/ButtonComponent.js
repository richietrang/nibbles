import React from 'react';
import './ButtonComponent.css'

// Button defaults to a white background with blue text if no backgroundColor or fontColor is provided
const ButtonComponent = ({ buttonText, backgroundColor, fontColor, buttonBorder, fontSize, display, margin, onClick }) => {
  const styles = {
    buttonStyles: {
      backgroundColor: backgroundColor ? backgroundColor : 'white',
      color: fontColor ? fontColor : '#002344',
      border: buttonBorder,
      fontSize: fontSize,
      display: display,
      margin: margin,
    }
  }

  return (
    <div className="primary-button" style={styles.buttonStyles} onClick={onClick}>
      { buttonText }
    </div>
  );
}

export default ButtonComponent;
