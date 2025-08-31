require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');
const jose = require('jose');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 

const app = express();
app.use(express.json());

connectDB();

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/borrows', require('./routes/borrowRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        let user = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (token) {
                try {
                    const secret = jose.base64url.decode(process.env.JWE_ENCRYPTION_KEY);
                    const { plaintext } = await jose.compactDecrypt(token, secret);
                    const decodedToken = new TextDecoder().decode(plaintext);
                    const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);
                    // Fetch full user object to include role
                    user = await User.findById(decoded.id); 
                } catch (err) {
                    console.error('Token decryption error:', err);
                }
            }
        }
        return { user };
    },
});

(async () => {
    await server.start();
    server.applyMiddleware({ app });
})();

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}. GraphQL at http://localhost:${PORT}${server.graphqlPath}`));
