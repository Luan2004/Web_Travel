const express = require('express');
const sqlite3 = require('sqlite3')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("❌ Lỗi kết nối database:", err.message);
    } else {
        console.log("✅ Database đã được tạo thành công!");
        db.run(`CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error("❌ Lỗi tạo bảng Users:", err.message);
            } else {
                console.log("✅ Bảng Users đã sẵn sàng!");
            }
        });

        // Tạo bảng Tours nếu chưa có
        db.run(`CREATE TABLE IF NOT EXISTS Tours (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                image TEXT NOT NULL,
                image1 TEXT,
                image2 TEXT,
                image3 TEXT,
                duration TEXT NOT NULL,
                price INTEGER NOT NULL,
                old_price INTEGER,
                description TEXT NOT NULL  
        )`, (err) => {
            if (err) {
                console.error("❌ Lỗi tạo bảng Tours:", err.message);
            } else {
                console.log("✅ Bảng Tours đã sẵn sàng!");
            }
        });
    }
});

// Đảm bảo phục vụ thư mục tĩnh
app.use(express.static(path.join(__dirname, 'html')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'home.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'register.html'));
});

app.get('/detail', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'detail.html'));
});

app.get('/tours', (req, res) => {
    db.all("SELECT * FROM Tours", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/tours/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM Tours WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Tour không tồn tại!" });
            return;
        }
        res.json(row);
    });
});

// 🟢 API Đăng ký
app.post('/register', async(req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    try {
        // Kiểm tra email đã tồn tại chưa
        db.get(`SELECT * FROM Users WHERE email = ?`, [email], async(err, existingUser) => {
            if (err) {
                console.error('❌ Lỗi truy vấn:', err);
                return res.status(500).json({ error: 'Lỗi truy vấn database' });
            }
            if (existingUser) {
                return res.status(400).json({ error: 'Email đã tồn tại!' });
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Chèn dữ liệu vào database
            db.run(`INSERT INTO Users (username, email, password) VALUES (?, ?, ?)`, [username, email, hashedPassword], function(err) {
                if (err) {
                    console.error('❌ Lỗi chèn dữ liệu:', err);
                    return res.status(500).json({ error: 'Lỗi khi lưu thông tin người dùng' });
                }
                console.log(`✅ Người dùng đăng ký thành công: ${username}, Email: ${email}`);
                res.status(201).json({ message: 'Đăng ký thành công!' });
            });
        });
    } catch (err) {
        console.error('❌ Lỗi đăng ký:', err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});


// 🟢 API Đăng nhập
app.post('/login', async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu!' });
    }

    try {
        db.get(`SELECT * FROM Users WHERE email = ?`, [email], async(err, user) => {
            if (err) {
                console.error('❌ Lỗi truy vấn database:', err);
                return res.status(500).json({ error: 'Lỗi truy vấn database' });
            }
            if (!user) {
                return res.status(401).json({ error: 'Email chưa được đăng ký!' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Sai mật khẩu!' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
            res.json({ message: 'Đăng nhập thành công!', token });
        });
    } catch (err) {
        console.error('❌ Lỗi đăng nhập:', err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

// 🟢 API Lấy thông tin người dùng (yêu cầu xác thực JWT)
app.get('/user', async(req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Không có token!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        db.get(`SELECT id, username, email FROM Users WHERE id = ?`, [decoded.id], (err, user) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(user);
        });
    } catch (err) {
        console.error('❌ Lỗi xác thực:', err);
        res.status(403).json({ error: 'Token không hợp lệ!' });
    }
});

// 🟢 Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});