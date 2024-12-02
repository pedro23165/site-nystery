const express = require('express');
const path = require('path');


const endereco = 'localhost';
const porta = 5000;


function criarServidor() {
    const app = express();

 
    app.use(express.static(path.join(__dirname, 'public')));

    
    const rotas = [
        { caminho: '/', arquivo: 'html/index.html' },
        { caminho: '/login', arquivo: 'html/login.html' },
        { caminho: '/cadastro', arquivo: 'html/cadastro.html' },
        { caminho: '/pagina', arquivo: 'html/pagina.html' },
    ];

    rotas.forEach((rota) => {
        app.get(rota.caminho, (req, res) => {
            res.sendFile(path.join(__dirname, 'public', rota.arquivo));
        });
    }); 

  
    app.listen(porta,endereco, () => {
        console.log(`Servidor rodando em http://${endereco}:${porta}`);
    });

    return app;
}


criarServidor();
