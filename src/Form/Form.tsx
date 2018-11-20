import React, { FormEvent } from "react";
import Validator, { IValidationFailMessages, IStringValidationOptions } from "@braces/validator";
import createReactContext, { Context } from 'create-react-context';
import { Field } from "./Field";

export enum ValidateOnTypes {
  Submit,
  FieldChange,
  FieldBlur,
}

export interface IFormProps {
  // fields: IField[];
  submitElement?: JSX.Element;
  onSubmit?: (e: FormEvent<HTMLFormElement>, values: ISubmitValues) => void;
  onBlur?: (e: FormEvent<HTMLFormElement>, values: ISubmitValues) => void;
  onChange?: (e: FormEvent<HTMLFormElement>, values: ISubmitValues) => void;
  validationMessages?: IValidationFailMessages
  validateOn?: ValidateOnTypes
}

export interface ISubmitValues {
  [name: string]: string | number | boolean;
}

export interface IField {
  name: string;
  value?: any;
  errors?: string[];
  validationRules?: IStringValidationOptions;
}

export interface IFormState {
  fields: IField[],
  hasError: boolean;
}

export const FormContext: Context<any> = createReactContext({})

export class Form extends React.Component<IFormProps, IFormState> {
  private validator: Validator;
  private form: HTMLFormElement | null = null;
  constructor(props: IFormProps) {
    super(props);

    this.state = {
      fields: [],
      hasError: false,
    };

    this.validator = new Validator({
      failMessages: this.props.validationMessages
    });

    this._initializeField = this._initializeField.bind(this);
    this._onFieldChange = this._onFieldChange.bind(this);
    this._onFieldBlur = this._onFieldBlur.bind(this);

    this._onSubmit = this._onSubmit.bind(this);
    this._onFormChange = this._onFormChange.bind(this);
    this._onFormBlur = this._onFormBlur.bind(this);
  }

  public componentDidMount() {

  }

  public render() {
    return (
      <FormContext.Provider value={{
        onChange: this._onFieldChange,
        onBlur: this._onFieldBlur,
        fields: this.state.fields,
        initialize: this._initializeField,
      }}>
        <form
          onSubmit={this._onSubmit}
          onChange={this._onFormChange}
          onBlur={this._onFormBlur}
          ref={ref => { this.form = ref }}
        >
          {this.props.children}
        </form >
      </FormContext.Provider>
    );
  }

  private _initializeField(name: string, validationRules: IStringValidationOptions) {
    const fieldValue = this.state.fields.find(item => item.name === name);
    if (name && !fieldValue) {
      this.setState(prevState => ({
        fields: [
          ...prevState.fields,
          {
            name,
            validationRules,
            value: "",
            errors: [],
          }
        ]
      }))
    }
  }

  private _onFieldChange(e: React.MouseEvent<HTMLInputElement>, name: string) {
    const value = e.currentTarget.value;
    const fieldValue = this.state.fields.find(item => item.name === name);
    if (fieldValue) {
      fieldValue.value = value;
      this.setState(prevState => {
        return {
          fields: prevState.fields.map(item => item.name === fieldValue.name ? { ...fieldValue } : item)
        }
      })
      if (this.props.validateOn === ValidateOnTypes.FieldChange) {
        this._validateField(fieldValue);
      }
    }
  }

  private _onFieldBlur(e: React.MouseEvent<HTMLInputElement>, name: string) {
    const value = e.currentTarget.value;

    const fieldValue = this.state.fields.find(item => item.name === name);
    if (fieldValue) {
      fieldValue.value = value;
      if (this.props.validateOn === ValidateOnTypes.FieldBlur) {
        this._validateField(fieldValue);
      }
    }
  }

  private _onFormChange(e: FormEvent<HTMLFormElement>) {
    if (this.props.onChange) {
      // this.props.onChange(e, this.state.fieldValues);
    }
  }

  private _onFormBlur(e: FormEvent<HTMLFormElement>) {
    if (this.props.onBlur) {
      // this.props.onBlur(e, this.state.fieldValues);
    }
  }

  private _onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (this.props.validateOn === ValidateOnTypes.Submit) {
      this._validateAll(() => {
        this.props.onSubmit && this.props.onSubmit(e, this._structuredValues())
      })
    } else {
      !this.state.hasError &&
        this.props.onSubmit &&
        this.props.onSubmit(e, this._structuredValues())
    }
  }

  private _structuredValues(): ISubmitValues {
    const values: ISubmitValues = {};
    this.state.fields.forEach(field => values[field.name] = field.value)
    return values;
  }

  private _validateAll(cb: Function) {
    if (this.state.fields.every(field => this._validateField(field)))
      cb()
  }

  private _validateField(field: IField) {
    if (field.validationRules) {
      const result = this.validator.string(field.name, field.value, field.validationRules);
      if (!result.success) {
        this.setState(prevState => {
          return {
            fields: [
              ...prevState.fields.map(item => item.name === field.name ? { ...item, errors: result.messages } : item)
            ],
          }
        });
        return false;
      }
      this.setState(prevState => {
        return {
          fields: [
            ...prevState.fields.map(item => item.name === field.name ? { ...item, errors: [] } : item)
          ],
        }
      });
    }
    return true;
  }
}
