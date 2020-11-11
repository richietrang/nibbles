import React from "react";
import "./ButtonComponent.css";

// Button defaults to a white background with blue text if no backgroundColor or fontColor is provided
const ButtonComponent = ({
  buttonText,
  backgroundColor,
  fontColor,
  buttonBorder,
  fontSize,
  display,
  margin,
  onClick,
  disabled,
  outline
}) => {
  const styles = {
    buttonStyles: {
      backgroundColor: backgroundColor ? backgroundColor : "white",
      color: fontColor ? fontColor : "#002344",
      border: buttonBorder ? buttonBorder : "none",
      fontSize: fontSize,
      display: display,
      margin: margin,
      outline: outline ? outline : "none"
    }
  };

  return (
    <button
      className="primary-button"
      style={styles.buttonStyles}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
};

export default ButtonComponent;
