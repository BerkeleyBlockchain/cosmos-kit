import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { FaUserCircle } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";

import { ConnectedShowAddress } from "../../components";

const chainNames_1 = ["cosmoshub", "osmosis"];
const chainNames_2 = ["stargaze", "chihuahua"];

export default () => {
  const usernames: (string | undefined)[] = [];
  const walletNames: (string | undefined)[] = [];
  const statusList: WalletStatus[] = [];
  const connectList: (() => void)[] = [];
  const disconnectList: (() => void)[] = [];

  const addressInModal = chainNames_1.map((chainName) => {
    const { chain, openView, username, wallet, status, connect, disconnect } =
      useChain(chainName);
    usernames.push(username);
    walletNames.push(wallet?.prettyName);
    statusList.push(status);
    connectList.push(connect);
    disconnectList.push(disconnect);

    return (
      <HStack spacing="24px" key={chainName}>
        <Heading size="xs" textTransform="uppercase" minW={150}>
          {chain.pretty_name}
        </Heading>
        <Button
          isLoading={status === "Connecting"}
          colorScheme="teal"
          size="sm"
          marginTop={6}
          marginBottom={2}
          onClick={openView}
        >
          View Address
        </Button>
      </HStack>
    );
  });

  const addressOnPage = chainNames_2.map((chainName) => {
    const { chain, username, address, connect, status, disconnect, wallet } =
      useChain(chainName);
    usernames.push(username);
    walletNames.push(wallet?.prettyName);
    statusList.push(status);
    connectList.push(connect);
    disconnectList.push(disconnect);

    return (
      <HStack spacing="24px" key={chainName}>
        <Heading size="xs" textTransform="uppercase" minW={150}>
          {chain.pretty_name}
        </Heading>
        <Box width={"full"} maxW={260}>
          <ConnectedShowAddress
            address={address}
            isLoading={status === "Connecting"}
            isRound={true}
            size={"sm"}
          />
        </Box>
      </HStack>
    );
  });

  const getGlobalButton = () => {
    if (statusList.find((s) => s === "Connecting")) {
      return (
        <Button
          isLoading
          loadingText={`Connecting ${walletNames[0]}`}
          colorScheme="teal"
          size="md"
          marginTop={6}
          marginBottom={2}
        >
          Connect Wallet
        </Button>
      );
    }
    if (statusList.find((s) => s === "Connected")) {
      return (
        <ButtonGroup
          size="md"
          isAttached
          variant="solid"
          marginTop={6}
          marginBottom={2}
        >
          <Button
            leftIcon={<IoWalletOutline />}
            isActive={true}
            variant="outline"
          >
            {walletNames[0]}
          </Button>
          <Button leftIcon={<FaUserCircle />} isActive={true} variant="outline">
            {usernames[0]}
          </Button>
          <Button colorScheme="teal" onClick={() => disconnectList[0]()}>
            Disconnect
          </Button>
        </ButtonGroup>
      );
    }

    return (
      <Button
        isLoading={false}
        loadingText={`Connecting ${walletNames[0]}`}
        colorScheme="teal"
        size="md"
        marginTop={6}
        marginBottom={2}
        onClick={() => connectList[0]()}
      >
        Connect Wallet
      </Button>
    );
  };

  return (
    <SimpleGrid columns={1} spacing={10} maxW={"60%"} marginX="auto">
      <VStack spacing="24px" marginTop={30}>
        <Heading size="lg">ChainProvider Test</Heading>
        {getGlobalButton()}
      </VStack>
      <Card>
        <CardHeader>
          <Heading size="md">Address Card in Modal</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            {addressInModal}
          </Stack>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <Heading size="md">Address Card on Page</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            {addressOnPage}
          </Stack>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};
