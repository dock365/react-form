# React Form
<!-- [![Build Status](https://travis-ci.org/codebraces/react-form.svg?branch=master)](https://travis-ci.org/codebraces/react-form) -->
[![npm Version](https://img.shields.io/npm/v/@braces/react-form.svg)](https://www.npmjs.com/package/@braces/react-form)


## Install
1 Install react form as dependency
  ```bash
  # Using yarn package manager
  $ yarn add @braces/react-form

  # Using npm package manager
  $ npm install --save @braces/react-form
  ```
2 Import React form module
  ```javascript
  // ES6
  import { Form } from "@braces/react-form"

  // ES5
  var Form = require("react-table").Form;
  ```
## Example

```javascript
  import React from "react";
  import { Form } from "@braces/react-form";

  export default (props) => {
    return (
      <Form
        fields={[
          {
            name: "fullname",
            label: "Full name",
            placeholder: "Enter full name here",
            validationRules: {
              minLength: 3,
              maxLength: 15,
              noTrailingSpace: true,
            }
          }, {
            name: "email",
            label: "Email",
            placeholder: "Enter email here",
          }
        ]}
        onSubmit={(values) => console.log(values)}
      />
    );
  };
```

## Contributing!
All contributions are super welcome!


## License

React Form is MIT licensed.