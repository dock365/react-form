import * as React from "react";

export interface IInputProps {
  label?: string;
  input?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  errors?: string[];
}

const Input: React.SFC<IInputProps> = ({ label, input, errors }) => {
  return (
    <div>
      {label ? <label>{label}</label> : null }
      <input {...input} />
      {errors && errors.map((error, i) => <p key={i} className="validation-errors">{error}</p>)}
    </div>
  );
};

export default Input;
