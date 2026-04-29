const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    // Authorization: Bearer eyJhbGci...
    //                        ↑ 이 부분만 추출

    if (!token) return res.status(401).json({ 메시지: '로그인 필요' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // 다음 라우트에서 req.user.id 로 접근 가능
        next();
    } catch (error) {
        res.status(401).json({ 메시지: '유효하지 않은 토큰' });
    }
};