import React, { useState, useEffect } from 'react';
import { Box, Skeleton, Text } from '@chakra-ui/react';
import './App.css';
import ItemCard from './components/ItemCard';
import SettingsModal from './components/SettingsModal';
import { SimpleGrid, Input } from '@chakra-ui/react';
import AddNewItemModal from './components/AddNewItemModal';

const App = () => {
  const [loading, setLoading] = useState(true);
  // const [lastOrdered, setLastOrdered] = useState(new Date().toLocaleDateString());
  const [shouldPromptForWebhookURL, setShouldPromptForWebhookURL] = useState(false);
  const [shouldPromptForAirtableAPI_KEY, setShouldPromptForAirtableAPI_KEY] = useState(false);
  const [shouldPromptForUnsplashAPI_KEY, setShouldPromptForUnsplashAPI_KEY] = useState(false);
  const handleRefreshItems = () => {
    fetchAirtableItems();
  };
  const promptForWebhookURL = () => {
    let webhookURL = localStorage.getItem('webhookURL');

    if (!webhookURL) {
      webhookURL = prompt('Please enter your Discord webhook URL:');
      localStorage.setItem('webhookURL', webhookURL);
    }

    // console.log('webhookURL', webhookURL);
    return webhookURL;
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

  // Prompt for Airtable API Key on page load
  useEffect(() => promptForAirtableAPIKey, []);

  // Prompt for Airtable API Key again if cancelled
  useEffect(() => {
    if (shouldPromptForAirtableAPI_KEY) {
      promptForAirtableAPIKey();
      setShouldPromptForAirtableAPI_KEY(false);
    }
  }, [shouldPromptForAirtableAPI_KEY]);


  const promptForUnsplashAPIKey = () => {
    let unsplashAPI_KEY = localStorage.getItem('UnsplashAPI_KEY');

    if (!unsplashAPI_KEY) {
      unsplashAPI_KEY = prompt('Please enter your Unsplash API Key:');
      localStorage.setItem('UnsplashAPI_KEY', unsplashAPI_KEY);
    }

    return unsplashAPI_KEY;
  };

  // Prompt for Unsplash API Key on page load
  useEffect(() => promptForUnsplashAPIKey, []);

  // Prompt for Unsplash API Key again if cancelled
  useEffect(() => {
    if (shouldPromptForUnsplashAPI_KEY) {
      promptForUnsplashAPIKey();
      setShouldPromptForUnsplashAPI_KEY(false);
    }
  }, [shouldPromptForUnsplashAPI_KEY]);


  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAirtableItems = () => {
    const airtableAPI_KEY = localStorage.getItem('airtableAPI_KEY')
    fetch(`https://api.airtable.com/v0/app23j6JIk0UIbaxW/items`, {
      headers: {
        'Authorization': `Bearer ${airtableAPI_KEY}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.records);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => { setLoading(false); })
  }
  useEffect(() => {
    fetchAirtableItems();
  }, []);


  const filteredItems = items.filter((item) =>
    item.fields.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteItem = (deletedItemId) => {
    setItems(items.filter(item => item.id !== deletedItemId));
  }

  return (
    <Box w="100dvw" maxW="100dvw" bg="gray.100">
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="nowrap" p={5} w="100dvw" gap={3} position="fixed" zIndex={2} top={0} h={20} bg="gray.100" border="1px solid lightgray">
        <Input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for an existing item"  bg="white"/>
        <Text>or</Text>
        <AddNewItemModal onAddNewItem={handleRefreshItems} />
      </Box>
      {loading ? <Skeleton h="full" w="full" /> :
        <SimpleGrid mt={20} mb={5} px={5} columns={[2, 3, 3, 5, 'auto']} spacing={5} h="full" overflow="scroll" flexGrow zIndex={1} pt={5} pb={20}>
          {filteredItems.length ? (
            filteredItems
              .sort(function (a, b) {
                if (a.fields.name < b.fields.name) return -1;
                if (a.fields.name > b.fields.name) return 1;
                return 0;
              })
              .map(item => (
                <ItemCard key={item.fields.name} item={item} onDelete={handleDeleteItem} />
              ))
          ) : (
            <p>No items found. Probably the Airtable API Key isn't correct. Try again!</p>
          )}
        </SimpleGrid>}
      <Box w="full" borderTop="1px solid lightgray" position="fixed" bottom={0} display="flex" justifyContent="items-center" zIndex={2}>
        <SettingsModal
          setShouldPromptForWebhookURL={setShouldPromptForWebhookURL}
          setShouldPromptForAirtableAPI_KEY={setShouldPromptForAirtableAPI_KEY}
          setShouldPromptForUnsplashAPI_KEY={setShouldPromptForUnsplashAPI_KEY}
        />
      </Box>
    </Box>
  );
};

export default App;
