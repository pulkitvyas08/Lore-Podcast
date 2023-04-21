import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

const FullPageFetchError: React.FC = () => {
  const router = useRouter();

  return (
    <Flex
      textAlign="center"
      mt="20%"
      width="100%"
      direction="column"
      rowGap="15px"
      justifyContent="center"
      alignItems="center"
    >
      <Text fontSize="20px">Error Fetching data</Text>
      <Text>
        Refresh by clicking the button. Contact support if the problem persists
      </Text>
      <Button onClick={() => router.reload()}>Refresh</Button>
    </Flex>
  );
};
export default FullPageFetchError;
