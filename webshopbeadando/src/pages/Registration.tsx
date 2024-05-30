import React, { useState, useEffect } from "react";
import "../components/css/regis.css";
import SuccessMessage from "../components/SuccessMessage";

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    shippingAddress: {
      name: "",
      country: "",
      city: "",
      street: "",
      zip: "",
      phoneNumber: "",
    },
    billingAddress: {
      name: "",
      country: "",
      city: "",
      street: "",
      zip: "",
      taxNumber: "",
    },
  });

  const [sameAddress, setSameAddress] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    submitError: "",
    username: "",
    password: "",
    passwordConfirm: "",
    lastName: "",
    firstName: "",
    phoneNumber: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const handleReset = () => {
    setFormData({
      username: "",
      password: "",
      passwordConfirm: "",
      firstName: "",
      lastName: "",
      shippingAddress: {
        name: "",
        country: "",
        city: "",
        street: "",
        zip: "",
        phoneNumber: "",
      },
      billingAddress: {
        name: "",
        country: "",
        city: "",
        street: "",
        zip: "",
        taxNumber: "",
      },
    });
    setSameAddress(false);
    setErrorMessages({
      submitError: "",
      username: "",
      password: "",
      passwordConfirm: "",
      lastName: "",
      firstName: "",
      phoneNumber: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, dataset } = e.target;
    const addressType = dataset.addressType;

    let errorMsg = "";

    switch (name) {
      case "username":
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(value)) {
          errorMsg = "Helytelen felhasználónév";
        }
        break;
      case "password":
        if (value.length < 8 || !/[a-z]/.test(value) || !/\d/.test(value)) {
          errorMsg = "Jelszó minimum 8 karakter hosszú lehet, valamint tartalmaznia kell egy kisbetűt és számot";
        }
        break;
      case "passwordConfirm":
        if (value !== formData.password) {
          errorMsg = "Nem egyezik a jelszó";
        }
        break;
      case "lastName":
        errorMsg = value.trim() === "" ? "A vezetéknév nem lehet üres" : "";
        break;
      case "firstName":
        errorMsg = value.trim() === "" ? "A keresztnév nem lehet üres" : "";
        break;
      case "phoneNumber":
        const phonePattern = /^\+[0-9]{10,14}$/;
        if (!phonePattern.test(value)) {
          errorMsg = "Helytelen telefonszám (Használja a +36 formátumot)";
        }
        break;
      default:
        break;
    }

    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    if (name === "sameAddress") {
      setSameAddress(checked);
    } else {
      switch (addressType) {
        case "shippingAddress":
        case "billingAddress":
          setFormData((prevState) => ({
            ...prevState,
            [addressType]: {
              ...prevState[addressType],
              [name]: value,
            },
          }));
          break;
        default:
          setFormData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
          }));
          break;
      }
    }
  };

  useEffect(() => {
    if (sameAddress) {
      setFormData((prevState) => ({
        ...prevState,
        billingAddress: {
          ...prevState.billingAddress,
          ...prevState.shippingAddress,
        },
      }));
    }
  }, [sameAddress]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      ['submitError']: '',
    }));

    const hasError = Object.values(errorMessages).some(
      (errorMsg) => errorMsg !== ""
    );

    if (hasError) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let errorMsg = '';

      if (response.ok) { 
        setShowSuccessMessage(true);
        handleReset();
      } else {
        if (response.status == 400) {
          errorMsg = 'A bevitt adatok érvénytelenek';
          setErrorMessages((prevErrors) => ({
            ...prevErrors,
            ['submitError']: errorMsg,
          }));
        } else if (response.status == 409) {
          errorMsg = 'A felhasználó már létezik';
          setErrorMessages((prevErrors) => ({
            ...prevErrors,
            ['submitError']: errorMsg,
          }));
        }
      }
    } catch (error) {
      
    }
  };

  return (
    <div className="costume-bg">
      <div className="registration-container">
        <h2>Regisztráció</h2>
        {errorMessages.submitError && (
              <p className="error-message">{errorMessages.submitError}</p>
            )}
        <form
          className="registration-form"
          onSubmit={handleSubmit}
          onReset={handleReset}
        >
          <div className="basic-info">
            <label htmlFor="username">Felhasználónév:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleChange}
              required
              autoComplete="username"
            />
            {errorMessages.username && (
              <p className="error-message">{errorMessages.username}</p>
            )}

            <label htmlFor="password">Jelszó:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleChange}
              required
              autoComplete="new-password"
            />
            {errorMessages.password && (
              <p className="error-message">{errorMessages.password}</p>
            )}

            <label htmlFor="passwordConfirm">Jelszó megerősítése:</label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              onBlur={handleChange}
              required
              autoComplete="current-password"
            />
            {errorMessages.passwordConfirm && (
              <p className="error-message">{errorMessages.passwordConfirm}</p>
            )}

            <label htmlFor="lastName">Vezetéknév:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleChange}
              required
            />
            {errorMessages.lastName && (
              <p className="error-message">{errorMessages.lastName}</p>
            )}

            <label htmlFor="firstName">Keresztnév:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleChange}
              required
            />
            {errorMessages.firstName && (
              <p className="error-message">{errorMessages.firstName}</p>
            )}
          </div>

          <div className="shipping-info">
            <h3>Szállítási cím</h3>
            <label htmlFor="shippingName">Név:</label>
            <input
              type="text"
              name="name"
              data-address-type="shippingAddress"
              value={formData.shippingAddress.name}
              onChange={handleChange}
              onBlur={handleChange}
              required
            />
            <label htmlFor="shippingCountry">Ország:</label>
            <input
              type="text"
              name="country"
              data-address-type="shippingAddress"
              value={formData.shippingAddress.country}
              onChange={handleChange}
              onBlur={handleChange}
              required
            />
            <label htmlFor="shippingCity">Város:</label>
            <input
              type="text"
              name="city"
              data-address-type="shippingAddress"
              value={formData.shippingAddress.city}
              onChange={handleChange}
              onBlur={handleChange}
              required
            />
            <label htmlFor="shippingStreet">Utca:</label>
            <input
              type="text"
              name="street"
              data-address-type="shippingAddress"
              value={formData.shippingAddress.street}
              onChange={handleChange}
              onBlur={handleChange}
              required
            />
            <label htmlFor="shippingZip">Irányítószám:</label>
            <input
              type="text"
              name="zip"
              data-address-type="shippingAddress"
              value={formData.shippingAddress.zip}
              onChange={handleChange}
              onBlur={handleChange}
              required
            />
            <label htmlFor="shippingPhoneNumber">Telefonszám:</label>
            <input
              type="text"
              name="phoneNumber"
              data-address-type="shippingAddress"
              value={formData.shippingAddress.phoneNumber}
              onChange={handleChange}
              onBlur={handleChange}
              required
            />
            {errorMessages.phoneNumber && (
              <p className="error-message">{errorMessages.phoneNumber}</p>
            )}
          </div>

          <label>
            A számlázási cím megegyezik a szállítási címmel
            <input
              type="checkbox"
              name="sameAddress"
              checked={sameAddress}
              onChange={handleChange}
            />
          </label>

          {!sameAddress && (
            <div className="billing-info">
              <h3>Számlázási cím</h3>
              <label htmlFor="billingName">Név:</label>
              <input
                type="text"
                name="name"
                data-address-type="billingAddress"
                value={formData.billingAddress.name}
                onChange={handleChange}
                required
              />
              <label htmlFor="billingCountry">Ország:</label>
              <input
                type="text"
                name="country"
                data-address-type="billingAddress"
                value={formData.billingAddress.country}
                onChange={handleChange}
                required
              />
              <label htmlFor="billingCity">Város:</label>
              <input
                type="text"
                name="city"
                data-address-type="billingAddress"
                value={formData.billingAddress.city}
                onChange={handleChange}
                required
              />
              <label htmlFor="billingStreet">Utca:</label>
              <input
                type="text"
                name="street"
                data-address-type="billingAddress"
                value={formData.billingAddress.street}
                onChange={handleChange}
                required
              />
              <label htmlFor="billingZip">Irányítószám:</label>
              <input
                type="text"
                name="zip"
                data-address-type="billingAddress"
                value={formData.billingAddress.zip}
                onChange={handleChange}
                required
              />
              <label htmlFor="billingTaxNumber">Adószám:</label>
              <input
                type="text"
                name="taxNumber"
                data-address-type="billingAddress"
                value={formData.billingAddress.taxNumber}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="buttons">
            <button type="submit">Regisztráció</button>
            <button type="reset">Mégsem</button>
          </div>

          {showSuccessMessage && (
            <div className="overlay">
              <SuccessMessage onClose={() => setShowSuccessMessage(false)} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;