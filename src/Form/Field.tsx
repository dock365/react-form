import * as React from 'react';
import { FormContext, validationRules } from './Form';
import { IStringValidationOptions } from '@braces/validator';
export interface IFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  render: (props: any) => JSX.Element;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  validationRules?: validationRules;
}
export interface IFieldState { }

export class Field extends React.Component<IFieldProps, IFieldState> {
  constructor(props: IFieldProps) {
    super(props);
  }

  public componentDidMount() {
  }

  public render() {
    return (
      <FormContext.Consumer >
        {({ fields, onChange, onBlur, initialize }) => {
          const field = fields && fields.find((item: any) => item.name === this.props.name);
          if (!field) {
            initialize && initialize(this.props.name, this.props.validationRules);
            return null;
          }
          return (
            React.createElement(this.props.render, {
              input: {
                name: this.props.name,
                placeholder: this.props.placeholder,
                defaultValue: this.props.defaultValue,
                value: field && field.value,
                onChange: (value: number | string | boolean | React.MouseEvent<HTMLInputElement>, e?: React.MouseEvent<HTMLInputElement>) => onChange && onChange(value, this.props.name, e),
                onBlur: (value: number | string | boolean | React.MouseEvent<HTMLInputElement>, e?: React.MouseEvent<HTMLInputElement>) => onBlur && onBlur(value, this.props.name, e),
              },
              label: this.props.label,
              errors: field && field.errors,
            })
          )
        }}
      </FormContext.Consumer>
    );
  }
}
