import { jwtDecode } from "jwt-decode";
import { removeCookie, NDB_Paypal_TrxType, NDB_Privilege } from "./cookies";

let inMemoryAuthTokenDefault = {
    authToken: null,
    authExpiration: null,
};

let inMemoryAuthToken = inMemoryAuthTokenDefault;

// Local Storage Key
export const LOGGED_OUT_KEY = `LOGGED_OUT_TIME`;
export const ACCESS_TOKEN = `ACCESS_TOKEN`;
export const USER_DATA = `USER_DATA`;

// Helper
export const isBrowser = typeof window !== `undefined`;

// TODO: Check if these work as expected
export const isTokenExpired = (authToken) => {
    if (!authToken) return true;
    try {
        const decoded = jwtDecode(authToken);
        return Date.now() >= decoded.exp * 1000;
    } catch (error) {
        console.error("🚨 Error decoding token:", error);
        return true;
    }
};

export const isLoggedOut = () => {
    const loggedOutTime = getLoggedOutTime();
    return loggedOutTime && Date.now() >= loggedOutTime;
};

// Methods
export const logout = (callback) => {
    console.log("🚪 Logging out user");
    inMemoryAuthToken = inMemoryAuthTokenDefault;

    if (isBrowser) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(USER_DATA);
    }

    removeCookie(NDB_Paypal_TrxType);
    removeCookie(NDB_Privilege);
    setLoggedOutTime();

    // Trigger auth state update
    if (isBrowser) {
        window.dispatchEvent(new CustomEvent("authTokenUpdated"));

        // Force update if available
        if (window.forceAuthUpdate) {
            window.forceAuthUpdate();
        }
    }

    if (callback) {
        callback();
    }
};

// Setter
export const setAuthToken = (authToken) => {
    if (!isBrowser || !authToken) return;

    try {
        const decoded = jwtDecode(authToken);
        console.log("🎫 Setting auth token in localStorage and memory");

        localStorage.setItem(ACCESS_TOKEN, authToken);
        inMemoryAuthToken = {
            authToken,
            authExpiration: decoded.exp,
        };

        // Clear any logged out time
        localStorage.removeItem(LOGGED_OUT_KEY);

        // Trigger multiple events to ensure auth state updates
        console.log("🎫 Triggering auth state update events");

        // Use setTimeout to ensure events fire after token is set
        setTimeout(() => {
            // 1. Storage event
            window.dispatchEvent(
                new StorageEvent("storage", {
                    key: ACCESS_TOKEN,
                    newValue: authToken,
                    oldValue: null,
                    storageArea: localStorage,
                }),
            );

            // 2. Custom event
            window.dispatchEvent(
                new CustomEvent("authTokenUpdated", {
                    detail: { token: authToken },
                }),
            );

            // 3. Force update (aggressive approach)
            if (window.forceAuthUpdate) {
                console.log("🎫 Calling force auth update");
                window.forceAuthUpdate();
            }
        }, 10);

        console.log("🎫 Auth token set successfully");
        console.log("🎫 Token expiration:", new Date(decoded.exp * 1000));
    } catch (error) {
        console.error("🚨 Error setting auth token:", error);
    }
};

export const setLoggedOutTime = () => {
    if (!isBrowser) return;
    localStorage.setItem(LOGGED_OUT_KEY, JSON.stringify(Date.now()));
};

const checkInMemoryAuthToken = () => {
    if (!isBrowser) return;
    if (inMemoryAuthToken === inMemoryAuthTokenDefault) {
        const authToken = localStorage.getItem(ACCESS_TOKEN);
        if (!authToken) return;

        try {
            const decoded = jwtDecode(authToken);
            inMemoryAuthToken = {
                authToken,
                authExpiration: decoded.exp,
            };
        } catch (error) {
            console.error("🚨 Error decoding stored token:", error);
            // Remove invalid token
            localStorage.removeItem(ACCESS_TOKEN);
        }
    }
};

// Getter
export const getEmailfromTempToken = (tempToken) => {
    try {
        return jwtDecode(tempToken).sub;
    } catch (error) {
        console.error("🚨 Error decoding temp token:", error);
        return null;
    }
};

export const getInMemoryAuthToken = () => {
    if (!isBrowser) return null;
    checkInMemoryAuthToken();
    return inMemoryAuthToken.authToken;
};

export const getAuthTokenExpiration = () => {
    if (!isBrowser) return null;
    checkInMemoryAuthToken();
    return inMemoryAuthToken.authExpiration;
};

export const getLoggedOutTime = () => {
    if (!isBrowser) return null;
    try {
        return JSON.parse(localStorage.getItem(LOGGED_OUT_KEY));
    } catch (error) {
        console.error("🚨 Error parsing logged out time:", error);
        return null;
    }
};

// Debug helper function to check auth state
export const debugAuthState = () => {
    if (!isBrowser) {
        console.log("🌐 Not in browser environment");
        return;
    }

    console.log("🔍 === AUTH STATE DEBUG ===");
    console.log("🌐 Browser:", isBrowser);
    console.log("📍 Current URL:", window.location.href);
    console.log("📍 Pathname:", window.location.pathname);
    console.log(
        "🎫 localStorage ACCESS_TOKEN:",
        localStorage.getItem("ACCESS_TOKEN") ? "Present" : "Missing",
    );
    console.log(
        "🚪 localStorage LOGGED_OUT_TIME:",
        localStorage.getItem("LOGGED_OUT_TIME"),
    );
    console.log("🍪 All cookies:", document.cookie);

    // Additional auth state debugging
    try {
        const token = getInMemoryAuthToken();
        console.log("🎫 In-memory token:", token ? "Present" : "Missing");
        if (token) {
            console.log("⏰ Token expired:", isTokenExpired(token));
        }
        console.log("🚪 Is logged out:", isLoggedOut());
    } catch (error) {
        console.log("❌ Could not check auth utilities:", error.message);
    }

    console.log("🔍 === END DEBUG ===");
};

// Call this function on page load to debug
if (isBrowser) {
    window.debugAuthState = debugAuthState;
    console.log("🔧 Debug function available: window.debugAuthState()");
}
