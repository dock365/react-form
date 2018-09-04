import React, { FormEvent } from "react";
import Input, { IInputProps } from "../Input";
import { IValidationFailMessages, IStringValidationOptions } from "@braces/validator";
import Validator from "@braces/validator";

export interface IField {
  name: string;
  label?: string;
  defaultValue?: string | any;
  placeholder?: string;
  onChange?: (e: FormEvent<HTMLInputElement>) => any;
  onBlur?: (e: FormEvent<HTMLInputElement>) => any;
  element?: (props: IInputProps) => JSX.Element;
  validationMessages?: IValidationFailMessages;
  validationRules?: IStringValidationOptions;
}

export interface IFormProps {
  fields: IField[];
  submitElement?: JSX.Element;
  onSubmit?: (e: FormEvent<HTMLFormElement>, values: IFieldValue[]) => any; // TODO: type defnition
  onBlur?: (e: FormEvent<HTMLFormElement>, values: IFieldValue[]) => any; // TODO: type defnition
  onChange?: (e: FormEvent<HTMLFormElement>, values: IFieldValue[]) => any; // TODO: type defnition
  validationMessages?: IValidationFailMessages
}

export interface IFieldValue {
  field: string;
  value?: any;
  errors?: string[];
}

export interface IFormState {
  fieldValues: IFieldValue[];
  submittable: boolean;
}

export class Form extends React.Component<IFormProps, IFormState> {
  private validator: Validator;
  constructor(props: IFormProps) {
    super(props);

    this.state = {
      fieldValues: [],
      submittable: true,
    };

    this.validator = new Validator({
      failMessages: this.props.validationMessages
    });

    this._onSubmit = this._onSubmit.bind(this);
    this._onFormChange = this._onFormChange.bind(this);
    this._onFormBlur = this._onFormBlur.bind(this);
  }

  public componentDidMount() {
    const fieldValues: IFieldValue[] = [];
    this.props.fields.forEach((field) => {
      fieldValues.push({
        errors: [],
        field: field.name,
        value: field.defaultValue,
      });
    });
    this.setState({ fieldValues });
  }

  public render() {
    return (
      <form
        onSubmit={this._onSubmit}
        onChange={this._onFormChange}
        onBlur={this._onFormBlur}
      >
        {this._fields()}
        {this.props.submitElement || <button>Submit</button>}
      </form >
    );
  }

  private _fields() {
    if (this.state.fieldValues.length > 0) {
      return this.props.fields.map((field, i) => {
        const fieldValue = this.state.fieldValues.find((item: IFieldValue) => field.name === item.field);
        const props: IInputProps = {
          label: field.label,
          errors: fieldValue && fieldValue.errors,
          input: {
            onChange: (e) => {
              let errors: string[] = [];
              if (field.validationRules) {
                const validation = this.validator.string(field.label || field.name, e.target.value, field.validationRules);
                errors = validation.messages
              }
              this.setState({
                fieldValues: this.state.fieldValues.map((item: IFieldValue) => {
                  if (field.name === item.field) {
                    return {
                      ...item,
                      value: e.target.value,
                      errors,
                    }
                  }
                  return item;
                })
              });
              if (field.onChange) {
                field.onChange(e);
              }
            },
            onBlur: (e) => {
              if (field.onBlur) {
                field.onBlur(e);
              }
            },
            value: fieldValue && fieldValue.value || "",
            placeholder: field.placeholder,
          }
        }
        return field.element && field.element(props) || <Input {...props} />;
      });
    }
  }

  private _onFormChange(e: FormEvent<HTMLFormElement>) {
    if (this.props.onChange) {
      this.props.onChange(e, this.state.fieldValues);
    }
  }

  private _onFormBlur(e: FormEvent<HTMLFormElement>) {
    if (this.props.onBlur) {
      this.props.onBlur(e, this.state.fieldValues);
    }
  }

  private _onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let hasErrors: boolean = false;
    this.state.fieldValues.forEach(({ errors }) => {
      hasErrors = errors && errors.length > 0 || hasErrors;
    })
    if (this.props.onSubmit && this.state.submittable && !hasErrors) {
      this.props.onSubmit(e, this.state.fieldValues);
    }
  }
}
