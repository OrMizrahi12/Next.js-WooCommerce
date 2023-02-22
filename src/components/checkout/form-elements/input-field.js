const { default: Error } = require("../errors")
const { default: Abbr } = require("./abbr")
import PropTypes from 'prop-types'

const InputField = ({
    handleOnChange,
    inputValue,
    name,
    type,
    label,
    errors,
    placeholder,
    required,
    containerClassNames,
    isShipping
}) => {
    const inputId = `${name}--${isShipping ? 'shipping' : ''}`

     
    return (
        <div className={containerClassNames}>
           
            <label htmlFor={inputId}> {label || ''} <Abbr required={required} /> </label>
            <br />
            <input 
             className='input-cheackOut' 
             type={type}
             onChange={handleOnChange}
            //  value={inputValue}
             name={name}
             placeholder={placeholder}
             id={inputId}
             

            />
            <Error errors={errors} fieldName={name} />
        </div>
    )
}

InputField.propTypes = {
	handleOnChange: PropTypes.func,
	inputValue: PropTypes.string,
	name: PropTypes.string,
	type: PropTypes.string,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	errors: PropTypes.object,
	required: PropTypes.bool,
	containerClassNames: PropTypes.string
}

InputField.defaultProps = {
	handleOnChange: () => null,
	inputValue: '',
	name: '',
	type: 'text',
	label: '',
	placeholder: '',
	errors: {},
	required: false,
	containerClassNames: ''
}



export default InputField;

