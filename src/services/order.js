import { useState } from "react";

export const useOrders = () => {

    const API_HUDEN = "https://hudenback.onrender.com";
    const [isLoadingOrd, setIsLoading] = useState(false);

    const SendOrder = async (body, token) => {
        setIsLoading(true);
        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Agregar el token de autorización aquí
            },
            body: JSON.stringify(body),
        };
        try {
            const response = await fetch(`${API_HUDEN}/orders`, payload);

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

    return {
        SendOrder,
        isLoadingOrd
    };
}