# React Form
<!-- [![Build Status](https://travis-ci.org/dock365/reform.svg?branch=master)](https://travis-ci.org/dock365/reform) -->
[![npm Version](https://img.shields.io/npm/v/@dock365/reform.svg)](https://www.npmjs.com/package/@dock365/reform)


## Install
1 Install react form as dependency
  ```bash
  # Using yarn package manager
  $ yarn add @dock365/reform

  # Using npm package manager
  $ npm install --save @dock365/reform
  ```
2 Import React form module
  ```javascript
  // ES6
  import { Form } from "@dock365/reform"

  // ES5
  var Form = require("@dock365/reform").Form;
  ```
## Example

```javascript
  import React from "react";
  import { Form, Field } from "@dock365/reform";

  export default (props) => {
    return (
      <Form onSubmit={(e, values) => console.log(values)} validateOn={1}>
        <Field name="test1" render={(props) => (
          <div>
            <input {...props.input} />
            <ul>
              {props.errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>
          </div>
        )}
          validationRules={{
            required: true,
            maxLength: 10,
          }} />
        <Field name="test2" render={(props) => <input {...props.input} />} />
        <Field name="test3" render={(props) => <input {...props.input} />} />
        <button>Submit</button>
      </Form>
    );
  };
```

## Properties
### Form Props
| Name               | Type   | Required           |Description                                                          |
| :----------------- | :----- | :----------------- | :------------------------------------------------------------------- |
|onSubmit|`(e: event, values: { key: value })`| false |Return complete values in the field on form submit |
|onBlur|`(e: event, values: { key: value })`| false |Return complete values in the field on form field blur |
|onChange|`(e: event, values: { key: value })`| false |Return complete values in the field on form field blur |
|validateOn|`ValidateOnTypes` or `0` - Submit, or `1` - FieldChange, or `2` - FieldBlur,| | |
|validationMessages|`IValidationFailMessages` or `{[criterion: string]: message}`|false|custom validation messages|
|showAsteriskOnRequired|`boolean`|false | Show asterisk (`*`) on required field labels |

### Field Props
| Name               | Type   | Required           |Description                                                          |
| :----------------- | :----- | :----------------- | :------------------------------------------------------------------- |
|name|`string`|true|A unique name to identify the field and value|
|label|`string`|false|Label to show on field|
|placeholder|`string`|false|Placeholder value|
|defaultValue|any based on field type|false|Default value|
|render| `(props: IFieldRenderProps) => JSX.Element`|false|Field element
|onChange|`(value: any based on field) => void;`|false|On field change action|
|onBlur|`(value: any based on field) => void;`|false|On field blur action|
|validationRules|`validationRules`|false|validation rules based on [@dock365/validator](https://www.npmjs.com/package/@dock365/validator)|
|customProps|any|false|Custom Props that can be accessed from render props|

### Field Render Props
*All props from Field Props excluding render and including*
| Name               | Type   |Description                                                          |
| :----------------- | :----- | :------------------------------------------------------------------- |
|errors|`string[]`|Validation massages if any validation rule fails
## Contributing!
All contributions are super welcome!


## License

React Form is MIT licensed.