const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {

    async index(req, res) {
        const { user } = req.headers;

        //Buscando o usuário logado
        const loggedDev = await Dev.findById(user);

        //Essa query retorna todos os usuários que não foram dados likes e dislikes.
        const users = await Dev.find({
            //Operador lógico AND.
            $and: [
                //Validando se os ID's não são iguais. 
                //$ne = NOT EQUAL
                { _id: { $ne: user } },
                //E que este ID não esteja dentro da lista de usuário que ele já deu Like.
                //$nin = NOT IN
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } },
            ],
        })

        return res.json(users);
    },

    //store() é um método de criação.
   async store(req, res){
        const { username } = req.body;
        
        //Para não haver duplicidade no banco de dados, será feita uma verificação se o usuário já existe.
        const userExists = await Dev.findOne({user : username});
        //Se ele já existe, então retorna no JSON.
        if (userExists){
            return res.json(userExists);
        }

        //Se o usuário não existir, então ele continua com os comandos abaixo:

        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { name, bio, avatar_url: avatar } = response.data;
        
        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar
        })

        return res.json(dev);
    }
};