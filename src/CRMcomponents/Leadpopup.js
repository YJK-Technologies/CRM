import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const AddCompanyModal = ({ onClose }) => {
  // Tag states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [defaultTags, setDefaultTags] = useState([]);
  const [sales_person, setSales_person] = useState([]);
  const [sales_Team, setSales_Team] = useState([]);

  // Input states
  const [inputValues, setInputValues] = useState({
    countries: '',
    states: '',
    industries: '',
    defaultTags: '',
    sales_person: '',
    sales_Team:'',
  });

  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter' && inputValues[type].trim()) {
      e.preventDefault();
      const newValue = inputValues[type].trim();
      if (!eval(type).includes(newValue)) {
        eval(`set${capitalize(type)}`)([...eval(type), newValue]);
      }
      setInputValues(prev => ({ ...prev, [type]: '' }));
    }
  };

  const handleRemove = (type, tagToRemove) => {
    eval(`set${capitalize(type)}`)(eval(type).filter(tag => tag !== tagToRemove));
  };

  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  return ReactDOM.createPortal(
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Need help reaching your target?</h2>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div style={styles.body}>
          <h3 style={styles.subtitle}>How many leads would you like?</h3>

          <div style={styles.leadsRow}>
            <input type="number" placeholder="3" style={styles.inputInline} />
            <span style={styles.labelInline}>Companies</span>
          </div>

          <div style={styles.grid}>
            {/* Left column */}
            <div>
              {renderTagInput('Countries', 'countries', countries)}
              {renderTagInput('States', 'states', states, 'Pick States...')}
              {renderTagInput('Industries', 'industries', industries)}

              <div style={styles.formGroup}>
                <label>
                  <input type="checkbox" />
                  Filter on Size
                </label>
              </div>
            </div>

            {/* Right column */}
            <div>
              <div style={styles.formGroup}>
                {renderTagInput('Sales Team', 'sales_Team', sales_Team)}
              </div>

              <div style={styles.formGroup}>
                {renderTagInput('Sales_person', 'sales_person', sales_person)}
              </div>

              {renderTagInput('Default Tags', 'defaultTags', defaultTags)}
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button className="">Generate Leads</button>
          {/* <button style={styles.button} onClick={onClose}>Cancel</button> */}
        </div>
      </div>
    </div>,
    document.body
  );

  // Tag Input Renderer
  function renderTagInput(label, type, tags, placeholder = `Add ${label.toLowerCase()}...`) {
    return (
      <div style={styles.formGroup}>
        <label>{label}</label>
        <div style={styles.tagInputWrapper}>
          {tags.map(tag => (
            <span key={tag} style={styles.tag}>
              {tag}
              <button style={styles.removeTag} onClick={() => handleRemove(type, tag)}>&times;</button>
            </span>
          ))}
          <input
            type="text"
            placeholder={placeholder}
            value={inputValues[type]}
            onChange={e => setInputValues(prev => ({ ...prev, [type]: e.target.value }))}
            onKeyDown={e => handleKeyDown(e, type)}
            style={styles.tagInput}
          />
        </div>
      </div>
    );
  }
};

export default AddCompanyModal;

// ---------------------
// ✅ Inline CSS Styles
// ---------------------

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  },
  container: {
    background: '#fff',
    width: '950px',
    maxWidth: '95%',
    padding: '24px 32px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ccc',
    paddingBottom: '16px'
  },
  title: { margin: 0, fontSize: '20px' },
  closeBtn: {
    background: '#ff0000ff',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer'
  },
  body: { marginTop: '20px' },
  subtitle: { fontSize: '18px', marginBottom: '16px' },
  leadsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
  },
  inputInline: {
    width: '60px',
    padding: '8px'
  },
  labelInline: {
    fontWeight: 'bold'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
  },
  formGroup: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  salesPill: {
    background: '#9e5cb2',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: '600',
    width: 'fit-content'
  },
  tagInputWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    border: '1px solid #ccc',
    padding: '6px',
    borderRadius: '4px',
    minHeight: '40px'
  },
  tag: {
  background: '#e2d7cb',
  padding: '4px 8px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  lineHeight: 1,
  height: '24px'
},
removeTag: {
  background: '#ff0000ff',
  color: '#fff',
  border: 'none',
  fontSize: '10px',
  cursor: 'pointer',
  borderRadius: '50%',
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  lineHeight: 1
},

  tagInput: {
    border: 'none',
    minWidth: '1px',
    padding: '1px',
    outline: 'none'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px'
  },
  button: {
    padding: '1px 2px',
    border: 'none',
    background: '#ccc',
   
    cursor: 'pointer'
  },
  primary: {
    background: '#7b3f8f',
    color: '#fff'
  }
};
