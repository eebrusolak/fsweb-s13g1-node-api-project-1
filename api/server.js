const express = require("express");
const cors = require("cors");

const server = express();

server.use(express.json());
server.use(cors());

const Users = require("./users/model");

server.get("/", (req, res) => {
    res.status(200).send("Server is running");
});

server.get('/api/users', (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).send(users);
        })
        .catch(() => {
            res.status(500).send({ message: "Kullanıcı bilgileri alınamadı" });
        });
});

server.post('/api/users', (req, res) => {
    if (!req.body.name || !req.body.bio) {
        return res.status(400).send({ message: "Lütfen kullanıcı için bir name ve bio sağlayın" });
    }

    Users.insert(req.body)
        .then(user => {
            res.status(201).send(user);
        })
        .catch(() => {
            res.status(500).send({ message: "Veritabanına kaydedilirken bir hata oluştu." });
        });
});

server.get('/api/users/:id', (req, res) => {
    Users.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
            }
            res.status(200).send(user);
        })
        .catch(() => {
            res.status(500).send({ message: "Kullanıcı bilgisi alınamadı" });
        });
});

server.delete('/api/users/:id', (req, res) => {
    Users.remove(req.params.id)
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

server.put('/api/users/:id', (req, res) => {
    if (!req.body.name || !req.body.bio) {
        return res.status(400).send({ message: "Lütfen kullanıcı için name ve bio sağlayın" });
    }

    Users.update(req.params.id, req.body)
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).send({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
            }
            res.status(200).send(updatedUser);
        })
        .catch(() => {
            res.status(500).send({ message: "Kullanıcı bilgileri güncellenemedi" });
        });
});

module.exports = server;