const express = require('express');
const app = express();
const usersRouter = require('./routes/users');

app.use(express.json());

// 로그 미들웨어
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// 라우터 등록
app.use('/users', usersRouter);

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ 메시지: '서버 에러', 에러: err.message });
});

app.listen(3000, () => {
    console.log('서버 시작! http://localhost:3000');
});