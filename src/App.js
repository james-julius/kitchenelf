import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [lastOrdered, setLastOrdered] = useState(new Date().toLocaleDateString());
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const promptForWebhookURL = () => {
    let webhookURL = localStorage.getItem('webhookURL');

    if (!webhookURL) {
      webhookURL = prompt('Please enter your Discord webhook URL:');
      localStorage.setItem('webhookURL', webhookURL);
    }

    return webhookURL;
  };

  const clearWebhookURL = () => {
    localStorage.removeItem('webhookURL');
    window.location.reload();
  };

  const webhookURL = promptForWebhookURL();

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
    window.location.reload();
  };

  const airtableAPI_KEY = promptForAirtableAPIKey();

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const [lastOrdered, setLastOrdered] = useState('');

  useEffect(() => {
    fetch(`https://api.airtable.com/v0/app23j6JIk0UIbaxW/items?api_key=${airtableAPI_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.records);
        console.log(data);
      })
      .catch((error) => {
        setItems([]);
        console.log(error);
      });
  }, []);

  const reloadPage = () => {
    window.location.reload();
  }

  const handleOrder = item => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  const filteredItems = items.filter((item) =>
    item.fields.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleConfirm = async () => {
    const discordUrl = webhookURL
    try {
      await axios.post(discordUrl, { content: `${selectedItem.fields.name}` });
      setLastOrdered(new Date().toLocaleDateString());
    } catch (error) {
      console.error(error);
    }
    console.log(selectedItem.fields.name);
    // setShowPopup(false);
  };

  // const handleCancel = () => {
  //   setShowPopup(false);
  // };

  const handleSubmit = event => {
    event.preventDefault();
    const newItem = {
      id: Date.now(),
      name: searchTerm,
      lastOrdered: new Date().toLocaleString()
    };
    setItems([...items, newItem]);
    localStorage.setItem('items', JSON.stringify(items));
    setSearchTerm('');
  };

  return (
    <>
      <div>

      <form onSubmit={handleSubmit}>
          <Input m={5} type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for an item" />
          {/* <Button type="submit">Create New Item</Button> */}
        </form>
      <SimpleGrid m={5} minChildWidth='200px' spacing='40px'>
      {filteredItems.length ? (
          filteredItems.map(item => (
              <ItemCard key={item.fields.name} item={item} onClick={() => handleOrder(item)} handleConfirm={handleConfirm}/>
       ))
        ) : (
          <p>No items found. Probably the Airtable API Key isn't correct. Try again!</p>
        )}
      </SimpleGrid>
      {/* {showPopup && (
        <div className="popup">
          <p>Hi, I'm the Kitchen Elf!</p>
          <p>Are you sure you want to order {selectedItem.fields.name}?</p>
          <Button m={2} onClick={handleConfirm}>Yes</Button>
          <Button m={2} onClick={handleCancel}>No</Button>
        </div>
      )} */}

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
      <Button m={2} onClick={clearWebhookURL}>Reset Discord Webhook URL</Button>
      <Button m={2} onClick={clearAirtableAPIKey}>Reset Airtable API Key</Button>
      <Button m={2} onClick={reloadPage}>Refresh Page</Button>

    </AccordionPanel>
  </AccordionItem>
  </Accordion>
      </div>
    </>
  );  ;
};

export default App;
