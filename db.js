const { Pool } = require('pg');

// DB 연결 설정
const pool = new Pool({
    host: 'localhost',      // DB 주소
    port: 5432,             // PostgreSQL 기본 포트
    database: 'backend_study', // 아까 만든 DB 이름
    user: 'postgres',       // DB 유저
    password: '734752Wodus*', // PostgreSQL 설치할 때 설정한 비밀번호
});

module.exports = pool;