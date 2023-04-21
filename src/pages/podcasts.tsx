import {
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import CreatePodcastModal from "~/components/CreatePodcastModal";
import FullPageFetchError from "~/components/FullPageFetchError";
import FullPageLoading from "~/components/FullPageLoading";
import { api } from "~/utils/api";
import React from "react";
import { useRouter } from "next/router";

const Podcasts: React.FC = () => {
  const router = useRouter();
  const { data: podcasts, isLoading } = api.podcast.getAll.useQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { colorMode } = useColorMode();

  if (isLoading) return <FullPageLoading />;

  if (!isLoading && !podcasts) return <FullPageFetchError />;

  return (
    <VStack
      width="100%"
      spacing={4}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Heading fontWeight="semibold">Podcasts</Heading>
      <Button onClick={onOpen} fontWeight="semibold">
        + Create
      </Button>
      {podcasts && podcasts.length === 0 && (
        <Flex
          alignItems="center"
          justifyContent="center"
          width="100%"
          textAlign="center"
        >
          No podcasts to show!
        </Flex>
      )}
      <Flex direction="column" rowGap="10px">
        {podcasts.map((podcast) => (
          <Flex
            onClick={() => void router.push(`/podcast/${podcast.id}`)}
            border="1px solid"
            borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
            p="15px"
            borderRadius="lg"
            key={podcast.id}
            justifyContent="space-between"
            cursor="pointer"
            width={{ base: "250px", md: "400px" }}
            boxShadow="0 2px 4px rgba(133, 133, 133, 0.4)"
            transition="transform 0.2s ease-in-out"
            _hover={{ transform: "scale(1.01)" }}
          >
            <Text>{podcast.title}</Text>
            <Text>{dayjs(podcast.createdAt).format("DD MMM YYYY")}</Text>
          </Flex>
        ))}
      </Flex>
      <CreatePodcastModal isOpen={isOpen} onClose={onClose} />
    </VStack>
  );
};

export default Podcasts;
