import { Box, Flex, Spacer } from "@chakra-ui/react";
import { ConnectButton, darkTheme, midnightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Logo } from "Logo";

const Navbar = ({ chains }: any) => {
    return (
        <Flex p="10">
            <Logo />
            <Spacer />

            <ConnectButton />
        </Flex>
    );
};

export default Navbar;
