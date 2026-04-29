const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// 회원가입
router.post('/register',
    [
        body('name').notEmpty().withMessage('이름을 입력해주세요'),
        body('email').isEmail().withMessage('이메일 형식이 아닙니다'),
        body('password').isLength({ min: 4 }).withMessage('비밀번호는 4자 이상이어야 합니다'),
    ],
    async (req, res, next) => {
        try {
            // 검증 결과 확인
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 에러: errors.array() });
            }

            const { name, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
                [name, email, hashedPassword]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            next(error);
        }
    }
);

// 로그인
router.post('/login',
    [
        body('email').isEmail().withMessage('이메일 형식이 아닙니다'),
        body('password').notEmpty().withMessage('비밀번호를 입력해주세요'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 에러: errors.array() });
            }

            const { email, password } = req.body;
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) return res.status(401).json({ 메시지: '이메일 또는 비밀번호가 틀렸습니다' });

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) return res.status(401).json({ 메시지: '이메일 또는 비밀번호가 틀렸습니다' });

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ token });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;