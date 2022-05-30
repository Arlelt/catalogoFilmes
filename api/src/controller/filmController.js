import { alterarFilme, alterarImagem, buscarPorId, buscarPorNome, delFilme, inserirFilme, listarTodosFilmes } from "../repository/filmeRepository.js";
import multer from 'multer';
import { Router } from "express";
const server = Router();
const upload = multer({ dest: 'storage/capasfilmes'});

server.post('/filme', async (req, resp) => {
    try {
        const filmeInserir = req.body;

        if (!filmeInserir.nome)
            throw new Error('Põe o nome do filme animal')
        if (!filmeInserir.sinopse)
            throw new Error('sinopse obrigatória')
        if (filmeInserir.avaliacao == undefined || filmeInserir.avaliacao < 0)
            throw new Error('avaliação obrigatória')
        if (!filmeInserir.lancamento)
            throw new Error('data de lançamento obrigatória')
        if (filmeInserir.disponivel == undefined)
            throw new Error('campo disponível obrigatório')
        if (!filmeInserir.usuario)
            throw new Error('usuário não logado!')

        const filme = await inserirFilme(filmeInserir);

        resp.send(filme);
    } catch (err) {
        resp.status(400).send({
            "erro": err.message
        })
    }
})

server.put('/filme/:id/imagem', upload.single('capa'), async (req, resp) => {
    try {
        const {id} = req.params;
        const imagem = req.file.path;
        const resposta = await alterarImagem(imagem, id);
        if (resposta != 1)
            throw new Error('A imagem não pôde ser salva')
        resp.status(204).send();
    } catch (err) {
        resp.status(400).send({
            "erro": err.message
        })
    }
})

server.get('/filme', async (req, resp) => {
    try {
        const resposta = await listarTodosFilmes();
        resp.send(resposta);
    } catch (err) {
        resp.status(400).send({
            "erro": err.message
        })
    }
})

server.get('/filme/busca', async (req, resp) => {
    try {
        const {nome} = req.query;
        const resposta = await buscarPorNome(nome);

        if (resposta.length == 0) {
            resp.status(404).send([])
        } else {
            resp.send(resposta)
        }
    } catch (err) {
        resp.status(400).send({
            "erro": err.message
        })
    }
})

server.get('/filme/:id', async (req, resp) => {
    try {
        const {id} = req.params;
        const resposta = await buscarPorId(id);

        if (!resposta) {
            resp.status(404).send([])
        } else {
            resp.send(resposta)
        }
    } catch (err) {
        resp.status(400).send({
            "erro": err.message
        })
    }
})

server.delete('/filme/:id', async (req, resp) => {
    try {
        const {id} = req.params;
        const resposta = await delFilme(id);
        if (resposta != 1)
            throw new Error('O filme não pôde ser removido')
        resp.status(204).send();
        
    } catch (err) {
        resp.status(400).send({
            "erro": err.message
        })
    }
})

server.put('/filme/:id', async (req, resp) => {
    try {
        const {id} = req.params;
        const filme = req.body;

        if (!filme.nome)
            throw new Error('Põe o nome do filme animal')
        if (!filme.sinopse)
            throw new Error('sinopse obrigatória')
        if (filme.avaliacao == undefined || filme.avaliacao < 0)
            throw new Error('avaliação obrigatória')
        if (!filme.lancamento)
            throw new Error('data de lançamento obrigatória')
        if (filme.disponivel == undefined)
            throw new Error('campo disponível obrigatório')
        if (!filme.usuario)
            throw new Error('usuário não logado!')

        const resposta = await alterarFilme(id, filme);
        if (resposta != 1)
            throw new Error('O filme não pôde ser alterado')
        resp.status(204).send();
        
    } catch (err) {
        resp.status(400).send({
            "erro": err.message
        })
    }
})





export default server;