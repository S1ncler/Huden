import { useState } from "react";



export const useProducts = () => {
  const API_URL = "./src/jsons/data.json";
  const API_HUDEN = "https://hudenback.onrender.com";
  const [isLoading, setIsLoading] = useState(false);

  const listAll = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_HUDEN}/assets`);
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch {
      setIsLoading(false);
      throw new Error("Error in fetch products");
    }
  };

  const getOne = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      throw new Error(error);
    }
  };
  const newData = async (newRegister, token) => {
    setIsLoading(true);
    try {
      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRegister),
      };
      const response = await fetch(`${API_HUDEN}/assets`, payload);
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      throw new Error(error);
    }
  };
  const updateByCode = async (code, token, body) => {
    setIsLoading(true);
    const payload = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agregar el token de autorización aquí
      },
      body: JSON.stringify(body),
    };
    try {
      const response = await fetch(`${API_HUDEN}/assets/${code}`, payload);
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      throw new Error(error);
    }
  };

  return {
    listAll,
    getOne,
    newData,
    updateByCode,
    isLoading
  };
}
