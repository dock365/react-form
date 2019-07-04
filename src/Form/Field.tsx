import * as React from 'react';
import { FormContext, validationRules, ValidateOnTypes } from './Form';
import { validationTypes } from '@dock365/validator';
import Render from './Render';
import { Promise } from 'es6-promise';

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
  fetching?: boolean;
  readOnly?: boolean;
  ref?: any;
}
export interface IFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  defaultValue?: any;
  value?: any;
  render: React.ComponentType<IFieldRenderProps>;
  onChange?: (value: any, resetFields?: (name?: string | string[]) => void) => void;
  onBlur?: (value: any, resetFields?: (name?: string | string[]) => void) => void;
  validationRules?: validationRules;
  customProps?: any;
  errorMessages?: string[];
  hideLabel?: boolean;
  customValidation?: (value?: any, validationRules?: validationRules) => Promise<string[]>;
  readOnly?: boolean;
  ref?: any;
}
export interface IFieldState {
  shouldUpdate: boolean;
}

export class Field extends React.Component<IFieldProps, IFieldState> {
  private _unmountField: any;
  constructor(props: IFieldProps) {
    super(props);
  }

  public componentDidMount() {
    debugger;
  }

  public componentWillUnmount() {
    debugger;
    if (this._unmountField) {
      this._unmountField();
    }
  }

  public render() {
    return (
      <FormContext.Consumer>
        {(props) => {
          this._unmountField = props.unmountField;

          return (
            <Render
              {...props}
              fieldProps={this.props}
            />
          )
        }}
      </FormContext.Consumer>
    );
  }
}
