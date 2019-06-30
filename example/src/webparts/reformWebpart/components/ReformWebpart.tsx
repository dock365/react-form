import * as React from 'react';
import styles from './ReformWebpart.module.scss';
import { IReformWebpartProps } from './IReformWebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Form, Field, validationTypes, ValidateOnTypes } from '@dock365/reform';
import { CheckboxField, TextField } from '@dock365/reform-fabric-fields';

export interface IReformWebpartState {
  isChecked: boolean;
}
export default class ReformWebpart extends React.Component<IReformWebpartProps, IReformWebpartState> {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: false,
    };
  }
  public render(): React.ReactElement<IReformWebpartProps> {
    return (
      <div className={styles.reformWebpart}>
        <Form validateOn={ValidateOnTypes.Submit}>
          <Field
            render={CheckboxField}
            name="Checkbox"
            label="Checkbox field"
            onChange={(checked) => this.setState({ isChecked: checked })}
          />

          {this.state.isChecked ?
            <Field
              key="1"
              render={TextField}
              name="CheckedTextFiedl"
              label="Checked Text field"
              validationRules={{
                type: validationTypes.String,
                required: true,
              }}
            /> :
            <Field
              key="2"
              render={TextField}
              name="UnCheckedTextFiedl"
              label="UnChecked Text field"
              validationRules={{
                type: validationTypes.String,
                required: true,
              }}
            />
          }

          <button type="Submit">Submit</button>
        </Form>
      </div>
    );
  }
}
