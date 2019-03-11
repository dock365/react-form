import * as React from "react";
import { IFormContext, ValidateOnTypes, IField } from './Form';
import { validationTypes } from "@dock365/validator";
import { IFieldProps } from "./Field";

export type propsType = IFormContext & { fieldProps: IFieldProps };
export interface IState {
  field?: IField;
}

export default class Render extends React.Component<propsType, IState> {

  constructor(props: propsType) {
    super(props);

    this.state = {
      field: undefined,
    };
  }

  public componentDidMount() {
    if (this.props.fields) {
      this.setState({
        field: this.props.fields && this.props.fields.find((item: any) => item.name === this.props.fieldProps.name),
      });
      this._initialize();
    }


  }

  public componentDidUpdate(prevProps: propsType) {
    if (this.props.fields !== prevProps.fields) {
      this.setState({
        field: this.props.fields && this.props.fields.find((item: any) => item.name === this.props.fieldProps.name),
      });
    }
    if (this.props.fieldProps.validationRules !== prevProps.fieldProps.validationRules && this.state.field) {
      // Sould update: Reinitialize
      this._initialize();
    }

    if (
      this.state.field &&
      this.state.field.value === undefined &&
      this.props.fieldProps.defaultValue !== undefined &&
      this.props.onChange
    ) {
      this.props.onChange(this.props.fieldProps.defaultValue, this.props.fieldProps.name);
      if (
        this.props.validateOn &&
        this.props.fieldProps.customValidation &&
        this.props.updateCustomValidationMessage
      ) {
        this.props.updateCustomValidationMessage(
          this.props.fieldProps.name,
          this.props.fieldProps.customValidation(
            this.props.fieldProps.defaultValue,
            this.props.fieldProps.validationRules,
          ),
        );
      }
    }

    if(this.props.fieldProps.value !== prevProps.fieldProps.value && this.props.onChange) {
      this.props.onChange(this.props.fieldProps.value, this.props.fieldProps.name);
    }
  }

  // public shouldComponentUpdate(nextProps: propsType, nextState: IState) {
  //   return this.state.field !== nextState.field ? true : false;
  // }

  public render() {
    const { field } = this.state;
    if (!field) {
      return null;
    }
    const {
      fields,
      onChange,
      onBlur,
      initialize,
      showAsteriskOnRequired,
      resetFields,
      validateOn,
      updateCustomValidationMessage,
    } = this.props;

    const type = this.props.fieldProps.validationRules && this.props.fieldProps.validationRules.type;
    let errors: string[] = [];
    if (field)
      errors = [...errors, ...field.errors, ...field.customErrors];
    if (this.props.fieldProps.errorMessages)
      errors = [...errors, ...this.props.fieldProps.errorMessages];

    return (
      React.createElement(this.props.fieldProps.render, {
        name: this.props.fieldProps.name,
        placeholder: this.props.fieldProps.placeholder,
        defaultValue: this.props.fieldProps.defaultValue,
        value: field && field.value,
        customProps: this.props.fieldProps.customProps,
        hideLabel: this.props.fieldProps.hideLabel,
        resetFields,
        fetching: field && field.validating,
        onChange: (
          value: any,
          e?: React.MouseEvent<HTMLInputElement>,
        ) => {
          const _value = type === validationTypes.String && typeof value === "number" ?
            `${value}` : value;
          if (onChange && this.props.fieldProps.value === undefined) onChange(_value, this.props.fieldProps.name, e);
          if (this.props.fieldProps.onChange) this.props.fieldProps.onChange(_value, resetFields);
          if (
            validateOn === ValidateOnTypes.FieldChange &&
            this.props.fieldProps.customValidation &&
            updateCustomValidationMessage
          ) {
            updateCustomValidationMessage(
              field.name,
              this.props.fieldProps.customValidation(_value, this.props.fieldProps.validationRules),
            );
          }
        },
        onBlur: (
          value: any,
          e?: React.MouseEvent<HTMLInputElement>,
        ) => {
          const _value = type === validationTypes.String && typeof value === "number" ?
            `${value}` : value;
          if (onBlur && this.props.fieldProps.value === undefined) onBlur(_value, this.props.fieldProps.name, e);
          if (this.props.fieldProps.onBlur) this.props.fieldProps.onBlur(_value, resetFields);
          if (
            validateOn === ValidateOnTypes.FieldBlur &&
            this.props.fieldProps.customValidation &&
            updateCustomValidationMessage
          ) {
            updateCustomValidationMessage(
              field.name,
              this.props.fieldProps.customValidation(_value, this.props.fieldProps.validationRules),
            );
          }
        },
        label: showAsteriskOnRequired &&
          this.props.fieldProps.validationRules &&
          this.props.fieldProps.validationRules.required ?
          `${this.props.fieldProps.label}*` :
          this.props.fieldProps.label,
        validationRules: this.props.fieldProps.validationRules,
        errors,
      })
    );
  }

  private _initialize() {
    if (this.props.initialize) {
      this.props.initialize(
        this.props.fieldProps.name,
        this.props.fieldProps.label,
        this.props.fieldProps.validationRules,
        this.props.fieldProps.value,
      );
    }
  }
}
