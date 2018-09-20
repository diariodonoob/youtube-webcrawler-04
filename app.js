require('dotenv').load()
const axios = require('axios')
const cheerio = require('cheerio')


const LeanResponse = (html, config) => {
    let $ = cheerio.load(html)
    return $(config.title).map(config.returnResponse($)).get()
}

const SearchNoticies = async (LeanResponse, config) => {
    try {
        const response = await axios({ url: config.url, method: 'get' })
        const objectReturn = await LeanResponse(response.data, config)
        return Promise.resolve(objectReturn)
    } catch (err) {
        return Promise.reject(err)
    }
}

const config = {
    title: '.tabela-times .tabela-body-linha',
    body: {
        tag: 'strong',
        table: 'td',
        class: '.tabela-pontos-ponto'
    },
    url: process.env.GLOBO_NOTICIES,
    returnResponse: ($) => (index, element) => ({
        time: $(element).find(config.body.tag).text(),
        posicao: $(element).children(config.body.table).eq(0).text(),
        pontos: $(config.body.class).eq(index).text()
    })
}

SearchNoticies(LeanResponse, config)
    .then(resp => console.log('response', resp))
    .catch(err => console.log('error', err))