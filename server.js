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
            password TEXT,
            address TEXT,
            phone TEXT,
            googleId TEXT UNIQUE
        )`, (err) => {
            if (err) {
                console.error("❌ Lỗi tạo bảng Users:", err.message);
            } else {
                console.log("✅ Bảng Users đã sẵn sàng!");
            }
        });

        // Tạo bảng Addresses nếu chưa có
        db.run(`CREATE TABLE IF NOT EXISTS Addresses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            full_name TEXT NOT NULL,
            address TEXT NOT NULL,
            phone TEXT NOT NULL,
            is_default BOOLEAN DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES Users(id)
        )`, (err) => {
            if (err) {
                console.error("❌ Lỗi tạo bảng Addresses:", err.message);
            } else {
                console.log("✅ Bảng Addresses đã sẵn sàng!");
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
app.use('/img', express.static(path.join(__dirname, 'img')));

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

app.get('/tour', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'tour.html'));
});

//Thông tin tour
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

// Đăng ký & Đăng nhập bằng Google với debug lỗi chi tiết
app.post('/google-auth', async(req, res) => {
    const { email, googleId, name } = req.body;

    if (!email || !googleId || !name) {
        console.error("❌ Lỗi: email, googleId hoặc tên bị thiếu!");
        return res.status(400).json({ error: "Thiếu email, Google ID hoặc tên người dùng!" });
    }

    db.get("SELECT * FROM Users WHERE email = ?", [email], async(err, user) => {
        if (err) {
            console.error("❌ Lỗi truy vấn database:", err);
            return res.status(500).json({ error: "Lỗi truy vấn database!" });
        }

        if (user) {
            // Nếu user tồn tại, kiểm tra googleId
            const isMatch = await bcrypt.compare(googleId, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Google ID không khớp!" });
            }
            console.log("✅ User đã tồn tại, tạo token đăng nhập!");
            const token = jwt.sign({ id: user.id, email: user.email }, 'secretkey', { expiresIn: '1h' });
            return res.status(200).json({ message: "Đăng nhập thành công!", token });
        }

        // Nếu chưa có tài khoản, mã hóa googleId và đăng ký
        const hashedPassword = await bcrypt.hash(googleId, 10);
        db.run("INSERT INTO Users (username, email, password, googleId) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, googleId], function(err) {
            if (err) {
                console.error("❌ Lỗi khi chèn dữ liệu vào Users:", err);
                return res.status(500).json({ error: "Lỗi khi đăng ký tài khoản mới!" });
            }
            console.log("✅ Đăng ký mới thành công! Tạo token...");
            const token = jwt.sign({ id: this.lastID, email }, 'secretkey', { expiresIn: '1h' });
            res.status(201).json({ message: "Đăng ký & Đăng nhập thành công!", token });
        });
    });
});

// 🟢 API Đăng ký
// 🟢 API Đăng ký
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Kiểm tra username hoặc email đã tồn tại chưa
    db.get("SELECT * FROM Users WHERE username = ? OR email = ?", [username, email], (err, existingUser) => {
        if (err) {
            console.error("❌ Lỗi kiểm tra user:", err);
            return res.status(500).json({ error: "Lỗi server!" });
        }

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ error: "Tên đăng nhập đã tồn tại" });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ error: "Email đã tồn tại" });
            }
        }

        // Mã hóa mật khẩu trước khi lưu vào database
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error("❌ Lỗi mã hóa mật khẩu:", err);
                return res.status(500).json({ error: "Lỗi server!" });
            }

            // Chèn user vào database
            db.run("INSERT INTO Users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword],
                function(insertErr) {
                    if (insertErr) {
                        console.error("❌ Lỗi chèn dữ liệu:", insertErr);
                        return res.status(500).json({ error: "Lỗi khi tạo tài khoản!" });
                    }
                    // Tạo token sau khi đăng ký thành công
                    const token = jwt.sign({ id: this.lastID, email }, 'secretkey', { expiresIn: '1h' });
                    res.status(201).json({ message: "Đăng ký thành công!", token });
                }
            );
        });
    });
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        db.get(`SELECT id, username, email FROM Users WHERE id = ?`, [decoded.id], (err, user) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!user) {
                return res.status(404).json({ error: "User không tồn tại!" });
            }
            res.json(user);
        });
    } catch (err) {
        console.error('❌ Lỗi xác thực token:', err);
        res.status(403).json({ error: 'Token không hợp lệ hoặc hết hạn!' });
    }
});

// 🟢 API Đổi mật khẩu
app.post('/change-password', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const { oldPassword, newPassword } = req.body;

    // Kiểm tra token
    if (!token) {
        return res.status(401).json({ error: 'Không có token!' });
    }

    try {
        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        const userId = decoded.id;

        // Lấy thông tin người dùng từ database
        db.get(`SELECT * FROM Users WHERE id = ?`, [userId], async (err, user) => {
            if (err) {
                console.error('❌ Lỗi truy vấn database:', err);
                return res.status(500).json({ error: 'Lỗi truy vấn database!' });
            }
            if (!user) {
                return res.status(404).json({ error: 'Người dùng không tồn tại!' });
            }

            // Kiểm tra mật khẩu cũ
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Mật khẩu cũ không đúng!' });
            }

            // Mã hóa mật khẩu mới
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Cập nhật mật khẩu mới vào database
            db.run(`UPDATE Users SET password = ? WHERE id = ?`, [hashedNewPassword, userId], (updateErr) => {
                if (updateErr) {
                    console.error('❌ Lỗi cập nhật mật khẩu:', updateErr);
                    return res.status(500).json({ error: 'Lỗi khi cập nhật mật khẩu!' });
                }
                res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
            });
        });
    } catch (err) {
        console.error('❌ Lỗi xác thực token:', err);
        res.status(403).json({ error: 'Token không hợp lệ hoặc hết hạn!' });
    }
});

// API lấy danh sách địa chỉ
app.get('/addresses', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Không có token!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        const userId = decoded.id;

        db.all(`SELECT * FROM Addresses WHERE user_id = ?`, [userId], (err, addresses) => {
            if (err) {
                console.error('❌ Lỗi truy vấn địa chỉ:', err);
                return res.status(500).json({ error: 'Lỗi truy vấn địa chỉ!' });
            }
            res.json(addresses || []); // Trả về mảng rỗng nếu không có địa chỉ
        });
    } catch (err) {
        console.error('❌ Lỗi xác thực token:', err);
        res.status(403).json({ error: 'Token không hợp lệ hoặc hết hạn!' });
    }
});

// API thêm địa chỉ mới
app.post('/addresses', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const { full_name, address, phone, is_default } = req.body;

    // Kiểm tra token
    if (!token) {
        return res.status(401).json({ error: 'Không có token!' });
    }

    // Kiểm tra dữ liệu đầu vào
    if (!full_name || !address || !phone) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin!' });
    }

    try {
        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        const userId = decoded.id;

        // Nếu địa chỉ mới được đặt làm mặc định, bỏ trạng thái mặc định của các địa chỉ khác
        if (is_default) {
            db.run(`UPDATE Addresses SET is_default = 0 WHERE user_id = ?`, [userId], (err) => {
                if (err) {
                    console.error('❌ Lỗi cập nhật trạng thái mặc định:', err);
                }
            });
        }

        // Thêm địa chỉ mới vào database
        db.run(
            `INSERT INTO Addresses (user_id, full_name, address, phone, is_default) VALUES (?, ?, ?, ?, ?)`,
            [userId, full_name, address, phone, is_default ? 1 : 0],
            function (err) {
                if (err) {
                    console.error('❌ Lỗi khi thêm địa chỉ:', err);
                    return res.status(500).json({ error: 'Lỗi khi thêm địa chỉ!' });
                }
                res.status(201).json({ message: 'Thêm địa chỉ thành công!', addressId: this.lastID });
            }
        );
    } catch (err) {
        console.error('❌ Lỗi xác thực token:', err);
        res.status(403).json({ error: 'Token không hợp lệ hoặc hết hạn!' });
    }
});

// 🟢 Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});