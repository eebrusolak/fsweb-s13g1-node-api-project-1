const express = require("express");
const cors = require("cors");

const server = express();

server.use(express.json());
server.use(cors());

const Users = require("./users/model");

server.get("/", (req, res) => {
    res.status(200).send("Server is running");
});


// ✅ GET ALL USERS
server.get('/api/users', (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).send(users);
        })
        .catch(() => { // 🔥 try-catch yerine .catch kullandık
            res.status(500).send({ message: "Kullanıcı bilgileri alınamadı" });
        });
});


// ✅ POST USER
server.post('/api/users', (req, res) => {
    if (!req.body.name || !req.body.bio) {
        return res.status(400).send({ message: "Lütfen kullanıcı için bir name ve bio sağlayın" });
    }

    Users.insert(req.body)
        .then(user => {
            res.status(201).send(user); // 🔥 200 → 201 yaptık
        })
        .catch(() => {
            res.status(500).send({ message: "Veritabanına kaydedilirken bir hata oluştu." });
        });
});


// ✅ GET USER BY ID
server.get('/api/users/:id', (req, res) => {
    Users.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
            }
            res.status(200).send(user); // 🔥 eksikti, ekledik
        })
        .catch(() => {
            res.status(500).send({ message: "Kullanıcı bilgisi alınamadı" });
        });
});


// ✅ DELETE USER
server.delete('/api/users/:id', (req, res) => {
    Users.remove(req.params.id) // 🔥 paramd → params düzeltildi
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).send({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
            }
            res.status(200).send(deletedUser);
        })
        .catch(() => {
            res.status(500).send({ message: "Kullanıcı silinemedi" });
        });
});


// ✅ UPDATE USER
server.put('/api/users/:id', (req, res) => {
    if (!req.body.name || !req.body.bio) {
        return res.status(400).send({ message: "Lütfen kullanıcı için name ve bio sağlayın" }); // 🔥 mesaj düzeltildi
    }

    Users.update(req.params.id, req.body)
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).send({ message: "Belirtilen ID'li kullanıcı bulunamadı" }); // 🔥 400 → 404
            }
            res.status(200).send(updatedUser); // 🔥 scope hatası düzeltildi
        })
        .catch(() => {
            res.status(500).send({ message: "Kullanıcı bilgileri güncellenemedi" });
        });
});


module.exports = server;