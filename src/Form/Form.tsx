import React, { FormEvent, ReactHTMLElement, Context, createContext } from "react";
import Validator, {
  IValidationFailMessages,
  IStringValidationOptions,
  INumberValidationOptions,
  IDateValidationOptions,
  IEmailValidationOptions,
  IArrayValidationOptions,
  validationTypes,
  IValidationResponse,
} from "@dock365/validator";
import { localeStringToNumber } from "../helpers/localeString";
// import createReactContext, { Context, ProviderProps } from 'create-react-context';
// import { Promise } from 'es6-promise';


export enum ValidateOnTypes {
  Submit = 1,
  FieldChange,
  FieldBlur,
}

export interface IFormProps {
  onSubmit?: (
    e: FormEvent<HTMLFormElement>,
    values: IFieldValues,
    resetFields?: (name?: string | string[]) => void,
  ) => void;
  onBlur?: (
    e: FormEvent<HTMLFormElement>,
    values: IFieldValues,
    validationStatus?: boolean,
    resetFields?: (name?: string | string[]) => void,
  ) => void;
  onChange?: (
    e: FormEvent<HTMLFormElement>,
    values: IFieldValues,
    resetFields?: (name?: string | string[]) => void,
  ) => void;
  validationMessages?: IValidationFailMessages;
  validateOn?: ValidateOnTypes;
  showAsteriskOnRequired?: boolean;
  formRef?: (ref: HTMLFormElement | null) => void;
  values?: IFieldValues;
  readOnly?: boolean;
}

export interface IFieldValues {
  [name: string]: any;
}

export type validationRules =
  (IStringValidationOptions & { type: validationTypes.String }) |
  (INumberValidationOptions & { type: validationTypes.Number }) |
  (IDateValidationOptions & { type: validationTypes.Date }) |
  (IArrayValidationOptions & { type: validationTypes.Array }) |
  (IEmailValidationOptions & { type: validationTypes.Email });

export interface IField {
  name: string;
  label?: string;
  value?: any;
  errors: string[];
  customErrors: string[];
  validationRules?: validationRules;
  updated?: boolean;
  validating?: boolean;
  promise?: Promise<void>;
  autoTrimTrailingSpaces?: boolean;
  localeString?: boolean;
}

export interface IFormState {
  fields: IField[];
  hasError: boolean;
}

export interface IFormContext {
  onChange?: (
    value: any,
    name: string,
    e?: React.MouseEvent<HTMLInputElement>,
  ) => void;
  onBlur?: (
    value: any,
    name: string,
    e?: React.MouseEvent<HTMLInputElement>,
  ) => void;
  fields?: IField[];
  initialize?: (
    name: string,
    label?: string,
    validationRules?: validationRules,
    value?: any,
    autoTrimTrailingSpaces?: boolean,
    localeString?: boolean,
  ) => void;
  showAsteriskOnRequired?: boolean;
  resetFields?: (name?: string | string[]) => void;
  validateOn?: ValidateOnTypes;
  updateCustomValidationMessage?: (name: string, messages?: Promise<string[]>) => void;
  unmountField?: (name: string) => void;
  readOnly?: boolean;
}

export const FormContext: Context<IFormContext> = createContext({});

export class Form extends React.Component<IFormProps, IFormState> {
  private validator: Validator;
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

