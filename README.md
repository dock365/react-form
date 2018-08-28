# React Form
[![Build Status](https://travis-ci.org/codebraces/validator.svg?branch=master)](https://travis-ci.org/codebraces/validator)
[![npm Version](https://img.shields.io/npm/v/@braces/validator.svg)](https://www.npmjs.com/package/@braces/validator)


## Install
1 Install react from as dependancy
  ```bash
  # Using yarn package manager
  $ yarn add @braces/react-from

  # Using npm package manager
  $ npm install --save @braces/react-from
  ```
2 Import React from module
  ```javascript
  // ES6
  import { From } from "@braces/react-form"

  // ES5
  var From = require("react-table").From;
  ```
## Example

```javascript
  import React from "react";
  import { From } from "@braces/react-form";

  export default (props) => {
    return (
      <Form
        fields={[
          {
            name: "fullname",
            label: "Full name",
            placeholder: "Enter full name here",
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

Validator is MIT licensed.