const express = require('express');
const cors = require('cors');
const path = require('path');


const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 80;

const uri = "mongodb+srv://rartmeladze:rartmeladze@cluster0.ngnskbi.mongodb.net/UsersDataBase";

const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Add body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.static(path.join(__dirname, '..', '..')));

app.get('/add', (req, res) => {
    res.send('Response from Backend Server working');
});

app.get('/update', (req, res) => {
    res.send('Info is updated');
});

// პასუხობს და ასრულებს მოთხოვნას ახალი მომხმარებლის შესაქმნელად
        app.post('/create', asyncMiddleware(async (req, res) => {

            // იღებს მონაცემებს წინა მხარის ფორმ ელემენტისგან
                const { name, address, fasi, raodenoda } = req.body;

            // ქმნის ობიექტს მიღებული მონაცემების შესახებ
                const newUser = { name, address, fasi, raodenoda };


                // ინსტანციის შექმნა : თქვენ ქმნით ახალ ეგზემპლარს MongoClientთქვენი MongoDB 
                // მონაცემთა ბაზის კავშირის URI-ის (Uniform Resource Identifier) ​​და ასევე 
                // ნებისმიერი არჩევითი კონფიგურაციის ვარიანტების მიწოდებით. 
                // კავშირის URI ჩვეულებრივ მოიცავს ისეთ დეტალებს, 
                // როგორიცაა ჰოსტი, პორტი, მომხმარებლის სახელი, 
                // პაროლი და მონაცემთა ბაზის სახელი.

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            try {
                await client.connect();
                const result = await client.db("UsersDataBase").collection("Users").insertOne(newUser);
                console.log(`New user created with the following id: ${result.insertedId}`);
                const user = await client.db("UsersDataBase").collection("Users").findOne({ _id: result.insertedId });
                console.log("New user created:", user);
                res.status(200).json({ message: 'დაემატა მომხმარებელი', user});
            } catch (error) {
                console.error('Error creating user:', error);
                res.status(500).send('Error creating user');
            } finally {
                await client.close();
            }
        }));




app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});

