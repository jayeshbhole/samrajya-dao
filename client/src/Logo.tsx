import * as React from "react";
import {
    chakra,
    keyframes,
    ImageProps,
    forwardRef,
    usePrefersReducedMotion,
} from "@chakra-ui/react";
import logo from "./logo.svg";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Logo = forwardRef<ImageProps, "img">((props, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();

    return <chakra.img src={logo} ref={ref} {...props} />;
});
