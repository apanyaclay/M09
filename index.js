const express = require('express');
const mysql2 = require('mysql2');

const app = express();

// parsing data json dari client
app.use(express.json());

// parsing data form urlencoded
app.use(express.urlencoded({extended: false}));

const conn = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_db'
});

conn.connect((err) => {
    if(err) {
        console.log("Error connecting to Db");
        console.error(err)
        return;
    } else{
        console.log("Database is Connected...")
    }
});

app.get('/api/products', (req, res) => {
    let sql = 'SELECT * FROM product';
    conn.query(sql, (err, result) => {
        if(err) throw err;
        res.json({
            status: 200,
            error: null,
            response: result
        });
    });
});

app.get('/api/products/:id', (req, res) => {
    let sql = `SELECT * FROM product WHERE product_id = ${req.params.id}`;
    conn.query(sql, (err, result) => {
        if(err) throw err;
        if (result.length > 0) {
            res.json({
                status: 200,
                error: null,
                response: result
            });
        }
        res.json({
            status: 401,
            error: `Product ID ${req.params.id} tidak ditemukan`
        })
    });
});

app.post('/api/products', (req, res) => {
    const product = {
        product_name: req.body.product_name,
        product_price: req.body.product_price
    };
    let sql = `INSERT INTO product SET ?`;
    conn.query(sql, product, (err, result) => {
        if(err) throw err;
        res.json({
            status: 200,
            error: null,
            response: result
        });
    });
});

// update product berdasarkan id
app.put('/api/products/:id', (req, res) => {
    let sql = `UPDATE product SET product_name = '${req.body.product_name}', product_price = ${req.body.product_price} WHERE product_id = ${req.params.id}`;
    conn.query(sql, (err, result) => {
        if(err) throw err;
        if(result.changedRows > 0) {
            res.json({
                status: 200,
                error: null,
                response: `Product ID ${req.params.id} berhasil diupdate`
            });
        }
        res.json({
            status: 401,
            error: `Product ID ${req.params.id} tidak ditemukan`
        })
    });
});

// hapus data berdasarkan id
app.delete('/api/products/:id', (req, res) => {
    let sql = `DELETE FROM product WHERE product_id = ${req.params.id}`;
    conn.query(sql, (err, result) => {
        if(err) throw err;
        if(result.affectedRows > 0) {
            res.json({
                status: 200,
                error: null,
                response: `Product ID ${req.params.id} berhasil dihapus`
            });
        }
        res.json({
            status: 401,
            error: `Product ID ${req.params.id} tidak ditemukan`
        })
    });
});

app.get('/api/comments', (req, res) => {
    let sql = 'SELECT * FROM comment';
    conn.query(sql, (err, result) => {
        if(err) throw err;
        res.json({
            status: 200,
            error: null,
            response: result
        });
    });
});

app.post('/api/comment', (req, res) => {
    const comment = req.body
    let sql = `INSERT INTO comment SET ?`;
    conn.query(sql, comment, (err, result) => {
        if(err) throw err;
        res.json({
            status: 200,
            error: null,
            response: result
        });
    });
});

app.get('/api/comment/:id', (req, res) => {
    let sql = `SELECT * FROM comment WHERE comment_id = ${req.params.id}`;
    conn.query(sql, (err, result) => {
        if(err) throw err;
        if (result.length > 0) {
            res.json({
                status: 200,
                error: null,
                response: result
            });
        }
        res.json({
            status: 401,
            error: `Comment ID ${req.params.id} tidak ditemukan`
        })
    });
});

app.get('/api/comment/customer/:id', (req, res) => {
    let sql = `SELECT * FROM comment WHERE cust_id = ${req.params.id}`;
    conn.query(sql, (err, result) => {
        if(err) throw err;
        if (result.length > 0) {
            res.json({
                status: 200,
                error: null,
                response: result
            });
        }
        res.json({
            status: 401,
            error: `Customer ID ${req.params.id} tidak ditemukan`
        })    
    })
});

app.delete('/api/comment/:id', (req, res) => {
    let sql = `DELETE FROM comment WHERE comment_id = ${req.params.id}`;
    conn.query(sql, (err, result) => {
        if(err) throw err;
        if (result.affectedRows > 0) {
            res.json({
                status: 200,
                error: null,
                message: 'Komentar berhasil dihapus'
                });
        }
        res.json({
            status: 401,
            error: `Comment ID ${req.params.id} tidak ditemukan`
        });
    });
});

app.listen(4444);