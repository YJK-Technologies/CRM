// formStyles.js

// Input style (email, text, etc.)
export const emailInputStyle = {
  border: "none",
  borderBottom: "2px solid #ccc",
  outline: "none",
  padding: "6px 2px",
  fontSize: "14px",
  fontWeight: "500",
  width: "350px",
  transition: "border-color 0.2s ease",
  backgroundColor: "transparent",
};

// Focused state (can be applied dynamically)
export const emailInputFocusStyle = {
  borderBottom: "2px solid #17a2b8",
};

// Company Select styles (react-select)
export const companySelectStyles = {
  control: (base, state) => ({
    ...base,
    border: "none",
    borderBottom: state.isFocused ? "2px solid #17a2b8" : "2px solid #ccc",
    boxShadow: "none",
    borderRadius: "0",
    backgroundColor: "transparent",
    fontSize: "14px",
    fontWeight: 500,
    width: "350px",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#666",
    ":hover": { color: "#17a2b8" },
  }),
};
