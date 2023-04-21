import {
  Flex,
  Heading,
  Checkbox,
  Input,
  Text,
  Button,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import FullPageLoading from "~/components/FullPageLoading";
import FullPageFetchError from "~/components/FullPageFetchError";
import { CheckIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { debounce } from "lodash";
import Head from "next/head";

const Podcast = () => {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  const [addingTopic, setAddingTopic] = useState(false);
  const [topicContent, setTopicContent] = useState("");

  const { colorMode } = useColorMode();

  const { data, isLoading } = api.podcast.getById.useQuery({ id: String(id) });

  const ctx = api.useContext();
  const { mutate, isLoading: isMutating } = api.topic.create.useMutation({
    onSuccess: async () => {
      toast({
        title: "Successfully added new topic",
        status: "success",
        duration: 2000,
      });
      setTopicContent("");
      setAddingTopic(false);
      await ctx.podcast.getById.invalidate();
      await ctx.podcast.getAll.invalidate();
    },
    onError: (e) => {
      toast({
        title: "Failed adding new topic",
        description: e.message,
        duration: 5000,
        status: "error",
      });
    },
  });

  const { mutate: updateTopic, isLoading: topicUpdating } =
    api.topic.updateItem.useMutation({
      onSuccess: async () => {
        toast({
          title: "Successfully updated topic",
          status: "success",
          duration: 2000,
        });
        await ctx.topic.getById.invalidate();
        await ctx.podcast.getById.invalidate();
      },
      onError: (e) => {
        toast({
          title: "Failed updating topic",
          description: e.message,
          status: "error",
          duration: 5000,
        });
      },
    });

  const addNewTopic = () => {
    mutate({ podcastId: String(id), content: topicContent });
  };

  const handleCheckboxChange = debounce((isChecked: boolean, id: string) => {
    updateTopic({ isCompleted: isChecked, itemId: id });
  }, 1000);

  const onCheckboxChange = (
    e: { target: { checked: boolean } },
    id: string
  ) => {
    handleCheckboxChange(e.target.checked, id);
  };

  const deleteTopic = async (topicId: string) => {
    updateTopic({ itemId: topicId, deleted: true });
    await ctx.podcast.getById.invalidate();
  };

  useEffect(() => {
    if (topicUpdating)
      toast({
        title: "Updating topics...",
        status: "loading",
      });
  }, [topicUpdating]);

  if (isLoading) return <FullPageLoading />;

  if (!isLoading && !data) return <FullPageFetchError />;

  return (
    <>
      <Head>
        <title>{data.podcast.title ?? "Podcast"}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        rowGap="15px"
      >
        <Heading>{data.podcast.title}</Heading>
        {data?.topics?.length === 0 && <Text>No topics added yet...</Text>}
        <Button isLoading={isMutating} onClick={() => setAddingTopic(true)}>
          Add a new Topic
        </Button>
        {addingTopic && (
          <Flex alignItems="center" columnGap="5px">
            <Input
              type="text"
              placeholder="What's the gupp?"
              onChange={(e) => setTopicContent(e.target.value)}
            />
            <Flex
              pointerEvents={topicContent === "" ? "none" : "all"}
              bgColor={topicContent === "" ? "#28283a2a" : "transparent"}
              cursor={topicContent === "" ? "not-allowed" : "pointer"}
              border="1px solid"
              borderRadius="md"
              padding="7px"
              borderColor={
                topicContent === "" && colorMode === "dark"
                  ? "red.200"
                  : colorMode === "dark"
                  ? "gray.600"
                  : "gray.200"
              }
              _hover={{ borderColor: "#999" }}
              onClick={addNewTopic}
              justifyContent="center"
              alignItems="center"
              width="40px"
              height="40px"
            >
              <CheckIcon
                color={topicContent === "" ? "red.200" : "green.500"}
                fontSize="12px"
              />
            </Flex>
            <Flex
              border="1px solid"
              borderRadius="md"
              cursor="pointer"
              padding="7px"
              onClick={() => setAddingTopic(false)}
              borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
              _hover={{ borderColor: "#999" }}
              justifyContent="center"
              alignItems="center"
              width="40px"
              height="40px"
            >
              <CloseIcon fontSize="10px" />
            </Flex>
          </Flex>
        )}
        <Flex mt="15px" rowGap="15px" direction="column">
          {data.topics.map((topic) => (
            <Flex alignItems="center" key={topic.id} columnGap="15px">
              <Checkbox
                onChange={(e) => onCheckboxChange(e, topic.id)}
                isChecked={topic.isCompleted}
                size="lg"
              >
                <Text as={topic.isCompleted ? "s" : "p"}>{topic.content}</Text>
              </Checkbox>
              <Flex
                border="1px solid"
                borderRadius="md"
                cursor="pointer"
                padding="5px"
                borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
                _hover={{ borderColor: "#999" }}
                justifyContent="center"
                alignItems="center"
                width="30px"
                height="30px"
                onClick={() => void deleteTopic(topic.id)}
              >
                <DeleteIcon fontSize="12px" />
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </>
  );
};

export default Podcast;
