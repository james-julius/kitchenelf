import React, { useState, useEffect, useMemo } from 'react';
import { useToast, useDisclosure, PopoverHeader, Card, CardHeader, Heading, Image, Popover, PopoverTrigger, PopoverArrow, PopoverContent, PopoverBody, Button, Box, Skeleton, IconButton, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';

const ItemCard = ({ item, onClick, onDelete, ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();
  const [imageUrl, setImageUrl] = useState('');
  // const [photographer, setPhotographer] = useState({ name: '', username: '' });
  const [isLoading, setIsLoading] = useState(true);

  const airtableImage = useMemo(() => item.fields.image, [item]);
  // const hasUnsplashImage = useMemo(() => {
  //   console.log('vv')
  //   console.log({ f: item.fields });
  //   if (!item.fields?.image) {
  //     return false;
  //   } else {
  //     return item.fields?.image?.indexOf('unsplash') !== -1
  //   }
  // }, [item]);
  // Fallback to an image if stored in airtable. Otherwise, fetch one from the unsplash random image api
  useEffect(() => {
    if (!item.fields.image) {
      const fetchRandomImage = async () => {
        setIsLoading(true);
        const airtableAPI_KEY = localStorage.getItem('airtableAPI_KEY');
        try {
          const response = await axios.get(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(item.fields.name)}`, {
            headers: {
              Authorization: `Client-ID ${localStorage.getItem('UnsplashAPI_KEY')}`
            }
          });
          const imageUrl = response.data.urls.regular;
          setImageUrl(imageUrl);
          // setPhotographer({
          //   name: response.data.user.name,
          //   username: response.data.user.username
          // });

          // Update Airtable with the new image URL
          const updateResponse = await fetch(`https://api.airtable.com/v0/app23j6JIk0UIbaxW/items/${item.id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${airtableAPI_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                image: imageUrl
              }
            })
          });

          if (!updateResponse.ok) {
            throw new Error('Failed to update item in Airtable');
          }
        } catch (error) {
          console.error('Error fetching random image or updating Airtable:', error);
          setImageUrl('https://via.placeholder.com/400x300?text=Image+Not+Found');
          // setPhotographer({ name: 'Unknown', username: 'unknown' });
        } finally {
          setIsLoading(false);
        }
      };
      fetchRandomImage();
    } else {
      setIsLoading(false);
    }
  }, [item]);

  const handleConfirm = async () => {
    const discordUrl = localStorage.getItem('webhookURL')

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

  const handleDelete = async () => {
    const airtableAPI_KEY = localStorage.getItem('airtableAPI_KEY');
    try {
      const deleteResponse = await fetch(`https://api.airtable.com/v0/app23j6JIk0UIbaxW/items/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${airtableAPI_KEY}`,
        },
      });

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete item from Airtable');
      }

      toast({
        title: "Item deleted",
        description: `${item.fields.name} has been deleted successfully`,
        status: "success",
        duration: 3000,
      });

      if (onDelete) {
        onDelete(item.id);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        status: "error",
        duration: 3000,
      });
    }
    setIsDeleteAlertOpen(false);
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Card cursor="pointer" maxWidth="400px" display="flex" flexDirection="column" borderRadius="lg" overflow="clip" minH="300px" position="relative">
          <IconButton
            icon={<CloseIcon />}
            size="sm"
            position="absolute"
            top={2}
            right={2}
            zIndex={1}
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteAlertOpen(true);
            }}
          />
          <Box h="85%" w="full" display="flex" justifyContent="center" alignItems="center">
            <Skeleton isLoaded={!isLoading} h="full" w="full">
              <Image src={airtableImage ?? imageUrl} fallbackSrc="https://via.placeholder.com/400x300?text=Image+Not+Found" objectPosition="center" h="full" w="full" objectFit="cover"/>
            </Skeleton>
          </Box>
          <Box h="15%">
            <CardHeader borderTop="1px solid lightgray" p={2}>
              <Heading size={{
                base: 'sm',
                lg: 'md'
              }}>{item.fields.name}</Heading>
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

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Item
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {item.fields.name}? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Popover>
  );
};

export default ItemCard;
