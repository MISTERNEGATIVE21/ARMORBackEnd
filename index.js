const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

app.use(bodyParser.json());
app.use(cors({origin:'*'}));

let data = [
    {
        name: 'Jibitesh Chakraborty',
        uid: 'Jibitesh',
        password: 'Jibimax@123',
        email: 'jibitesh.chakraborty.281102@gmail.com',
        address: '19A, Ballygunge Place East, Kolkata-19',
        contact: '+919163623906',
        emergency: ['+919163362827', '+919674956166', '+919733590204'],
        aadhaar: '123456789012'
    }
];

app.get('/', (req, res) => {
    res.send('Hello, world! This is a simple Express.js app.');
});

// Assuming you have already initialized 'client' with Twilio

app.post('/panic/:uid/:latitude/:longitude', async (req, res) => {
    const uid = req.params.uid;
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;

    console.log(uid);
    console.log(latitude);
    console.log(longitude);

    const sendMessage = async (contact) => {
        try {
            const message = await client.messages.create({
                from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
                to: 'whatsapp:' + contact, // Destination number
                body: `${uid} needs your help https://www.google.com/maps?q=${latitude},${longitude}`
            });
            console.log('Message sent successfully!');
            console.log('Message SID:', message.sid);
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Error sending message' });
        }
    };

    for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
        if (data[i].uid === uid) {
            console.log(data[i].uid);
            const emergency = data[i].emergency;
            for (let j = 0; j < emergency.length; j++) {
                console.log(emergency[j]);
                await sendMessage(emergency[j]); // Wait for each message to be sent
            }
            break; // Exit the loop once the emergency contacts are found
        }
    }

    for (let i = 0; i < data.length; i++) {
        if (data[i].uid === uid) {
            continue;
        }
            
        console.log(data[i]);
        const contact = data[i].contact; // Fixed variable assignment
        await sendMessage(contact);
    }

    res.json({ message: 'Successfully sent SOS' });
});

app.post('/alert/:uid/:latitude/:longitude', async (req, res) => {
    const uid = req.params.uid;
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;

    console.log(uid);
    console.log(latitude);
    console.log(longitude);

    const sendMessage = async (contact) => {
        try {
            const message = await client.messages.create({
                from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
                to: 'whatsapp:' + contact, // Destination number
                body: `${uid} needs your help https://www.google.com/maps?q=${latitude},${longitude}`
            });
            console.log('Message sent successfully!');
            console.log('Message SID:', message.sid);
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Error sending message' });
        }
    };

    for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
        if (data[i].uid === uid) {
            console.log(data[i].uid);
            const emergency = data[i].emergency;
            for (let j = 0; j < emergency.length; j++) {
                console.log(emergency[j]);
                await sendMessage(emergency[j]); // Wait for each message to be sent
            }
            break; // Exit the loop once the emergency contacts are found
        }
    }

    res.json({ message: 'Successfully sent SOS' });
});

app.post('/auth/:uid/:password', (req, res) => {
    const uid = req.params.uid;
    const password = req.params.password;

    for (let i = 0; i < data.length; i++) {
        if (data[i].uid === uid && data[i].password === password) {
            res.json({ message: 'user authentication successful' });
            return; // Exit the loop once authentication is successful
        }
    }

    res.status(404).json({ message: 'user not found or authentication failed' });
});

app.get('/profile/:uid', (req, res) => {
    const uid = req.params.uid;

    for (let i = 0; i < data.length; i++) {
        if (data[i].uid === uid) {
            res.json(data[i]);
            return; // Exit the loop once profile is found
        }
    }

    res.status(404).json({ message: 'profile not found' });
});

app.post('/signup/:name/:uid/:password/:email/:address/:contact/:emergency1/:emergency2/:emergency3/:aadhaar', (req, res) => {
    const { name, uid, password, email, address, contact, emergency1, emergency2, emergency3, aadhaar } = req.params;

    const newdata = {
        name,
        uid,
        password,
        email,
        address,
        contact: '+91' + contact,
        emergency: ['+91' + emergency1, '+91' + emergency2, '+91' + emergency3],
        aadhaar
    };

    data.push(newdata);

    res.json({ message: 'New User added' });
});

app.listen(port, () => {
    console.log(`App Started At Port ${port}`);
});
