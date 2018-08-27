import React, { FormEvent } from "react";
import Input, { IInputProps } from "../Input";

export interface IField {
  name: string;
  label?: string;
  defaultValue?: string | any;
  element?: (props: IInputProps) => JSX.Element;
}

export interface IFormProps {
  fields: IField[];
  submit?: JSX.Element;
  onSubmit?: (values: any) => any; // TODO: type defnition
}

export interface IFieldValue {
  field: string;
  value?: any;
  errors?: string[];
}

export interface IFormState {
  fieldValues: IFieldValue[];
}

export class Form extends React.Component<IFormProps, IFormState> {
  constructor(props: IFormProps) {
    super(props);

    this.state = {
      fieldValues: [],
    };

    this._onSubmit = this._onSubmit.bind(this);
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
      <form onSubmit={this._onSubmit}>
        {this._fields()}
        {this.props.submit || <button>Submit</button>}
      </form >
    );
  }

  private _fields() {
    if (this.state.fieldValues.length > 0) {
      return this.props.fields.map((field, i) => {
        const fieldValue = this.state.fieldValues.find((item: IFieldValue) => field.name === item.field);
        return <Input
          key={field.name}
          label={field.label}
          errors={fieldValue && fieldValue.errors}
          input={{
            onChange: (e) => {
              this.setState({
                fieldValues: this.state.fieldValues.map((item: IFieldValue) =>
                  field.name === item.field ? { ...item, value: e.target.value } : item),
              });
            },
            value: fieldValue && fieldValue.value || "",
          }} />;
      });
    }
  }

  private _onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Submitted")
  }

}
