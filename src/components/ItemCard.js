// import {  Card, CardHeader, Heading, Image } from '@chakra-ui/react'
import { useToast, useDisclosure, PopoverHeader, Card, CardHeader, Heading, Image, Popover, PopoverTrigger, PopoverArrow, PopoverContent, PopoverBody, Button } from '@chakra-ui/react'

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
        <Card cursor="pointer" maxWidth="400px">
          <Image src={item.fields.image} borderRadius="lg" />
          <CardHeader>
            <Heading size="md">{item.fields.name}</Heading>
          </CardHeader>
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
          onClick={handleConfirm}
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
