// ============================================================
//  FILE: src/components/InputField.jsx
//  PURPOSE: Reusable input field used in Register & Login forms
//  HOW IT WORKS: Pass label, name, type, value, onChange as props
//  REUSABILITY: Used in RegisterPage + LoginPage — write once, use anywhere
// ============================================================

export default function InputField({ label, name, type = "text", placeholder, value, onChange }) {
  return (
    <div className="field-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
    </div>
  );
}
