const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

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

app.post('/panic/:uid/:latitude/:longitude', async (req, res) => {
    const { uid, latitude, longitude } = req.params;

    console.log(uid);
    console.log(latitude);
    console.log(longitude);

    const sendMessage = async (contact) => {
        try {
            const message = await client.messages.create({
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:' + contact,
                body: `${uid} needs your help https://www.google.com/maps?q=${latitude},${longitude}`
            });
            console.log('Message sent successfully!');
            console.log('Message SID:', message.sid);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const user = data.find(user => user.uid === uid);
    if (user) {
        for (let contact of user.emergency) {
            await sendMessage(contact);
        }
    }

    for (let user of data) {
        if (user.uid !== uid) {
            await sendMessage(user.contact);
        }
    }

    res.json({ message: 'Successfully sent SOS' });
});

app.post('/alert/:uid/:latitude/:longitude', async (req, res) => {
    const { uid, latitude, longitude } = req.params;

    console.log(uid);
    console.log(latitude);
    console.log(longitude);

    const sendMessage = async (contact) => {
        try {
            const message = await client.messages.create({
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:' + contact,
                body: `${uid} needs your help https://www.google.com/maps?q=${latitude},${longitude}`
            });
            console.log('Message sent successfully!');
            console.log('Message SID:', message.sid);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const user = data.find(user => user.uid === uid);
    if (user) {
        for (let contact of user.emergency) {
            await sendMessage(contact);
        }
    }

    res.json({ message: 'Successfully sent SOS' });
});

app.post('/auth/:uid/:password', (req, res) => {
    const { uid, password } = req.params;

    const user = data.find(user => user.uid === uid && user.password === password);
    if (user) {
        res.json({ message: 'user authentication successful' });
    } else {
        res.json({ message: 'user not found' });
    }
});

app.get('/profile/:uid', (req, res) => {
    const { uid } = req.params;

    const user = data.find(user => user.uid === uid);
    if (user) {
        res.json(user);
    } else {
        res.json({ message: 'Not Found' });
    }
});

app.post('/signup/:name/:uid/:password/:email/:address/:contact/:emergency1/:emergency2/:emergency3/:aadhaar', (req, res) => {
    const { name, uid, password, email, address, contact, emergency1, emergency2, emergency3, aadhaar } = req.params;

    const newUser = {
        name,
        uid,
        password,
        email,
        address,
        contact: '+91' + contact,
        emergency: ['+91' + emergency1, '+91' + emergency2, '+91' + emergency3],
        aadhaar
    };

    data.push(newUser);

    res.json({ message: 'New User added' });
});

app.listen(port, () => {
    console.log(`App Started At Port ${port}`);
});
