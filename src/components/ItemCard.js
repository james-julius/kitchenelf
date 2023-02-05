import { Card, CardHeader, Heading, CardBody, Stack, StackDivider, Box, Text, Image } from '@chakra-ui/react'

const ItemCard = ({item, ...rest}) => {

return (
<Card cursor='pointer' maxWidth={'400px'} {...rest}>
<Image
      src={item.image}
      borderRadius='lg'
    />

  <CardHeader>
    <Heading size='md'>{item.title}</Heading>
  </CardHeader>

  {/* <CardBody>
    <Stack divider={<StackDivider />} spacing='4'>

      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Analysis
        </Heading>
        <Text pt='2' fontSize='sm'>
          See a detailed analysis of all your business clients.
        </Text>
      </Box>
    </Stack>
  </CardBody> */}
</Card>

)
};

export default ItemCard;
