/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";

const podcastSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  podcastDate: z
    .string()
    .refine((date) => new Date(date) > new Date(Date.now() - 86400000), {
      message: "Date must be greater than yesterday's date",
    }),
});

type PodcastData = z.infer<typeof podcastSchema>;

const CreatePodcastModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const toast = useToast();
  const [createDisabled, setCreateDisabled] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<PodcastData>({
    resolver: zodResolver(podcastSchema),
  });

  const ctx = api.useContext();

  const { mutate, isLoading: isCreating } = api.podcast.create.useMutation({
    onSuccess: async () => {
      toast({
        title: "Successfully created new podcast",
        status: "success",
        duration: 3000,
      });
      await ctx.podcast.getAll.invalidate();
      onClose();
    },
    onError: (e) => {
      toast({
        title: "Failed creating new podcast",
        status: "error",
        description: e.message,
        duration: 5000,
      });
    },
  });

  const handleNewPodcastSubmit = (data: {
    title: string;
    podcastDate: string;
    description?: string | undefined;
  }) => {
    mutate(data);
  };

  useEffect(() => {
    if (
      !watch("podcastDate") ||
      !watch("title") ||
      watch("title") === "" ||
      Object.keys(errors).length > 0
    )
      setCreateDisabled(true);
    else setCreateDisabled(false);
  }, [watch()]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(handleNewPodcastSubmit)}>
        <ModalHeader>Create New Podcast</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.title}>
              <FormLabel>Title</FormLabel>
              <Input
                {...register("title")}
                onBlur={() => void trigger("title")}
                placeholder="Podcast title"
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>Description (optional)</FormLabel>
              <Input
                {...register("description")}
                placeholder="Podcast description"
              />
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.podcastDate}>
              <FormLabel>Date</FormLabel>
              <Input
                {...register("podcastDate")}
                onBlur={() => void trigger("podcastDate")}
                onChange={(e) => {
                  setValue("podcastDate", e.target.value);
                  void trigger("podcastDate");
                }}
                type="date"
              />
              <FormErrorMessage>{errors.podcastDate?.message}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={isCreating}
            isDisabled={createDisabled}
            colorScheme="blue"
            type="submit"
          >
            Create Podcast
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreatePodcastModal;
