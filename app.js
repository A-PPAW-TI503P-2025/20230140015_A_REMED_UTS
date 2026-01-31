const express = require('express');
const app = express();
const sequelize = require('./config/database');
const Book = require('./models/book');
const BorrowLog = require('./models/borrowlog');
const checkRole = require('./middleware/auth');

app.use(express.json());

// PUBLIC: Melihat semua buku
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN: Tambah buku baru
app.post('/api/books', checkRole('admin'), async (req, res) => {
    try {
        const { title, author, stock } = req.body;
        if (!title || !author) return res.status(400).json({ message: "Data tidak boleh kosong" });
        const book = await Book.create({ title, author, stock });
        res.status(201).json(book);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// USER: Pinjam buku (Logic: Kurangi stok & catat lokasi)
app.post('/api/borrow', checkRole('user'), async (req, res) => {
    const { bookId, latitude, longitude } = req.body; // Ambil data lokasi
    const userId = req.headers['x-user-id'];

    if (!bookId || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ message: "Data tidak lengkap (bookId, lat, long diperlukan)" });
    }

    try {
        const book = await Book.findByPk(bookId);
        if (book && book.stock > 0) {
            await book.decrement('stock'); // Kurangi stok
            const log = await BorrowLog.create({ userId, bookId, latitude, longitude }); // Simpan log lokasi
            res.json({ message: "Berhasil meminjam", log });
        } else {
            res.status(400).json({ message: "Buku tidak tersedia atau stok habis" });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Jalankan Server & Sinkronisasi DB
sequelize.sync({ alter: true }).then(() => {
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}).catch(err => console.log('DB Error: ' + err));