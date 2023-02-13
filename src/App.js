import React, { useState, useEffect } from 'react';

import './App.css';
import ItemCard from './components/ItemCard';
import { SimpleGrid, Button, Input } from '@chakra-ui/react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react'

const App = () => {
  // const [lastOrdered, setLastOrdered] = useState(new Date().toLocaleDateString());
  const [shouldPromptForWebhookURL, setShouldPromptForWebhookURL] = useState(false);
  const [shouldPromptForAirtableAPI_KEY, setShouldPromptForAirtableAPI_KEY] = useState(false);

  const promptForWebhookURL = () => {
    let webhookURL = localStorage.getItem('webhookURL');

    if (!webhookURL) {
      webhookURL = prompt('Please enter your Discord webhook URL:');
      localStorage.setItem('webhookURL', webhookURL);
    }

    console.log('webhookURL', webhookURL);
    return webhookURL;
  };

  const clearWebhookURL = () => {
    localStorage.removeItem('webhookURL');
    setShouldPromptForWebhookURL(true);
  };

  // Prompt for webhook url on page load
  useEffect(() => promptForWebhookURL, []);

  // Prompt for webhook url again if cancelled
  useEffect(() => {
    if (shouldPromptForWebhookURL) {
      promptForWebhookURL();
      setShouldPromptForWebhookURL(false);
    }
  }, [shouldPromptForWebhookURL]);


  const promptForAirtableAPIKey = () => {
    let airtableAPI_KEY = localStorage.getItem('airtableAPI_KEY');

    if (!airtableAPI_KEY) {
      airtableAPI_KEY = prompt('Please enter your Airtable API Key:');
      localStorage.setItem('airtableAPI_KEY', airtableAPI_KEY);
    }

    return airtableAPI_KEY;
  };

  const clearAirtableAPIKey = () => {
    localStorage.removeItem('airtableAPI_KEY');
    setShouldPromptForAirtableAPI_KEY(true);
  };

  // Prompt for Airtable API Key on page load
  useEffect(() => promptForAirtableAPIKey, []);

  // Prompt for Airtable API Key again if cancelled
  useEffect(() => {
    if (shouldPromptForAirtableAPI_KEY) {
      promptForAirtableAPIKey();
      setShouldPromptForAirtableAPI_KEY(false);
    }
  }, [shouldPromptForAirtableAPI_KEY]);


  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const airtableAPI_KEY = localStorage.getItem('airtableAPI_KEY')
    // const airtableAPI_KEY = null
    fetch(`https://api.airtable.com/v0/app23j6JIk0UIbaxW/items?api_key=${airtableAPI_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.records);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const reloadPage = () => {
    window.location.reload();
  }

  const filteredItems = items.filter((item) =>
    item.fields.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div>
        <Input m={5} type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for an item" />
        <SimpleGrid m={5} minChildWidth='200px' spacing='40px'>
          {filteredItems.length ? (
            filteredItems
              .sort(function(a, b) {
                if(a.fields.name < b.fields.name) return -1;
                if(a.fields.name > b.fields.name) return 1;
                return 0;
              })
              .map(item => (
              <ItemCard key={item.fields.name} item={item} />
            ))
          ) : (
            <p>No items found. Probably the Airtable API Key isn't correct. Try again!</p>
          )}
        </SimpleGrid>


        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Settings
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Button m={2} onClick={() => { clearWebhookURL() }}>Reset Discord Webhook URL</Button>
              <Button m={2} onClick={() => { clearAirtableAPIKey() }}>Reset Airtable API Key</Button>
              <Button m={2} onClick={reloadPage}>Refresh Page</Button>

            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );;
};

export default App;
