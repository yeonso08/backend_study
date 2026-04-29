const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// 전체 유저 조회
router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        // 허용할 컬럼 화이트리스트
        const allowedSort = ['id', 'name', 'age', 'email'];
        const allowedOrder = ['ASC', 'DESC'];

        const sort = allowedSort.includes(req.query.sort) ? req.query.sort : 'id';
        const order = allowedOrder.includes(req.query.order?.toUpperCase()) ? req.query.order.toUpperCase() : 'ASC';

        const result = await pool.query(
            `SELECT id, name, age, email FROM users 
             WHERE name LIKE $1 OR email LIKE $1
             ORDER BY ${sort} ${order} LIMIT $2 OFFSET $3`,
            [`%${search}%`, limit, offset]
        );

        const total = await pool.query(
            'SELECT COUNT(*) FROM users WHERE name LIKE $1 OR email LIKE $1',
            [`%${search}%`]
        );

        res.json({
            유저목록: result.rows,
            현재페이지: page,
            총유저수: Number(total.rows[0].count),
            총페이지수: Math.ceil(Number(total.rows[0].count) / limit)
        });
    } catch (error) {
        next(error);
    }
});

// 내 정보 조회
router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT id, name, age, email FROM users WHERE id = $1',
            [req.user.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// 특정 유저 조회
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ 메시지: '유저 없음' });
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// 유저 생성
router.post('/', async (req, res, next) => {
    try {
        const { name, age } = req.body;
        const result = await pool.query(
            'INSERT INTO users (name, age) VALUES ($1, $2) RETURNING *',
            [name, age]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// 유저 수정
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, age } = req.body;
        const result = await pool.query(
            'UPDATE users SET name = $1, age = $2 WHERE id = $3 RETURNING *',
            [name, age, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ 메시지: '유저 없음' });
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// 유저 삭제
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ 메시지: '유저 없음' });
        res.json({ 메시지: '삭제 완료' });
    } catch (error) {
        next(error);
    }
});

// 내 정보 조회
router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT id, name, age, email FROM users WHERE id = $1',
            [req.user.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// 프로필 이미지 업로드
router.post('/:id/upload', authMiddleware, upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ 메시지: '파일이 없습니다' });

        const { id } = req.params;
        const imageUrl = `/uploads/${req.file.filename}`;

        const result = await pool.query(
            'UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING id, name, email, profile_image',
            [imageUrl, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

module.exports = router;