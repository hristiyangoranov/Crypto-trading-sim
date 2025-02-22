import { useState } from 'react';

function TwoValueForm() {
  const [showInputs, setShowInputs] = useState(false);
  const [values, setValues] = useState({ first: '', second: '' });

  const handleButtonClick = () => {
    setShowInputs(!showInputs);
  };

  const handleInputChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <div>
      <button onClick={handleButtonClick}>
        {showInputs ? 'Cancel' : 'Buy Crypto'}
      </button>

      {showInputs && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Crypto symbol:
              <input
                type="text"
                name="first"
                value={values.first}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              Amount:
              <input
                type="text"
                name="second"
                value={values.second}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <button  type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default TwoValueForm;