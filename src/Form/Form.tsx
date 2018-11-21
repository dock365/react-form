import React, { FormEvent } from "react";
import Validator, {
  IValidationFailMessages,
  IStringValidationOptions,
  INumberValidationOptions,
  IDateValidationOptions,
  IEmailValidationOptions,
  validationTypes,
  IValidationResponse,
} from "@dock365/validator";
import createReactContext, { Context, ProviderProps } from 'create-react-context';

export enum ValidateOnTypes {
  Submit,
  FieldChange,
  FieldBlur,
}

export interface IFormProps {
  submitElement?: JSX.Element;
  onSubmit?: (e: FormEvent<HTMLFormElement>, values: ISubmitValues) => void;
  onBlur?: (e: FormEvent<HTMLFormElement>, values: ISubmitValues) => void;
  onChange?: (e: FormEvent<HTMLFormElement>, values: ISubmitValues) => void;
  validationMessages?: IValidationFailMessages;
  validateOn?: ValidateOnTypes;
}

export interface ISubmitValues {
  [name: string]: string | number | boolean;
}

export type validationRules =
  (IStringValidationOptions & { type: validationTypes.String }) |
  (INumberValidationOptions & { type: validationTypes.Number }) |
  (IDateValidationOptions & { type: validationTypes.Date }) |
  (IEmailValidationOptions & { type: validationTypes.Email });

export interface IField {
  name: string;
  value?: any;
  errors?: string[];
  validationRules?: validationRules;
}

export interface IFormState {
  fields: IField[];
  hasError: boolean;
}

export interface IFormContext {
  onChange?: (
    value: string | number | boolean | React.MouseEvent<HTMLInputElement>,
    name: string,
    e?: React.MouseEvent<HTMLInputElement>,
  ) => void;
  onBlur?: (
    value: string | number | boolean | React.MouseEvent<HTMLInputElement>,
    name: string,
    e?: React.MouseEvent<HTMLInputElement>,
  ) => void;
  fields?: IField[];
  initialize?: (name: string, validationRules?: validationRules) => void;
}

export const FormContext: Context<IFormContext> = createReactContext({});

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
      failMessages: this.props.validationMessages,
    });

    this._initializeField = this._initializeField.bind(this);
    this._onFieldChange = this._onFieldChange.bind(this);
    this._onFieldBlur = this._onFieldBlur.bind(this);

    this._onSubmit = this._onSubmit.bind(this);
    this._onFormChange = this._onFormChange.bind(this);
    this._onFormBlur = this._onFormBlur.bind(this);
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
          ref={ref => { this.form = ref; }}
        >
          {this.props.children}
        </form >
      </FormContext.Provider>
    );
  }

  private _initializeField(name: string, _validationRules?: validationRules) {
    const fieldValue = this.state.fields.find(item => item.name === name);
    if (name && !fieldValue) {
      this.setState(prevState => ({
        fields: [
          ...prevState.fields,
          {
            name,
            validationRules: _validationRules,
            value: "",
            errors: [],
          },
        ],
      }));
    }
  }

  private _onFieldChange(
    value: string | number | boolean | React.MouseEvent<HTMLInputElement>,
    name: string,
    e?: React.MouseEvent<HTMLInputElement>,
  ) {
    const fieldValue = this.state.fields.find(item => item.name === name);
    if (fieldValue) {
      fieldValue.value = typeof value === "object" ? value.currentTarget.value : value;
      this.setState(prevState => {
        return {
          fields: prevState.fields.map(item => item.name === fieldValue.name ? { ...fieldValue } : item),
        };
      });
      if (this.props.validateOn === ValidateOnTypes.FieldChange) {
        this._validateField(fieldValue);
      }
    }
  }

  private _onFieldBlur(
    value: string | number | boolean | React.MouseEvent<HTMLInputElement>,
    name: string,
    e?: React.MouseEvent<HTMLInputElement>,
  ) {
    const fieldValue = this.state.fields.find(item => item.name === name);
    if (fieldValue) {
      fieldValue.value = typeof value === "object" ? value.currentTarget.value : value;
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
        if (this.props.onSubmit)
          this.props.onSubmit(e, this._structuredValues());
      });
    } else {
      if (!this.state.hasError && this.props.onSubmit)
        this.props.onSubmit(e, this._structuredValues());
    }
  }

  private _structuredValues(): ISubmitValues {
    const values: ISubmitValues = {};
    this.state.fields.forEach(field => values[field.name] = field.value);

    return values;
  }

  private _validateAll(cb: () => void) {
    let success = true;
    this.state.fields.forEach(field => { success = success && this._validateField(field); });
    if (success)
      cb();
  }

  private _validateField(field: IField) {
    if (field.validationRules && field.validationRules.type) {
      let result: IValidationResponse;
      switch (field.validationRules.type) {
        case validationTypes.String:
          result = this.validator[validationTypes.String](field.name, field.value, field.validationRules);
          break;
        case validationTypes.Number:
          result = this.validator[validationTypes.Number](field.name, field.value, field.validationRules);
          break;
        case validationTypes.Date:
          result = this.validator[validationTypes.Date](field.name, field.value, field.validationRules);
          break;
        case validationTypes.Email:
          result = this.validator[validationTypes.Email](field.name, field.value, field.validationRules);
          break;

        default:
          result = {
            success: true,
            messages: [],
          };
          break;
      }
      if (!result.success) {
        this.setState(prevState => {
          return {
            fields: [
              ...prevState.fields.map(item => item.name === field.name ? { ...item, errors: result.messages } : item),
            ],
          };
        });

        return false;
      }
      this.setState(prevState => {
        return {
          fields: [
            ...prevState.fields.map(item => item.name === field.name ? { ...item, errors: [] } : item),
          ],
        };
      });
    }

    return true;
  }
}
