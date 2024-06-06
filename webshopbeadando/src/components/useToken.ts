import { useState } from 'react';

const useToken = () => {
  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  const [token, setToken] = useState<string | null>(getToken());

  const saveToken = (userToken: string) => {
    localStorage.setItem('accessToken', userToken);
    setToken(userToken);
  };

  const removeToken = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
  };

  return {
    token,
    setToken: saveToken,
    removeToken
  };
};

export default useToken;
