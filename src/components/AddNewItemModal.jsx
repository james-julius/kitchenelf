import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';

export default function AddNewItemModal () {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newItemName, setNewItemName] = useState('');
    const toast = useToast();

    const handleAddItem = async () => {
        const airtableAPI_KEY = localStorage.getItem('airtableAPI_KEY');
        try {
            const response = await fetch('https://api.airtable.com/v0/app23j6JIk0UIbaxW/items', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${airtableAPI_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        name: newItemName
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add item');
            }

            toast({
                title: "Item added",
                description: `${newItemName} has been added successfully`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setNewItemName('');
            onClose();
        } catch (error) {
            console.error('Error adding item:', error);
            toast({
                title: "Error",
                description: "Failed to add item. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Button colorScheme='green' px={6} onClick={onOpen}>Add new item</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Item</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Item name</FormLabel>
                            <Input
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="Enter new item name"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green" mr={3} onClick={handleAddItem}>
                            Add Item
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};