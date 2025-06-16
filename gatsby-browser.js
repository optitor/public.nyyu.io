import "./src/utilities/forceCurrencyLoader";
import "./src/styles/fonts.css";
import "./src/styles/sass/app.scss";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "react-tabs/style/react-tabs.css";
import "rc-slider/assets/index.css";

// Configure dayjs BEFORE any components load
import "./src/utilities/dayjs-config";

export { wrapRootElement } from "./src/providers/wrap-with-provider";

// Modern way to handle consent for Google Analytics
export const onClientEntry = () => {
    // Initialize Google Analytics with consent mode
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("consent", "default", {
            analytics_storage: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
            wait_for_update: 500,
        });
    }
};
