const express = require('express');
const router = express.Router();
const pool = require('../db');

// 전체 유저 조회
router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
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

module.exports = router;