import React from "react";
import "./ButtonComponent.css";

// Button defaults to a white background with blue text if no backgroundColor or fontColor is provided
class ButtonComponent extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = false;
  }

  render() {
    const {
      buttonText,
      backgroundColor,
      fontColor,
      buttonBorder,
      fontSize,
      display,
      margin,
      _,
      disabled,
      outline
    } = this.props;

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
        onClick={this.onClick}
        disabled={disabled}
      >
        {buttonText}
      </button>
    );
  }

  onClick() {
    this.toggle = !this.toggle;
    this.props.onClick();
  }
}

export default ButtonComponent;
