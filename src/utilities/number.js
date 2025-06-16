import React from "react";
import {
    NumericFormat as NumberFormat,
    PatternFormat,
} from "react-number-format";

// Export the new components with old names for backward compatibility
export { NumberFormat, PatternFormat };
export default NumberFormat;

// Utility functions for number formatting
export const roundNumber = (num, decimals = 2) => {
    if (isNaN(num)) return 0;
    return (
        Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) /
        Math.pow(10, decimals)
    );
};

export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
    if (isNaN(amount)) return "0";
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(amount);
};

export const formatNumber = (num, options = {}) => {
    if (isNaN(num)) return "0";
    const defaultOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    };
    return new Intl.NumberFormat("en-US", {
        ...defaultOptions,
        ...options,
    }).format(num);
};

export const parseNumber = (str) => {
    if (typeof str !== "string") return parseFloat(str) || 0;
    // Remove all non-numeric characters except decimal point and minus sign
    const cleaned = str.replace(/[^\d.-]/g, "");
    return parseFloat(cleaned) || 0;
};

// Add numbers with commas for formatting
export const numberWithCommas = (x) => {
    if (x === null || x === undefined || x === "") return "0";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Pad numbers with leading zeros to specified length
export const numberWithLength = (num, length = 2) => {
    if (num === null || num === undefined) return "00";
    return num.toString().padStart(length, "0");
};

export const renderNumberFormat = (
    value,
    prefix = "",
    suffix = "",
    decimals = 2,
    useThousandSeparator = true,
    color = null,
) => {
    // Handle null, undefined, or invalid values
    if (value === null || value === undefined || value === "" || isNaN(value)) {
        return `${prefix}0${suffix}`;
    }

    // Convert to number and handle decimals
    const numValue = Number(value);
    const formattedValue = numValue.toFixed(decimals);

    // Add thousand separators if requested
    const displayValue = useThousandSeparator
        ? numberWithCommas(formattedValue)
        : formattedValue;

    // Return with prefix and suffix
    const result = `${prefix}${displayValue}${suffix}`;

    return result;
};

// Add sign to numbers (+ or -)
export const numberSign = (num) => {
    if (num === null || num === undefined || num === 0) return "";
    return num >= 0 ? "+" : "";
};

// Format large numbers with K, M, B suffixes
export const numFormatter = (num) => {
    if (num === null || num === undefined) return "0";
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + "K";
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    } else if (num < 900) {
        return num.toString();
    }
    return num.toString();
};

// Format bytes to human readable format
export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    if (bytes === null || bytes === undefined) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Convert seconds to days, hours, minutes, seconds - THIS WAS MISSING!
export const secondsToDhms = (seconds) => {
    if (seconds === null || seconds === undefined || seconds < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return { days: d, hours: h, minutes: m, seconds: s };
};

// Calculate percentage between two numbers
export const calculatePercentage = (part, total) => {
    if (total === 0 || total === null || total === undefined) return 0;
    return ((part / total) * 100).toFixed(2);
};

// Convert currency using exchange rates
export const convertCurrency = (amount, fromRate = 1, toRate = 1) => {
    if (isNaN(amount) || amount === null || amount === undefined) return 0;
    // Convert from source currency to USD, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
};

// Wrapper component for easier migration from v4 to v5
export const NumberFormatCustom = React.forwardRef((props, ref) => {
    const { onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
        />
    );
});
