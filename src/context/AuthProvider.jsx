import { createContext, useEffect, useState } from "react";
import BaseUrl from "../services/BaseUrl";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
    };

    const getProfile = async (token = accessToken) => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BaseUrl}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await fetch(`${BaseUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Login failed");
            }

            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);

            await getProfile(data.access_token);

            return data;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        const response = await fetch(`${BaseUrl}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Signup failed");
        }

        return data;
    };

    const refreshAccessToken = async () => {
        const currentRefreshToken = localStorage.getItem("refresh_token");

        if (!currentRefreshToken) {
            logout();
            return null;
        }

        try {
            const response = await fetch(`${BaseUrl}/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh_token: currentRefreshToken,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                logout();
                return null;
            }

            localStorage.setItem("access_token", data.access_token);

            return data.access_token;
        } catch (error) {
            console.error("Token refresh error:", error);
            logout();
            return null;
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    const authInfo = {
        user,
        loading,
        login,
        signup,
        logout,
        refreshAccessToken,
        getProfile,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;