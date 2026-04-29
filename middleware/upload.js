const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // 업로드된 파일 저장 폴더
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);  // 확장자 추출
        cb(null, `${Date.now()}${ext}`);  // 파일명: 타임스탬프 + 확장자
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);   // 허용
    } else {
        cb(new Error('이미지 파일만 업로드 가능합니다'), false);  // 거부
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  // 5MB 제한
});

module.exports = upload;