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

    if (this.props.fieldProps.value !== prevProps.fieldProps.value && this.props.onChange) {
      this.props.onChange(this.props.fieldProps.value, this.props.fieldProps.name);
    }
  }

  public componentWillUnmount() {
    if (this.props.unmountField)
      this.props.unmountField(this.props.fieldProps.name);
  }

  public render() {
    const { field } = this.state;
    if (!field) {
      return null;
    }
    const {
      showAsteriskOnRequired,
      resetFields,
    } = this.props;

    let errors: string[] = [];
    if (field)
      errors = [...errors, ...field.errors, ...field.customErrors];
    if (this.props.fieldProps.errorMessages)
      errors = [...errors, ...this.props.fieldProps.errorMessages];

    const Render = this.props.fieldProps.render;

    const props = {
      name: this.props.fieldProps.name,
      placeholder: this.props.fieldProps.placeholder,
      defaultValue: this.props.fieldProps.defaultValue,
      value: field && field.value,
      customProps: this.props.fieldProps.customProps,
      resetFields,
      fetching: field && field.validating,
      readOnly: this.props.readOnly || this.props.fieldProps.readOnly,
      componentRef: this.props.fieldProps.componentRef,
      onChange: this._onChange,
      onBlur: this._onBlur,
      localeString: this.props.fieldProps.localeString,
      label: !this.props.fieldProps.hideLabel && (showAsteriskOnRequired &&
        this.props.fieldProps.validationRules &&
        this.props.fieldProps.validationRules.required ?
        `${this.props.fieldProps.label}*` :
        this.props.fieldProps.label) || undefined,
      validationRules: this.props.fieldProps.validationRules,
      errors,
    };

    return (
      <Render {...props} />
    );
  }

  private _initialize() {
    if (this.props.initialize) {
      this.props.initialize(
        this.props.fieldProps.name,
        this.props.fieldProps.label,
        this.props.fieldProps.validationRules,
        this.props.fieldProps.value,
        this.props.fieldProps.autoTrimTrailingSpaces,
        this.props.fieldProps.localeString,
      );
    }
  }

  private _onChange = (
    value: any,
    e?: React.MouseEvent<HTMLInputElement>,
  ) => {
    if (!this.state.field) {
      return;
    }
    const type = this.props.fieldProps.validationRules && this.props.fieldProps.validationRules.type;
    let _value = value;
    if (type === validationTypes.String && typeof value === "number") {
      _value = `${value}`;
    } else if (type === validationTypes.Number) {
      _value = Number(value) || value;
    }
    // else if(type === validationTypes.String && typeof value === "number") {

    if (this.props.onChange && this.props.fieldProps.value === undefined) this.props.onChange(_value, this.props.fieldProps.name, e);
    if (this.props.fieldProps.onChange) this.props.fieldProps.onChange(_value, this.props.resetFields);
    if (
      this.props.validateOn === ValidateOnTypes.FieldChange &&
      this.props.fieldProps.customValidation &&
      this.props.updateCustomValidationMessage
    ) {
      this.props.updateCustomValidationMessage(
        this.state.field.name,
        this.props.fieldProps.customValidation(_value, this.props.fieldProps.validationRules),
      );
    }
  }

  private _onBlur = (
    value: any,
    e?: React.MouseEvent<HTMLInputElement>,
  ) => {
    if (!this.state.field) {
      return;
    }
    const type = this.props.fieldProps.validationRules && this.props.fieldProps.validationRules.type;
    let _value = value;
    if (type === validationTypes.String && typeof value === "number") {
      _value = `${value}`
    }
    if (this.props.onBlur && this.props.fieldProps.value === undefined) this.props.onBlur(_value, this.props.fieldProps.name, e);
    if (this.props.fieldProps.onBlur) this.props.fieldProps.onBlur(_value, this.props.resetFields);
    if (
      this.props.validateOn === ValidateOnTypes.FieldBlur &&
      this.props.fieldProps.customValidation &&
      this.props.updateCustomValidationMessage
    ) {
      this.props.updateCustomValidationMessage(
        this.state.field.name,
        this.props.fieldProps.customValidation(_value, this.props.fieldProps.validationRules),
      );
    }
  }

}
