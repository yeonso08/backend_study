const express = require('express');
const cors = require('cors');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const typeDefs = require('./graphql/schema');
const userTypeDefs = require('./graphql/userSchema');
const resolvers = require('./graphql/resolvers');
const userResolvers = require('./graphql/userResolvers');
const jwt = require('jsonwebtoken');
const app = express();
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use((req, res, next) => {
    if (req.path === '/graphql') return next();
    express.json()(req, res, next);
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 로그 미들웨어
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// REST 라우터 등록
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/posts', postsRouter);

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ 메시지: '서버 에러', 에러: err.message });
});

// GraphQL 서버 시작
async function startServer() {
    const mergedTypeDefs = mergeTypeDefs([typeDefs, userTypeDefs]);
    const mergedResolvers = mergeResolvers([resolvers, userResolvers]);

    const apolloServer = new ApolloServer({ 
        typeDefs: mergedTypeDefs, 
        resolvers: mergedResolvers,
        context: ({ req }) => {
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    return { user: decoded };
                } catch (e) {
                    return {};
                }
            }
            return {};
        }
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ 
        app, 
        path: '/graphql',
        cors: false
    });

    app.listen(3000, () => {
        console.log('서버 시작! http://localhost:3000');
        console.log('GraphQL: http://localhost:3000/graphql');
    });
}

startServer();