    this._resetFields = this._resetFields.bind(this);
    this._updateCustomValidationMessage = this._updateCustomValidationMessage.bind(this);
    this._unmountField = this._unmountField.bind(this);
  }

  public componentDidMount() {
    if (this.props.values) {
      this._updateValues(this.props.values);
    }
  }

  public componentDidUpdate(prevProps: IFormProps) {
    if (this.props.values && (this.props.values !== prevProps.values)) {
      this._updateValues(this.props.values);
    } else if ((this.props.values !== prevProps.values) && !this.props.values) {
      this._resetFields();
    }
  }

  public render() {
    return (
      <FormContext.Provider value={{
        onChange: this._onFieldChange,
        onBlur: this._onFieldBlur,
        fields: this.state.fields,
        initialize: this._initializeField,
        showAsteriskOnRequired: this.props.showAsteriskOnRequired,
        resetFields: this._resetFields,
        validateOn: this.props.validateOn,
        updateCustomValidationMessage: this._updateCustomValidationMessage,
        unmountField: this._unmountField,
        readOnly: this.props.readOnly,
      }}>
        <form
          onSubmit={this._onSubmit}
          onChange={this._onFormChange}
          onBlur={this._onFormBlur}
          ref={this.props.formRef}
        >
          {this.props.children}
        </form >
      </FormContext.Provider>
    );
  }

  private _initializeField(
    name: string,
    label?: string,
    _validationRules?:
      validationRules,
    value?: any,
    autoTrimTrailingSpaces?: boolean,
    localeString?: boolean,
  ) {
    if (!name) {
      return;
    }

    const fieldValue = this.state.fields.find(item => item.name === name);
    if (!fieldValue) {
      this.setState(
        prevState => (
          {
            fields: [
              ...prevState.fields,
              {
                name,
                label,
                validationRules: _validationRules,
                errors: [],
                customErrors: [],
                updated: false,
                value,
                autoTrimTrailingSpaces,
                localeString,
              },
            ],
          }
        ),
      );
    } else {
      this.setState(
        prevState => (
          {
            fields: prevState.fields
              .map(field => field.name === name ? { ...field, label, validationRules: _validationRules } : field),
          }
        ),
      );
    }
  }

  private _onFieldChange(
    value: any,
    name: string,
    e?: React.MouseEvent<HTMLInputElement>,
  ) {
    const fieldValue = this.state.fields.find(item => item.name === name);
    if (fieldValue) {
      fieldValue.value = value;
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
    value: string,
    name: string,
    e?: React.MouseEvent<HTMLInputElement>,
  ) {
    const fieldValue = this.state.fields.find(item => item.name === name);
    if (fieldValue) {
      if (fieldValue.validationRules && fieldValue.validationRules.type === validationTypes.Number) {
        const number = Number(value.split(",").join(""))
        fieldValue.value = fieldValue.localeString && (number || number === 0) && number.toLocaleString ? number.toLocaleString() : value;
      } else {
        fieldValue.value = fieldValue.localeString && value.toLocaleString ? value.toLocaleString() : value;
      }
      this.setState(prevState => {
        return {
          fields: prevState.fields.map(item => item.name === fieldValue.name ? { ...fieldValue } : item),
        };
      });
      if (this.props.validateOn === ValidateOnTypes.FieldBlur) {
        this._validateField(fieldValue);
      }
    }
  }

  private _onFormChange(e: FormEvent<HTMLFormElement>) {

    if (this.props.onChange) {
      const fields = this._trimmedValues(this.state.fields)
      this.props.onChange(e, this._structuredValues(fields), this._resetFields);
    }
  }

  private _onFormBlur(e: FormEvent<HTMLFormElement>) {

    if (this.props.validateOn && this.props.validateOn === ValidateOnTypes.FieldBlur && this.props.onBlur) {
      const fields = this._trimmedValues(this.state.fields)
      this.props.onBlur(e, this._structuredValues(fields), this._validateAll(), this._resetFields);
    } else if (this.props.onBlur) {
      const fields = this._trimmedValues(this.state.fields)
      this.props.onBlur(e, this._structuredValues(fields), true, this._resetFields);
    }
  }

  private _unmountField(name: string) {
    this.setState(prevState => ({
      fields: prevState.fields.filter(field => field.name !== name),
    }))
  }

  private async _onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fields = this._trimmedValues(this.state.fields)

    const validating = fields.map((field) => field.promise);
    const event = { ...e };

    await Promise.all(validating)

    if (this.props.validateOn) {
      this._validateAll(() => {
        if (this.props.onSubmit)
          this.props.onSubmit(event, this._structuredValues(fields), this._resetFields);
      });
    } else {
      if (!this.state.hasError && this.props.onSubmit) {

        this.props.onSubmit(event, this._structuredValues(fields), this._resetFields);
      }
    }
  }

  private _trimmedValues(fields: IField[]): IField[] {
    return fields.map(field => ({
      ...field,
      value: typeof field.value === "string" && field.autoTrimTrailingSpaces ? field.value.trim() : field.value,
    }));
  }

  private _structuredValues(fields: IField[]): IFieldValues {
    const values: IFieldValues = {};
    fields.forEach(field => values[field.name] = field.value);

    return values;
  }

  private _updateValues(values: IFieldValues) {
    this.setState(prevState => ({
      fields: prevState.fields.map(field => ({
        ...field,
        value: values[field.name],
      })),
    }));
  }

  private _validateAll(cb?: () => void): boolean {
    const success = this.state.fields
      .reduce((prevValue, field) => this._validateField(field) && prevValue && field.customErrors.length === 0, true);
    if (success && cb)
      cb();

    return success;
  }

  private _validateField(field: IField) {
    if (field.validationRules && field.validationRules.type) {
      let result: IValidationResponse;
      switch (field.validationRules.type) {
        case validationTypes.String:
          result =
            this.validator[validationTypes.String](field.label || field.name, field.value || "", field.validationRules);
          break;
        case validationTypes.Number: {
          let value = field.localeString ? localeStringToNumber(field.value) : field.value;
          value = Number(value) || value;
          result =
            this.validator[validationTypes.Number](field.label || field.name, value, field.validationRules);
          break;
        }
        case validationTypes.Date: {
          const value = field.localeString ? new Date(field.value) : field.value;

          result =
            this.validator[validationTypes.Date](field.label || field.name, value, field.validationRules);
          break;
        }
        case validationTypes.Email:
          result =
            this.validator[validationTypes.Email](field.label || field.name, field.value || "", field.validationRules);
          break;
        case validationTypes.Array:
          result =
            this.validator[validationTypes.Array](field.label || field.name, field.value || "", field.validationRules);
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

  private _updateCustomValidationMessage(name: string, messages?: Promise<string[]>): Promise<void> {
    if (messages) {
      const promise = messages.then((errors) => {
        this.setState(prevState => ({
          fields: prevState.fields
            .map(item => item.name === name ? { ...item, customErrors: errors || [] } : item),
        }));
      });

      this.setState(prevState => ({
        fields: prevState.fields
          .map(item => item.name === name ? { ...item, promise } : item),
      }));

      return promise;
    }

    return Promise.resolve();
  }

  private _resetFields(name?: string | string[]) {
    if (name) {
      if (typeof name === "string") {
        this.setState(prevState => ({
          fields: prevState.fields.map(field => field.name === name ? { ...field, value: undefined } : field),
        }));
      } else {
        this.setState(prevState => {
          let fields: IField[] = prevState.fields;
          name.forEach(_name => {
            fields = fields.map(field => field.name === _name ? { ...field, value: undefined } : field);
          });
        });
      }
    } else {
      this.setState((prevState) => ({
        fields: prevState.fields.map(field => ({ ...field, value: undefined })),
      }));
    }
  }
}
