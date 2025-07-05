const API_BASE = 'http://localhost:3002/api';

// First get auth token
async function getAuthToken() {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (!response.ok) {
      console.log('Login failed, trying signup...');
      const signupResponse = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        })
      });
      
      if (!signupResponse.ok) {
        throw new Error('Failed to signup');
      }
      
      const signupData = await signupResponse.json();
      return signupData.data.token;
    }

    const data = await response.json();
    return data.data.token;
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
}

async function testMessagingAPIs() {
  console.log('🧪 Testing Messaging and Contacts APIs\n');
  
  try {
    const token = await getAuthToken();
    console.log('✅ Authentication successful\n');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Test Contacts APIs
    console.log('📞 Testing Contacts APIs...');
    
    // Get all contacts
    const contactsResponse = await fetch(`${API_BASE}/contacts`, { headers });
    const contactsData = await contactsResponse.json();
    console.log('GET /contacts:', contactsResponse.ok ? '✅' : '❌', contactsData);

    // Create a contact
    const newContact = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      company: 'Test Company'
    };

    const createContactResponse = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newContact)
    });
    const createContactData = await createContactResponse.json();
    console.log('POST /contacts:', createContactResponse.ok ? '✅' : '❌', createContactData);

    let contactId = null;
    if (createContactResponse.ok && createContactData.data) {
      contactId = createContactData.data.id;
    }

    // Update the contact if created successfully
    if (contactId) {
      const updateContactResponse = await fetch(`${API_BASE}/contacts/${contactId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...newContact,
          name: 'John Doe Updated',
          phone: '+1234567891'
        })
      });
      const updateContactData = await updateContactResponse.json();
      console.log(`PUT /contacts/${contactId}:`, updateContactResponse.ok ? '✅' : '❌', updateContactData);
    }

    console.log('\n💬 Testing Messages APIs...');
    
    // Get all messages
    const messagesResponse = await fetch(`${API_BASE}/messages`, { headers });
    const messagesData = await messagesResponse.json();
    console.log('GET /messages:', messagesResponse.ok ? '✅' : '❌', messagesData);

    // Create a message
    const newMessage = {
      content: 'Test message content',
      sender: 'test@example.com',
      recipient: 'john.doe@example.com',
      subject: 'Test Message',
      type: 'email'
    };

    const createMessageResponse = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newMessage)
    });
    const createMessageData = await createMessageResponse.json();
    console.log('POST /messages:', createMessageResponse.ok ? '✅' : '❌', createMessageData);

    let messageId = null;
    if (createMessageResponse.ok && createMessageData.data) {
      messageId = createMessageData.data.id;
    }

    // Update the message if created successfully
    if (messageId) {
      const updateMessageResponse = await fetch(`${API_BASE}/messages/${messageId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...newMessage,
          content: 'Updated test message content',
          subject: 'Updated Test Message'
        })
      });
      const updateMessageData = await updateMessageResponse.json();
      console.log(`PUT /messages/${messageId}:`, updateMessageResponse.ok ? '✅' : '❌', updateMessageData);
    }

    // Delete the message if created successfully
    if (messageId) {
      const deleteMessageResponse = await fetch(`${API_BASE}/messages/${messageId}`, {
        method: 'DELETE',
        headers
      });
      const deleteMessageData = await deleteMessageResponse.json();
      console.log(`DELETE /messages/${messageId}:`, deleteMessageResponse.ok ? '✅' : '❌', deleteMessageData);
    }

    // Delete the contact if created successfully
    if (contactId) {
      const deleteContactResponse = await fetch(`${API_BASE}/contacts/${contactId}`, {
        method: 'DELETE',
        headers
      });
      const deleteContactData = await deleteContactResponse.json();
      console.log(`DELETE /contacts/${contactId}:`, deleteContactResponse.ok ? '✅' : '❌', deleteContactData);
    }

    console.log('\n🎉 All messaging and contacts API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testMessagingAPIs().catch(console.error);
