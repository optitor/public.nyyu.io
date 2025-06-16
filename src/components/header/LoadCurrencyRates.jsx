import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCurrencyRates } from "../../store/actions/bidAction";

export default function LoadCurrencyRates() {
    const dispatch = useDispatch();
    const currencyRates = useSelector((state) => state.currencyRates);

    const loadRates = useCallback(async () => {
        console.log("🚀 LoadCurrencyRates: Loading currency exchange rates...");

        // Method 1: Try Currency Freaks API (Premium)
        if (process.env.GATSBY_CURRENCY_FREAKS_API_KEY) {
            try {
                console.log(
                    "💰 LoadCurrencyRates: Trying Currency Freaks API...",
                );
                const res = await axios.get(
                    "https://api.currencyfreaks.com/latest",
                    {
                        params: {
                            apikey: process.env.GATSBY_CURRENCY_FREAKS_API_KEY,
                            base: "USD",
                        },
                        timeout: 10000,
                    },
                );

                if (res.data && res.data.rates) {
                    console.log(
                        "✅ LoadCurrencyRates: Currency Freaks success! Loaded",
                        Object.keys(res.data.rates).length,
                        "exchange rates",
                    );
                    console.log(
                        "🇰🇪 LoadCurrencyRates: KES rate:",
                        res.data.rates.KES || "Not available",
                    );
                    dispatch(setCurrencyRates(res.data.rates));
                    return;
                }
            } catch (err) {
                console.error(
                    "❌ LoadCurrencyRates: Currency Freaks failed:",
                    err.message,
                );
            }
        }

        // Method 2: Try ExchangeRate API (Premium)
        if (process.env.GATSBY_EXCHANGE_RATE_API_KEY) {
            try {
                console.log("💰 LoadCurrencyRates: Trying ExchangeRate API...");
                const res = await axios.get(
                    `https://v6.exchangerate-api.com/v6/${process.env.GATSBY_EXCHANGE_RATE_API_KEY}/latest/USD`,
                    { timeout: 10000 },
                );

                if (res.data && res.data.conversion_rates) {
                    console.log(
                        "✅ LoadCurrencyRates: ExchangeRate API success! Loaded",
                        Object.keys(res.data.conversion_rates).length,
                        "exchange rates",
                    );
                    console.log(
                        "🇰🇪 LoadCurrencyRates: KES rate:",
                        res.data.conversion_rates.KES || "Not available",
                    );
                    dispatch(setCurrencyRates(res.data.conversion_rates));
                    return;
                }
            } catch (err) {
                console.error(
                    "❌ LoadCurrencyRates: ExchangeRate API failed:",
                    err.message,
                );
            }
        }

        // Method 3: Try Fixer.io (Premium)
        if (process.env.GATSBY_FIXER_API_KEY) {
            try {
                console.log("💰 LoadCurrencyRates: Trying Fixer.io...");
                const res = await axios.get("https://api.fixer.io/latest", {
                    params: {
                        access_key: process.env.GATSBY_FIXER_API_KEY,
                        base: "USD",
                    },
                    timeout: 10000,
                });

                if (res.data && res.data.rates) {
                    console.log(
                        "✅ LoadCurrencyRates: Fixer.io success! Loaded",
                        Object.keys(res.data.rates).length,
                        "exchange rates",
                    );
                    console.log(
                        "🇰🇪 LoadCurrencyRates: KES rate:",
                        res.data.rates.KES || "Not available",
                    );
                    dispatch(setCurrencyRates(res.data.rates));
                    return;
                }
            } catch (err) {
                console.error(
                    "❌ LoadCurrencyRates: Fixer.io failed:",
                    err.message,
                );
            }
        }

        // Method 4: Try Free APIs (No API Key Required)
        const freeAPIs = [
            "https://api.exchangerate-api.com/v4/latest/USD",
            "https://open.er-api.com/v6/latest/USD",
        ];

        for (const apiUrl of freeAPIs) {
            try {
                console.log("🆓 LoadCurrencyRates: Trying free API:", apiUrl);
                const res = await axios.get(apiUrl, {
                    timeout: 8000,
                    headers: {
                        Accept: "application/json",
                        "User-Agent":
                            "Mozilla/5.0 (compatible; CurrencyConverter/1.0)",
                    },
                });

                if (res.data && res.data.rates) {
                    console.log(
                        "✅ LoadCurrencyRates: Free API success! Loaded",
                        Object.keys(res.data.rates).length,
                        "exchange rates",
                    );
                    console.log(
                        "🇰🇪 LoadCurrencyRates: KES rate:",
                        res.data.rates.KES || "Not available",
                    );
                    dispatch(setCurrencyRates(res.data.rates));
                    return;
                }
            } catch (err) {
                console.error(
                    "❌ LoadCurrencyRates: Free API failed:",
                    err.message,
                );
            }
        }

        // No fallback - when all APIs fail, keep empty rates (USD will be default)
        console.log(
            "⚠️ LoadCurrencyRates: All currency APIs failed - will display values in USD",
        );
        console.log(
            "💵 LoadCurrencyRates: No exchange rates loaded, all values will show in USD",
        );
    }, [dispatch]);

    // Load rates on component mount
    useEffect(() => {
        console.log(
            "🔄 LoadCurrencyRates: Component mounted, loading rates...",
        );
        loadRates();
    }, [loadRates]);

    // Reload rates every 10 minutes (reduced from 30 minutes for better user experience)
    useEffect(() => {
        const interval = setInterval(
            () => {
                console.log(
                    "⏰ LoadCurrencyRates: 10-minute refresh triggered",
                );
                loadRates();
            },
            10 * 60 * 1000,
        ); // 10 minutes

        return () => {
            console.log("🧹 LoadCurrencyRates: Cleaning up interval");
            clearInterval(interval);
        };
    }, [loadRates]);

    // Force reload when currency selection changes and no rates are loaded
    useEffect(() => {
        if (Object.keys(currencyRates || {}).length === 0) {
            console.log(
                "🔄 LoadCurrencyRates: No rates loaded, attempting to fetch...",
            );
            loadRates();
        }
    }, [currencyRates, loadRates]);

    // Don't render anything visible
    return null;
}
