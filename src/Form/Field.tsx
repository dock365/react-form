import * as React from 'react';
import { FormContext, validationRules, ValidateOnTypes } from './Form';
import { validationTypes } from '@dock365/validator';
import Render from './Render';
export interface IFieldRenderProps {
  name: string;
  placeholder?: string;
  defaultValue?: any;
  value?: any;
  hideLabel?: boolean;
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
}
export interface IFieldState {
  shouldUpdate: boolean;
}

export class Field extends React.Component<IFieldProps, IFieldState> {
  constructor(props: IFieldProps) {
    super(props);
  }

  public render() {
    return (
      <FormContext.Consumer >
        {(props) => <Render {...props} fieldProps={this.props} />}
      </FormContext.Consumer>
    );
  }
}
