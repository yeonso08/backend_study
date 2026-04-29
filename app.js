const express = require('express');
const cors = require('cors');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

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
    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });

    app.listen(3000, () => {
        console.log('서버 시작! http://localhost:3000');
        console.log('GraphQL: http://localhost:3000/graphql');
    });
}

startServer();