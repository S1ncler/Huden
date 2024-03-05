import { useState } from "react";
import { useAuthContext } from "../Hooks/useAuthContext";
import { jwtDecode } from "jwt-decode";



export const useUsers = () => {
  const API_URL = "./src/jsons/users.json";
  const API_HUDEN = "https://hudenback.onrender.com";
  const [isLoading, setIsLoading] = useState(false);

  const listAllUsers = async (token) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_HUDEN}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          "Failed to fetch users. Response status: " + response.status
        );
      }
      const users = await response.json();
      setIsLoading(false);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
      throw new Error("Error fetching users");
    }
  };

  const getUser = async (id, token) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = await response.json();
      setIsLoading(false);
      return user;
    } catch (error) {
      setIsLoading(false);
      throw new Error(error);
    }
  };

  const newUser = async (newRegister, token) => {
    setIsLoading(true);
    try {
      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token de autorización aquí
        },
        body: JSON.stringify(newRegister),
      };
      const response = await fetch(`${API_HUDEN}/auth/register`, payload);
      const data = await response.json();
      setIsLoading(false);
      return [data, response.status];
    } catch (error) {
      setIsLoading(false);
      throw new Error(error);
    }
  };

  const updateUser = async (email, token, body) => {
    setIsLoading(true);
    // descomentar cuándo se conecte con el back
    const payload = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agregar el token de autorización aquí
      },
      body: JSON.stringify(body),
    };
    try {
      const response = await fetch(`${API_HUDEN}/users/${email}`, payload);
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  const { dispatch } = useAuthContext();
  const login = async (user) => {
    setIsLoading(true);
    try {
      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      };
      const response = await fetch(`${API_HUDEN}/auth/login`, payload);
      const data = await response.json();
      if (data.msg !== 'INCORRECT_USER_DATA' && data.msg !== 'NOT_REGISTERED_IP' && data.msg !== 'NOT_VALID_IP') {
        const decoded = jwtDecode(`'${data.msg.token}'`);
        dispatch({ type: "LOGIN", payload: { data, decoded, user } });
        localStorage.setItem("user", JSON.stringify({ data, decoded }));
        localStorage.setItem("token", data.msg.token);
      }
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      throw new Error(error);
    }
  };

  return {
    login,
    updateUser,
    newUser,
    getUser,
    listAllUsers,
    isLoading
  };
};