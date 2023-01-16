const express = require('express');
const main = require('../scrapeFn/scrape');
const routes = express.Router();

routes.post('/indeed',async (req,res) => {
    try {
        const { skill } = req.body ;
        let scrp = await main(skill) ;

        return res.status(200).json({
            status : "ok" ,
            list : scrp?.list || {}
        })

    }
    catch(e){
        return res.status(500).send(e) ;
    }
})

module.exports = routes ;