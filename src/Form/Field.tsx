import * as React from 'react';
import { FormContext, validationRules, ValidateOnTypes } from './Form';
import { validationTypes } from '@dock365/validator';

export interface IFieldRenderProps {
  name: string;
  placeholder?: string;
  defaultValue?: any;
  value?: any;
  customProps?: any;
  onChange?: (
    value: any,
    e?: React.MouseEvent<HTMLInputElement>,
  ) => void;
  onBlur?: (
    value: any,
    e?: React.MouseEvent<HTMLInputElement>,
  ) => void;
  label?: string;
  validationRules?: validationRules;
  errors?: string[];
  resetFields?: (name?: string | string[]) => void;
}
export interface IFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  defaultValue?: any;
  render: React.ComponentType<IFieldRenderProps>;
  onChange?: (value: any, resetFields?: (name?: string | string[]) => void) => void;
  onBlur?: (value: any, resetFields?: (name?: string | string[]) => void) => void;
  validationRules?: validationRules;
  customProps?: any;
  customValidation?: (value?: any, validationRules?: validationRules) => string[];
}
export interface IFieldState {
  shouldUpdate: boolean;
}

export class Field extends React.Component<IFieldProps, IFieldState> {
  constructor(props: IFieldProps) {
    super(props);

    this.state = {
      shouldUpdate: false,
    };
  }
  public componentDidUpdate(prevProps: IFieldProps) {
    if (this.props.validationRules !== prevProps.validationRules) {
      this.setState({ shouldUpdate: true });
    }
  }

  public render() {
    return (
      <FormContext.Consumer >
        {({
          fields,
          onChange,
          onBlur,
          initialize,
          showAsteriskOnRequired,
          resetFields,
          validateOn,
          updateCustomValidationMessage,
        }) => {
          const field = fields && fields.find((item: any) => item.name === this.props.name);
          if (!field || this.state.shouldUpdate) {
            if (this.state.shouldUpdate)
              this.setState((prevState) => ({ shouldUpdate: !prevState.shouldUpdate }));
            if (initialize) {
              initialize(this.props.name, this.props.label, this.props.validationRules);
            }

            return null;
          }
          if (field && field.value === undefined && this.props.defaultValue !== undefined && onChange) {
            onChange(this.props.defaultValue, this.props.name);
            if (
              validateOn &&
              this.props.customValidation &&
              updateCustomValidationMessage
            ) {
              updateCustomValidationMessage(
                this.props.name,
                this.props.customValidation(this.props.defaultValue, this.props.validationRules),
              );
            }
          }

          const type = this.props.validationRules && this.props.validationRules.type;

          return (
            React.createElement(this.props.render, {
              name: this.props.name,
              placeholder: this.props.placeholder,
              defaultValue: this.props.defaultValue,
              value: field && field.value,
              customProps: this.props.customProps,
              resetFields,
              onChange: (
                value: any,
                e?: React.MouseEvent<HTMLInputElement>,
              ) => {
                const _value = type === validationTypes.String && typeof value === "number" ?
                  `${value}` : value;
                if (onChange) onChange(_value, this.props.name, e);
                if (this.props.onChange) this.props.onChange(_value, resetFields);
                if (
                  validateOn === ValidateOnTypes.FieldChange &&
                  this.props.customValidation &&
                  updateCustomValidationMessage
                ) {
                  updateCustomValidationMessage(
                    field.name,
                    this.props.customValidation(_value, this.props.validationRules),
                  );
                }
              },
              onBlur: (
                value: any,
                e?: React.MouseEvent<HTMLInputElement>,
              ) => {
                const _value = type === validationTypes.String && typeof value === "number" ?
                  `${value}` : value;
                if (onBlur) onBlur(_value, this.props.name, e);
                if (this.props.onBlur) this.props.onBlur(_value, resetFields);
                if (
                  validateOn === ValidateOnTypes.FieldBlur &&
                  this.props.customValidation &&
                  updateCustomValidationMessage
                ) {
                  updateCustomValidationMessage(
                    field.name,
                    this.props.customValidation(_value, this.props.validationRules),
                  );
                }
              },
              label: showAsteriskOnRequired && this.props.validationRules && this.props.validationRules.required ?
                `${this.props.label}*` :
                this.props.label,
              validationRules: this.props.validationRules,
              errors: field && [...field.errors, ...field.customErrors],
            })
          );
        }}
      </FormContext.Consumer>
    );
  }
}
