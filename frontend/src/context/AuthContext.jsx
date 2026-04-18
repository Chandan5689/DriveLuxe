import { useCallback, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/react";
import { AuthContext } from "./authContextValue";
import { API_ENDPOINTS } from "../config/api";

export const AuthProvider = ({children}) => {
    const { isLoaded: isAuthLoaded, isSignedIn, getToken, signOut } = useAuth();
    const { user } = useUser();
    const lastSyncedPayloadRef = useRef(null);
    const isSyncingRef = useRef(false);

    const login = () => {
        // Clerk handles login via SignIn / SignUp components.
    };

    const getAuthToken = useCallback(async () => {
        if (!isSignedIn) {
            return null;
        }
        return getToken();
    }, [getToken, isSignedIn]);

    const logout = useCallback(async () => {
        await signOut({ redirectUrl: '/' });
    }, [signOut]);

    const username = user?.username || user?.fullName || user?.firstName || null;
    const userEmail = user?.primaryEmailAddress?.emailAddress || null;
    const userId = user?.id || null;
    const syncEmail = user?.primaryEmailAddress?.emailAddress || "";
    const syncUsername = user?.username || (syncEmail.includes("@") ? syncEmail.split("@", 1)[0] : "");
    const syncFirstName = user?.firstName || "";
    const syncLastName = user?.lastName || "";
    const syncPayloadKey = `${userId || ""}|${syncUsername}|${syncEmail}|${syncFirstName}|${syncLastName}`;

    useEffect(() => {
        if (!isAuthLoaded) {
            return;
        }

        if (!isSignedIn || !userId) {
            lastSyncedPayloadRef.current = null;
            return;
        }

        if (!syncUsername && !syncEmail && !syncFirstName && !syncLastName) {
            return;
        }

        if (lastSyncedPayloadRef.current === syncPayloadKey || isSyncingRef.current) {
            return;
        }

        const syncUser = async () => {
            isSyncingRef.current = true;

            try {
                const token = await getToken();
                if (!token) {
                    return;
                }

                const response = await fetch(API_ENDPOINTS.AUTH_SYNC, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        username: syncUsername,
                        email: syncEmail,
                        first_name: syncFirstName,
                        last_name: syncLastName,
                    }),
                });

                if (response.ok) {
                    lastSyncedPayloadRef.current = syncPayloadKey;
                }
            } catch (error) {
                console.error("Failed to sync authenticated user to backend:", error);
            } finally {
                isSyncingRef.current = false;
            }
        };

        syncUser();
    }, [
        getToken,
        isAuthLoaded,
        isSignedIn,
        syncEmail,
        syncFirstName,
        syncLastName,
        syncPayloadKey,
        syncUsername,
        userId,
    ]);

    const authContextValue = {
        authToken: null,
        userId,
        username,
        userEmail,
        isAuthLoaded,
        isAuthenticated: !!isSignedIn,
        getAuthToken,
        login,
        logout,
    };

    return(
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    )
}