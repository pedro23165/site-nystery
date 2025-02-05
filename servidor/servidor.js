const express = require('express');
const path = require('path');

// Configurações do servidor
const endereco = 'localhost';
const porta = 5000;

function criarServidor() {
    const app = express();

    // Configuração da pasta estática (CSS, JS, imagens, etc.)
    app.use(express.static(path.join(__dirname, 'public')));

    // Rotas específicas para os arquivos HTML
    const rotas = [
        { caminho: '/', arquivo: 'html/index.html' },
        { caminho: '/login', arquivo: 'html/login.html' },
        { caminho: '/cadastro', arquivo: 'html/cadastro.html' },
        { caminho: '/pagina', arquivo: 'html/pagina.html' },
        { caminho: '/reciclagem', arquivo: 'html/reciclagem.html' },
        { caminho: '/sobre', arquivo: 'html/sobre.html' },
        { caminho: '/relatorio', arquivo: 'html/relatorio.html' },
        { caminho: '/instrucoes', arquivo: 'html/instrucoes.html' },
        { caminho: '/faleconosco', arquivo: 'html/faleconosco.html' },
        { caminho: '/doacoes', arquivo: 'html/doacoes.html' },
        { caminho: '/calendario', arquivo: 'html/calendario.html' },
        { caminho: '/cadastrovoluntario', arquivo: 'html/cadastrovoluntario.html' },
        { caminho: '/tarefas', arquivo: 'html/tarefas.html' },
    ];

    // Configuração de cada rota para servir os arquivos HTML
    rotas.forEach((rota) => {
        app.get(rota.caminho, (req, res) => {
            res.sendFile(path.join(__dirname, 'public', rota.arquivo));
        });
    });

    // Inicialização do servidor
    app.listen(porta, endereco, () => {
        console.log(`Servidor rodando em http://${endereco}:${porta}`);
    });

    return app;
}

// Inicializa o servidor
criarServidor();
