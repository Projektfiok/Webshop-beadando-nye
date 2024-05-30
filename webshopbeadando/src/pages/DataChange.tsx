import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthValid from '../auth/useAuthValid';
import '../components/css/DataChange.css';

interface User {
  firstName: string;
  lastName: string;
  shippingAddress: Address;
  billingAddress: Address;
}

interface Address {
  name: string;
  country: string;
  city: string;
  street: string;
  zip: string;
  phoneNumber?: string;
}

const ProfileChange: React.FC = () => {
  useAuthValid();
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    firstName: '',
    lastName: '',
    shippingAddress: {
      name: '',
      country: '',
      city: '',
      street: '',
      zip: '',
      phoneNumber: ''
    },
    billingAddress: {
      name: '',
      country: '',
      city: '',
      street: '',
      zip: ''
    }
  });

  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/bejelentkezés');
          return;
        }

        if (!response.ok) {
          throw new Error('Nem sikerült a felhasználói adatok lekérése');
        }

        const data: User = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Lekérési hiba:', err);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    addressType: 'shippingAddress' | 'billingAddress'
  ) => {
    const { name, value } = e.target;
    let error: string = '';

    if (name === 'phoneNumber') {
      const startsWithPlus: RegExp = /^\+/;
      if (!startsWithPlus.test(value)) {
        error = "Helytelen telefonszám formátum. A telefonszámnak '+' jellel kell kezdődnie.";
      }
    }

    setUser(prevState => ({
      ...prevState,
      [addressType]: {
        ...prevState[addressType],
        [name]: value
      }
    }));
    setError(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isAddressValid = (address: Address) => {
      return address.name && address.country && address.city && address.street && address.zip;
    };

    if (!user.firstName || !user.lastName || !isAddressValid(user.shippingAddress) || !isAddressValid(user.billingAddress)) {
      setError('Minden mező kitöltése kötelező!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(user)
      });

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/bejelentkezés');
        return;
      }

      if (response.status === 400) {
        setError('Helytelen bevitt adat');
        return;
      }

      if (!response.ok) {
        throw new Error('Módosítási hiba');
      }

      const data: User = await response.json();
      setUser(data);
      setError('');
      navigate('/profil');
    } catch (err) {
      console.error('Módosítási hiba:', err);
      setError('Nem sikerült módosítani az adatokat');
    }
  };

  return (
    <div className='background'>
      <div className="profile-change-container">
        <h1>Adatmódosítás</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Vezetéknév:
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Keresztnév:
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <h2>Szállítási cím</h2>
            <label>
              Név:
              <input
                type="text"
                name="name"
                value={user.shippingAddress.name}
                onChange={e => handleAddressChange(e, 'shippingAddress')}
              />
            </label>
            <label>
              Ország:
              <input
                type="text"
                name="country"
                value={user.shippingAddress.country}
                onChange={e => handleAddressChange(e, 'shippingAddress')}
              />
            </label>
            <label>
              Város:
              <input
                type="text"
                name="city"
                value={user.shippingAddress.city}
                onChange={e => handleAddressChange(e, 'shippingAddress')}
              />
            </label>
            <label>
              Utca:
              <input
                type="text"
                name="street"
                value={user.shippingAddress.street}
                onChange={e => handleAddressChange(e, 'shippingAddress')}
              />
            </label>
            <label>
              Irányítószám:
              <input
                type="text"
                name="zip"
                value={user.shippingAddress.zip}
                onChange={e => handleAddressChange(e, 'shippingAddress')}
              />
            </label>
            <label>
              Telefonszám:
              <input
                type="text"
                name="phoneNumber"
                value={user.shippingAddress.phoneNumber}
                onChange={e => handleAddressChange(e, 'shippingAddress')}
              />
            </label>
          </div>
          <div>
            <h2>Számlázási cím</h2>
            <label>
              Név:
              <input
                type="text"
                name="name"
                value={user.billingAddress.name}
                onChange={e => handleAddressChange(e, 'billingAddress')}
              />
            </label>
            <label>
              Ország:
              <input
                type="text"
                name="country"
                value={user.billingAddress.country}
                onChange={e => handleAddressChange(e, 'billingAddress')}
              />
            </label>
            <label>
              Város:
              <input
                type="text"
                name="city"
                value={user.billingAddress.city}
                onChange={e => handleAddressChange(e, 'billingAddress')}
              />
            </label>
            <label>
              Utca:
              <input
                type="text"
                name="street"
                value={user.billingAddress.street}
                onChange={e => handleAddressChange(e, 'billingAddress')}
              />
            </label>
            <label>
              Irányítószám:
              <input
                type="text"
                name="zip"
                value={user.billingAddress.zip}
                onChange={e => handleAddressChange(e, 'billingAddress')}
              />
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Mentés</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileChange;
