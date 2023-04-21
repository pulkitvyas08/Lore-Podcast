import { VStack, Heading, Input, Button, Box } from "@chakra-ui/react";
import { useState } from "react";

const AdminPage = () => {
  const [newGroupName, setNewGroupName] = useState("");
  const [newPodcastDescription, setNewPodcastDescription] = useState("");

  const handleGroupNameSubmit = () => {
    // Submit new group name to the server
  };

  const handleNewPodcastSubmit = () => {
    // Submit new podcast to the server
  };

  return (
    <VStack spacing={8}>
      <Heading>Admin Page</Heading>
      <Box>
        <VStack spacing={4}>
          <Heading size="md">Change Group Name</Heading>
          <Input
            placeholder="New group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <Button onClick={handleGroupNameSubmit}>Submit</Button>
        </VStack>
      </Box>
      <Box>
        <VStack spacing={4}>
          <Heading size="md">Add New Podcast</Heading>
          <Input
            placeholder="Podcast title"
            value={newPodcastTitle}
            onChange={(e) => setNewPodcastTitle(e.target.value)}
          />
          <Input
            placeholder="Podcast description"
            value={newPodcastDescription}
            onChange={(e) => setNewPodcastDescription(e.target.value)}
          />
          <Button onClick={handleNewPodcastSubmit}>Submit</Button>
        </VStack>
      </Box>
    </VStack>
  );
};

export default AdminPage;
