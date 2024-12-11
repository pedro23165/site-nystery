const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const { addUser, findUser, updateUser, deleteUser, listUsers, db, listSessions, addSession, deleteSession, dbs } = require('./banco6');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    store: new SQLiteStore({ db: 'sessions.db' }),
    secret: 'seuSegredoAqui', // Troque por uma chave secreta mais segura em produção
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Deve ser true se usar HTTPS
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    console.log("pegando index6");
    res.sendFile(path.join(__dirname, 'public', 'index6.html'));
});

// Rota de registro de usuário
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    addUser(username, password)
        .then(userId => {
            res.json({ message: 'Usuário registrado com sucesso!', userId });
        })
        .catch(err => {
            res.status(400).json({ message: 'Erro ao registrar usuário: ' + err.message });
        });
});

// Rota de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log("app.post('/login'):" + password);
    findUser(username)
        .then(user => {
            if (user && user.password === password) {
                req.session.user = { username }; // Armazenando o usuário na sessão
                // Salvar a sessão no banco de dados
                const sessionId = req.session.id; // ID da sessão gerada
                const sessionData = JSON.stringify(req.session); // Dados da sessão
                const expires = req.session.cookie.expires ? req.session.cookie.expires.getTime() : null; // Tempo de expiração da sessão
/*
                addSession(sessionId, req.session.user, expires)
                    .then(sId => {
                        res.json({ message: 'Usuário logado com sucesso!', sId });
                    })
                    .catch(err => {
                        res.status(400).json({ message: 'Erro ao registrar usuário: ' + err.message });
                    });
*/              res.json({ message: 'Usuário logado com sucesso!', user });
            } else {
                res.status(401).json({ message: 'Usuário ou senha inválidos.' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Erro ao verificar usuário: ' + err.message });
        });
});

// Rota para atualizar um usuário
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    updateUser(id, username, password)
        .then(changes => {
            if (changes === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
            res.json({ message: 'Usuário atualizado com sucesso!' });
        })
        .catch(err => {
            res.status(400).json({ message: 'Erro ao atualizar usuário: ' + err.message });
        });
});

// Rota para remover um usuário
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    deleteUser(id)
        .then(changes => {
            if (changes === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
            res.json({ message: 'Usuário removido com sucesso!' });
        })
        .catch(err => {
            res.status(400).json({ message: 'Erro ao remover usuário: ' + err.message });
        });
});


// Rota para verificar a sessão
app.get('/session', (req, res) => {
    if (req.session.user) {
        return res.json({ loggedIn: true, user: req.session.user });
    }
    return res.json({ loggedIn: false });
});

// Rota de logout
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao encerrar a sessão.' });
        }
        return res.json({ message: 'Logout realizado com sucesso!' });
    });
});

app.get('/users', (req, res) => {
    listUsers()
        .then(users => {
            res.json(users); // Retorna a lista de usuários em formato JSON
        })
        .catch(err => {
            res.status(500).json({ message: 'Erro ao listar usuários: ' + err.message });
        });
});

// Rota para remover um sessao
app.delete('/session/:id', (req, res) => {
    const { id } = req.params;

    deleteSession(id)
        .then(changes => {
            if (changes === 0) {
                return res.status(404).json({ message: 'Sessão do Usuário não encontrado.' });
            }
            res.json({ message: 'Sessão do Usuário removido com sucesso!' });
        })
        .catch(err => {
            res.status(400).json({ message: 'Erro ao remover sessão do usuário: ' + err.message });
        });
});

app.get('/sessions', (req, res) => {
    listSessions()
        .then(session => {
            res.json(session); // Retorna a lista de sessoes em formato JSON
        })
        .catch(err => {
            res.status(500).json({ message: 'Erro ao listar sessoes: ' + err.message });
        });
});




// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Fechar o banco de dados quando o processo for encerrado
process.on('SIGINT', () => {
    db.close();
    dbs.close();
    process.exit();
});
