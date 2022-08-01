import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import { MoralisProvider } from "react-moralis";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

const Application = () => {
    const isServerInfo = APP_ID && SERVER_URL ? true : false;
    //Validate
    if (!APP_ID || !SERVER_URL)
        throw new Error(
            "Missing Moralis Application ID or Server URL. Make sure to set your .env file."
        );
    if (isServerInfo)
        return (
            <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
                <App />
            </MoralisProvider>
        );
    else {
        return <div style={{ display: "flex", justifyContent: "center" }}>Moralis Init Error</div>;
    }
};

root.render(
    <React.StrictMode>
        <ColorModeScript />
        <Application />,
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
