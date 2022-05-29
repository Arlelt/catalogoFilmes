import { inserirFilme } from "../repository/filmeRepository.js";

import { Router } from "express";
const server = Router();

server.post('/filme', async (req, resp) => {
    try {
        const filmeInserir = req.body;


        const filme = await inserirFilme(filmeInserir);

        if (!filmeInserir) 
            throw new Error('Põe o nome do filme animal')

        resp.send(filme);
    } catch (err) {
        resp.status(400).send({
            "erro":err.message
        })
    } 
})

export default server;