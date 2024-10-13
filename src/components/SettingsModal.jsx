import React from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalBody,
    ModalHeader,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    useDisclosure,
} from '@chakra-ui/react'

export default function SettingsModal({ setShouldPromptForWebhookURL, setShouldPromptForAirtableAPI_KEY }) {
  const { isOpen, onOpen, onClose } = useDisclosure();


  const clearAirtableAPIKey = () => {
    localStorage.removeItem('airtableAPI_KEY');
    setShouldPromptForAirtableAPI_KEY(true);
  };

  const clearWebhookURL = () => {
    localStorage.removeItem('webhookURL');
    setShouldPromptForWebhookURL(true);
  };


  const reloadPage = () => {
    window.location.reload();
  }


    return (
        <>
            <Button w="full" bg="gray.100" onClick={onOpen}>Settings</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Button m={2} onClick={() => { clearWebhookURL() }}>Reset Discord Webhook URL</Button>
                    <Button m={2} onClick={() => { clearAirtableAPIKey() }}>Reset Airtable API Key</Button>
                    <Button m={2} onClick={reloadPage}>Refresh Page</Button>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="green" mr={3} onClick={onClose}>
                    Close
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}