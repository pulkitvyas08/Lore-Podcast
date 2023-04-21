import { Flex } from "@chakra-ui/react";
import React, { type PropsWithChildren } from "react";
import Navbar from "./Layout/Navbar";

type MainLayoutProps = {
  children: any;
};

const MainLayout: React.FC<PropsWithChildren<MainLayoutProps>> = ({
  children,
}) => {
  return (
    <Flex width="100%" direction="column">
      <Navbar />
      <Flex width="100%" marginTop="60px">
        {children}
      </Flex>
    </Flex>
  );
};
export default MainLayout;
