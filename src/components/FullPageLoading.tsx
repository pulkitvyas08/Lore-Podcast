import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";

const FullPageLoading: React.FC = () => {
  return (
    <Flex mt="20%" width="100%" justifyContent="center" alignItems="center">
      <Spinner />
    </Flex>
  );
};
export default FullPageLoading;
