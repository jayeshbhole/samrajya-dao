import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageLayout from "layouts/PageLayout";
import Loader from "components/Loader";
import { midnightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";

const { chains, provider, webSocketProvider } = configureChains(
    [chain.polygonMumbai],
    [publicProvider()]
);

const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
});

export const App = () => {
    return (
        <WagmiConfig client={client}>
            <RainbowKitProvider theme={midnightTheme()} chains={chains}>
                <ChakraProvider theme={theme}>
                    <BrowserRouter>
                        <PageLayout chains={chains}>
                            <Routes>
                                <Route path="/">
                                    {paths.map(({ path, component }) => (
                                        <Route
                                            key={path}
                                            path={path}
                                            element={
                                                <React.Suspense fallback={<Loader />}>
                                                    {React.createElement(component)}
                                                </React.Suspense>
                                            }></Route>
                                    ))}
                                </Route>
                            </Routes>
                        </PageLayout>
                    </BrowserRouter>
                </ChakraProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
};

const paths = [
    {
        path: "/",
        component: React.lazy(() => import("./pages/Landing")),
    },
    {
        path: "/Super-Suite",
        component: React.lazy(() => import("./pages/Proposals")),
    },
];
