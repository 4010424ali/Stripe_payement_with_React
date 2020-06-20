const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_AqxytxAUrSX2HPhuCwDu6HeH00ooMdYGpx');
const { v4: uuidv4 } = require('uuid');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Route
app.get('/', (req, res) => {
  res.send('It Work');
});

app.post('/payment', (req, res) => {
  const { product, token } = req.body;

  console.log('PRODUCT', product);
  console.log('PRICE', product.price);

  const idempontencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: 'usd',
          customer: customer.id,
          receipt_email: token.email,
          description: product.name,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

app.listen(PORT, () =>
  console.log(`Server is running on development mode on port ${PORT}`)
);
