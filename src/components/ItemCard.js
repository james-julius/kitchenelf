import { Text, Link, useToast, useDisclosure, PopoverHeader, Card, CardHeader, Heading, Image, Popover, PopoverTrigger, PopoverArrow, PopoverContent, PopoverBody, Button, Box } from '@chakra-ui/react'

import axios from 'axios';

const ItemCard = ({ item, onClick, ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleConfirm = async () => {
    const discordUrl = localStorage.getItem('webhookURL')
    // console.log('webhookURL',discordUrl);

    const itemToOrder = item.fields.name;
    try {
      await axios.post(discordUrl, { content: `${itemToOrder}` });
      console.log('Ordering:',itemToOrder);
      toast({
        title: "Order successful",
        description: `I sent ${itemToOrder} to the discord channel`,
        status: "success",
        duration: 3000,
      })
      // setLastOrdered(new Date().toLocaleDateString());
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        duration: 7000,
      })
    }
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Card cursor="pointer" maxWidth="400px" display="flex" flexDirection="column" borderRadius="lg" overflow="clip" minH="300px">
          <Box h="80%" w="full" display="flex" justifyContent="center" alignItems="center">
            <Image src={item.fields.image} objectPosition="center" h="full" objectFit="cover" flexGrow={1}/>
          </Box>
          <Box h="20%">
            <CardHeader borderTop="1px solid lightgray" p={2}>
              <Heading size={{
                base: 'sm',
                lg: 'md'
              }}>{item.fields.name}</Heading>
              <Text fontSize="xs" mt={1}>
                Photo by <Link href={`https://unsplash.com/@${item.fields.photographer_username}?utm_source=your_app_name&utm_medium=referral`} isExternal>{item.fields.photographer_name}</Link> on <Link href="https://unsplash.com/?utm_source=your_app_name&utm_medium=referral" isExternal>Unsplash</Link>
              </Text>
            </CardHeader>
          </Box>
        </Card>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>Hi, I'm the Kitchen Elf!</PopoverHeader>
        <PopoverBody m={2}>
          <p>Are you sure you want to order {item.fields.name}?</p>
          <Button
            m={2}
            bgColor="green"
            color="white"
            onClick={() => {
                handleConfirm();
                onClose();
              }
            }
          >Yes</Button>
          <Button
            m={2}
            bgColor="red"
            color="white"
            onClick={onClose}
            >No</Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ItemCard;
