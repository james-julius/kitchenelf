import React, { useState, useEffect, useMemo } from 'react';
import { useToast, useDisclosure, PopoverHeader, Card, CardHeader, Heading, Image, Popover, PopoverTrigger, PopoverArrow, PopoverContent, PopoverBody, Button, Box, Skeleton } from '@chakra-ui/react'
import axios from 'axios';

const ItemCard = ({ item, onClick, ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Card cursor="pointer" maxWidth="400px" display="flex" flexDirection="column" borderRadius="lg" overflow="clip" minH="300px">
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
              {/* {hasUnsplashImage && <Skeleton isLoaded={!isLoading}>
                <Text fontSize="xs" mt={1}>
                  Photo by <Link href={`https://unsplash.com/@${photographer.username}?utm_source=kitchenelf&utm_medium=referral`} isExternal>{photographer.name}</Link> on <Link href="https://unsplash.com/?utm_source=your_app_name&utm_medium=referral" isExternal>Unsplash</Link>
                </Text>
              </Skeleton>} */}
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
