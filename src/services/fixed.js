import { useState } from "react";

export const useFixedIps = () => {
    
    const API_HUDEN = "https://hudenback.onrender.com";
    const [isLoading, setIsLoading] = useState(false);
    const GetFixed = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_HUDEN}/fixedData`, {
            });

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch fixed data. Response status: " + response.status
                );
            }
            const fixedData = await response.json();
            setIsLoading(false);
            return fixedData;
        } catch (error) {
            setIsLoading(false);
            console.error("Error fetching users:", error);
            throw new Error("Error fetching users");
        }
    };

    const UpdateFixed = async (body, token) => {
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
            const response = await fetch(`${API_HUDEN}/fixedData`, payload);
            const data = await response.json();
            setIsLoading(false);
            return data;
        } catch (error) {
            setIsLoading(false);
            throw new Error(error);
        }
    };

    const GetIps = async (token) => {
        setIsLoading(true);
        const payload = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Agregar el token de autorización aquí
            },
        };
        try {
            const response = await fetch(`${API_HUDEN}/ips`, payload);
            const data = await response.json();
            setIsLoading(false);
            return [data, response.status];
        } catch (error) {
            setIsLoading(false);
            throw new Error(error);
        }
    };

    const UpdateIps = async (code, token, body) => {
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
            const response = await fetch(`${API_HUDEN}/ips/${code}`, payload);
            const data = await response.json();
            setIsLoading(false);
            return data;
        } catch (error) {
            setIsLoading(false);
            throw new Error(error);
        }
    };

    const postIp = async (newRegister, token) => {
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
            const response = await fetch(`${API_HUDEN}/ips`, payload);
            const data = await response.json();
            setIsLoading(false);
            return data;
        } catch (error) {
            setIsLoading(false);
            throw new Error(error);
        }
    };

    const GetPercents = async (token) => {
        setIsLoading(true);
        const payload = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Agregar el token de autorización aquí
            },
        };
        try {
            const response = await fetch(`${API_HUDEN}/percentAdjust`, payload);
            const data = await response.json();
            setIsLoading(false);
            return [data, response.status];
        } catch (error) {
            setIsLoading(false);
            throw new Error(error);
        }
    };

    const UpdatePercents = async (asset, token, body) => {
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
            const response = await fetch(`${API_HUDEN}/percentAdjust/${asset}`, payload);
            const data = await response.json();
            setIsLoading(false);
            return data;
        } catch (error) {
            setIsLoading(false);
            throw new Error(error);
        }
    };

    const postPercent = async (newRegister, token) => {
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
            console.log(payload)
            const response = await fetch(`${API_HUDEN}/percentAdjust`, payload);
            const data = await response.json();
            setIsLoading(false);
            return data;
        } catch (error) {
            setIsLoading(false);
            throw new Error(error);
        }
    };

    return {
        GetFixed,
        UpdateFixed,
        GetIps,
        UpdateIps,
        postIp,
        GetPercents,
        UpdatePercents,
        postPercent,
        isLoading
    };
}