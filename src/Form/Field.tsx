import * as React from 'react';
import { FormContext, validationRules } from './Form';

export interface IFieldRenderProps {
  input: {
    name: string;
    placeholder?: string;
    defaultValue?: string | number | boolean;
    value?: string | number | boolean;
    options?: object[];
    onChange?: (
      value: number | string | boolean | Date,
      e?: React.MouseEvent<HTMLInputElement>,
    ) => void;
    onBlur?: (
      value: number | string | boolean | Date,
      e?: React.MouseEvent<HTMLInputElement>,
    ) => void;
  };
  label?: string;
  errors?: string[];
}
export interface IFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  render: (props: IFieldRenderProps) => JSX.Element;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  validationRules?: validationRules;
  options?: object[];
}
export interface IFieldState { }

export class Field extends React.Component<IFieldProps, IFieldState> {
  constructor(props: IFieldProps) {
    super(props);
  }

  public render() {
    return (
      <FormContext.Consumer >
        {({ fields, onChange, onBlur, initialize }) => {
          const field = fields && fields.find((item: any) => item.name === this.props.name);
          if (!field) {
            if (initialize)
              initialize(this.props.name, this.props.validationRules);

            return null;
          }

          return (
            React.createElement(this.props.render, {
              input: {
                name: this.props.name,
                placeholder: this.props.placeholder,
                defaultValue: this.props.defaultValue,
                value: field && field.value,
                options: this.props.options,
                onChange: (
                  value: number | string | boolean | Date,
                  e?: React.MouseEvent<HTMLInputElement>,
                ) => onChange && onChange(value, this.props.name, e),
                onBlur: (
                  value: number | string | boolean | Date,
                  e?: React.MouseEvent<HTMLInputElement>,
                ) => onBlur && onBlur(value, this.props.name, e),
              },
              label: this.props.label,
              errors: field && field.errors,
            })
          );
        }}
      </FormContext.Consumer>
    );
  }
}
