import { Flex } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

const PageLayout = (props: any) => {
    return (
        <Flex direction="column" align="center" minH="100vh" m="0 auto">
            {/* @ts-ignore */}
            <Navbar chains={props.chains} />
            {props.children}
        </Flex>
    );
};

export default PageLayout;
