import {  Card, CardHeader, Heading, Image } from '@chakra-ui/react'
// import { useDisclosure, PopoverHeader, Card, CardHeader, Heading, Image , Popover, PopoverTrigger, PopoverArrow, PopoverContent, PopoverCloseButton, PopoverBody, Button} from '@chakra-ui/react'


const ItemCard = ({item, handleConfirm, ...rest}) => {

// const { isOpen, onToggle, onClose } = useDisclosure()

return (
  // <Popover>
  //    <PopoverTrigger>
    <Card cursor='pointer' maxWidth={'400px'} {...rest}>
    <Image
          // maxHeight={'200px'}
          src={item.fields.image}
          borderRadius='lg'
        />
      <CardHeader>
        <Heading size='md'>{item.fields.name}</Heading>
      </CardHeader>
    </Card>
//     </PopoverTrigger>
//     <PopoverContent>
//     <PopoverArrow />
//     {/* <PopoverCloseButton /> */}
//     <PopoverHeader>Hi, I'm the Kitchen Elf!</PopoverHeader>
//     <PopoverBody>
//       <p>Are you sure you want to order {item.fields.name}?</p>
//           <Button onClick={handleConfirm}>Yes</Button>
//           <Button onClick={onClose}>No</Button>
//     </PopoverBody>
//   </PopoverContent>
// </Popover>
)
};

export default ItemCard;
