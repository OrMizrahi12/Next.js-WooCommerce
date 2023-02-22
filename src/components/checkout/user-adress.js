const { default: InputField } = require("./form-elements/input-field");
import PropTypes from 'prop-types'
import CountrySelection from './country-selection';
import StatesSelection from './states-selection';


/**
 * 
 * A function that get the user ditails input, events, etc
 * for passing the data and call to inputs 
 * 
 * In other words, this function are create a form with the given ditails. 
 *  
 */
const Adress = ({ input, countries, states, handleOnChange, isFetchingStates, isShipping }) => {
    const { errors } = input || {};

    console.log(countries)

    return (
        <>
            <div className='form-wrapper'>



                <div className='inputs-grid'>
                    <InputField
                        name="firstName"
                        inputValue={input?.firstName}
                        required
                        handleOnChange={handleOnChange}
                        label="First name"
                        errors={errors}
                        isShipping={isShipping}
                    />
                    <InputField
                        name="lastName"
                        inputValue={input?.lastName}
                        required
                        handleOnChange={handleOnChange}
                        label="Last name"
                        errors={errors}
                        isShipping={isShipping}
                    />
                </div>

                <div className='inputs-grid'>
                    <InputField
                        name="company"
                        inputValue={input?.company}
                        handleOnChange={handleOnChange}
                        label="Company Name (Optional)"
                        errors={errors}
                        isShipping={isShipping}
                    />
                    <InputField
                        name="address1"
                        inputValue={input?.address1}
                        required
                        handleOnChange={handleOnChange}
                        label="Street address"
                        errors={errors}
                        isShipping={isShipping}
                    />
                </div>
                <CountrySelection
                    input={input}
                    handleOnChange={handleOnChange}
                    countries={countries}
                    isShipping={isShipping}
                />
                <InputField
                    name="address2"
                    inputValue={input?.address2}
                    handleOnChange={handleOnChange}
                    label="Street address line two"
                    errors={errors}
                    isShipping={isShipping}
                />
                <InputField
                    name="city"
                    required
                    inputValue={input?.city}
                    handleOnChange={handleOnChange}
                    label="Town/City"
                    errors={errors}
                    isShipping={isShipping}
                />
                {/* State */}
                <StatesSelection
                    input={input}
                    handleOnChange={handleOnChange}
                    states={states}
                    isShipping={isShipping}
                    isFetchingStates={isFetchingStates}
                />
                <InputField
                    name="postcode"
                    inputValue={input?.postcode}
                    required
                    handleOnChange={handleOnChange}
                    label="Post code"
                    errors={errors}
                    isShipping={isShipping}
                />
                <InputField
                    name="phone"
                    inputValue={input?.phone}
                    required
                    handleOnChange={handleOnChange}
                    label="Phone"
                    errors={errors}
                    isShipping={isShipping}
                />

                <InputField
                    name="email"
                    type="email"
                    inputValue={input?.email}
                    required
                    handleOnChange={handleOnChange}
                    label="Email"
                    errors={errors}
                    isShipping={isShipping}
                />
            </div>



        </>
    )
}



Adress.propTypes = {
    input: PropTypes.object,
    countries: PropTypes.array,
    handleOnChange: PropTypes.func,
    isFetchingStates: PropTypes.bool,
    isShipping: PropTypes.bool
}

Adress.defaultProps = {
    input: {},
    countries: [],
    handleOnChange: () => null,
    isFetchingStates: false,
    isShipping: false
}



export default Adress; 