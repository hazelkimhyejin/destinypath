const express = require('express');
     const { MongoClient, ServerApiVersion } = require('mongodb');
     const cors = require('cors');
     const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
     require('dotenv').config();
     const app = express();

     app.use(cors());
     app.use(express.json());

     // MongoDB connection
     const uri = process.env.MONGODB_URI;
     const client = new MongoClient(uri, {
       serverApi: {
         version: ServerApiVersion.v1,
         strict: true,
         deprecationErrors: true,
       }
     });

     async function connectDB() {
       try {
         await client.connect();
         await client.db("admin").command({ ping: 1 });
         console.log("Pinged your deployment. You successfully connected to MongoDB!");
       } catch (err) {
         console.error('MongoDB connection error:', err);
       }
     }
     connectDB();

     // Payment endpoint
     app.post('/api/create-checkout-session', async (req, res) => {
       const { type, currency } = req.body;
       const prices = {
         single: { usd: 499, sgd: 650, myr: 2000, krw: 650000, twd: 15000, aud: 750, gbp: 400, jpy: 70000 },
         couple: { usd: 799, sgd: 1050, myr: 3200, krw: 1050000, twd: 24000, aud: 1200, gbp: 600, jpy: 110000 }
       };
       try {
         const session = await stripe.checkout.sessions.create({
           payment_method_types: ['card'],
           line_items: [{
             price_data: {
               currency: currency,
               product_data: { name: type === 'single' ? 'Single Report' : 'Couple Report' },
               unit_amount: prices[type][currency]
             },
             quantity: 1
           }],
           mode: 'payment',
           success_url: 'https://destinypath.onrender.com/success',
           cancel_url: 'https://destinypath.onrender.com/cancel'
         });
         res.json({ id: session.id });
       } catch (err) {
         res.status(500).json({ error: 'Failed to create checkout session' });
       }
     });

     // Subscription endpoint
     app.post('/api/create-subscription', async (req, res) => {
       const { currency } = req.body;
       const prices = { usd: 999, sgd: 1300, myr: 4000, krw: 1300000, twd: 30000, aud: 1500, gbp: 800, jpy: 140000 };
       try {
         const session = await stripe.checkout.sessions.create({
           payment_method_types: ['card'],
           line_items: [{
             price_data: {
               currency: currency,
               product_data: { name: 'Monthly Subscription' },
               unit_amount: prices[currency],
               recurring: { interval: 'month' }
             },
             quantity: 1
           }],
           mode: 'subscription',
           success_url: 'https://destinypath.onrender.com/success',
           cancel_url: 'https://destinypath.onrender.com/cancel'
         });
         res.json({ id: session.id });
       } catch (err) {
         res.status(500).json({ error: 'Failed to create subscription session' });
       }
     });

     // Data endpoints
     app.post('/api/single', async (req, res) => {
       try {
         const db = client.db('destinypath');
         const collection = db.collection('users');
         await collection.insertOne({
           name: req.body.name,
           dob: new Date(req.body.dob),
           time: req.body.time,
           gender: req.body.gender,
           country: req.body.country,
           createdAt: new Date()
         });
         res.json({ message: 'User data saved' });
       } catch (err) {
         res.status(500).json({ error: 'Failed to save user data' });
       }
     });

     app.post('/api/couple', async (req, res) => {
       try {
         const db = client.db('destinypath');
         const collection = db.collection('couples');
         await collection.insertOne({
           user1: {
             name: req.body.user1.name,
             dob: new Date(req.body.user1.dob),
             time: req.body.user1.time,
             gender: req.body.user1.gender,
             country: req.body.user1.country
           },
           user2: {
             name: req.body.user2.name,
             dob: new Date(req.body.user2.dob),
             time: req.body.user2.time,
             gender: req.body.user2.gender,
             country: req.body.user2.country
           },
           compatibility: req.body.compatibility,
           createdAt: new Date()
         });
         res.json({ message: 'Couple data saved', compatibility: req.body.compatibility });
       } catch (err) {
         res.status(500).json({ error: 'Failed to save couple data' });
       }
     });

     // Feedback endpoint
     app.post('/api/feedback', async (req, res) => {
       try {
         const db = client.db('destinypath');
         const collection = db.collection('feedback');
         await collection.insertOne({
           feedback: req.body.feedback,
           lang: req.body.lang,
           createdAt: new Date()
         });
         res.json({ message: 'Feedback saved' });
       } catch (err) {
         res.status(500).json({ error: 'Failed to save feedback' });
       }
     });

     app.listen(3000, () => console.log('Server running on port 3000'));

     // Ensure client closes on process exit
     process.on('SIGINT', async () => {
       await client.close();
       process.exit();
     });