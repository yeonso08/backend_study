const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// 글 작성
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const id = req.user.id;

        const result = await pool.query('INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *', [title, content, id])
        res.status(201).json(result.rows[0]);
    } catch(error) {
        next(error)
    }
})

// 전체 글 조회
router.get('/', authMiddleware, async(req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM posts')
        res.status(200).json(result.rows)
    } catch (error) {
        next(error)
    }
})

// 특정 글 조회
router.get('/:id', authMiddleware, async(req, res, next) => {
    try {
        const id = req.params.id;

        const result = await pool.query('SELECT * FROM posts WHERE id = $1',[id])
        res.status(200).json(result.rows[0])
    } catch (error) {
        next(error)
    }
})

// 글 수정
router.put('/:id', authMiddleware, async(req, res, next) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const user_id = req.user.id;
        const id = req.params.id;

        const result = await pool.query('UPDATE posts SET title = $1, content = $2 WHERE user_id = $3 AND id = $4 RETURNING *', [title, content, user_id, id])
        res.status(201).json(result.rows[0])
    } catch (error) {
        next(error)
    }
})

// 글 삭제
router.delete('/:id', authMiddleware, async(req, res, next) => {
    try {
        const id = req.params.id;
        const user_id = req.user.id;

        const result = await pool.query('DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING * ', [id, user_id])
        res.status(200).json({ 메시지: '삭제 완료' })
    } catch (error) {
        next(error)
    }
})

module.exports = router;