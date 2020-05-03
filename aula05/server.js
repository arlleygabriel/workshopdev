//Usei o express para criar e configurar meu servidor
const express = require("express")
const server = express()

const db = require('./db')

//const ideas = 
//[
//  {
//    img: 'https://image.flaticon.com/icons/svg/2728/2728995.svg',
//    tittle:'Cursos de programação',
//    category:'Estudo',
//    description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt dicta, praesentium suscipit perferendis atque nostrum reprehenderit quaerat officia, fugit aperiam dignissimos quam incidunt vel accusantium hic placeat, exercitationem doloribus voluptatum.',
//    url: 'https://rocketseat.com.br/',
//  },
//
//  {
//    img:'https://image.flaticon.com/icons/svg/2761/2761891.svg',
//    tittle:'Exercícios',
//    category:'Saúde',
//    description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt dicta, praesentium suscipit perferendis atque nostrum reprehenderit quaerat officia, fugit aperiam dignissimos quam incidunt vel accusantium hic placeat, exercitationem doloribus voluptatum.',
//    url: 'https://rocketseat.com.br/',
//  },
//
//  {
//    img:'https://image.flaticon.com/icons/svg/1830/1830774.svg',
//    tittle:'Meditação',
//    category:'Mentalidade',
//    description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt dicta, praesentium suscipit perferendis atque nostrum reprehenderit quaerat officia, fugit aperiam dignissimos quam incidunt vel accusantium hic placeat, exercitationem doloribus voluptatum.',
//    url: 'https://rocketseat.com.br/',
//  },
//
//  {
//    img:'https://image.flaticon.com/icons/svg/1941/1941126.svg',
//    tittle:'Karaokê',
//    category:'Diverão em família',
//    description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt dicta, praesentium suscipit perferendis atque nostrum reprehenderit quaerat officia, fugit aperiam dignissimos quam incidunt vel accusantium hic placeat, exercitationem doloribus voluptatum.',
//    url: 'https://rocketseat.com.br/',
//  },
//]


//Configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

//Habilitar uso do req.body
server.use(express.urlencoded({ extended: true}))

//Configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
  express: server,
  noCache: true,
})

//Criei uma rota /
//E capturo o pedido do cliente para responder
server.get("/", function(req,res){

  db.all(`SELECT * FROM ideas`, function(err, rows)
   {
      if(err)
      {
        console.log(err)
        return res.send('Erro no Banco de Dados')
      } 
      //console.log(rows)

      const reversedIdeas = [...rows].reverse()
      let lastIdeas = []
      
      for (let idea of reversedIdeas)
      {
        if(lastIdeas.length < 2)
      {
        lastIdeas.push(idea)
      }
      }
      return res.render("index.html", { ideas : lastIdeas })
    })
    
    
})

server.get("/ideias", function(req,res){
  db.all(`SELECT * FROM ideas`, function(err, rows) {
    if(err)
    {
      console.log(err)
      return res.send('Erro no Banco de Dados')
    } 
    console.log(rows)
    const reversedIdeas = [...rows].reverse()

    return res.render("ideias.html", {ideas: reversedIdeas})

  })
  
})

server.post('/', function(req,res){
      //Inserir dado na tabela
      const query = `
          INSERT INTO ideas(
          image,
          title,
          category,
          description,
          link
      ) VALUES(?,?,?,?,?);
      `
      const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
      ]
      
      
      db.run(query, values, function(err){
        if(err)
        {
          console.log(err)
          return res.send('Erro no Banco de Dados')
        } 
        
        return res.redirect('/ideias')

      })
})


//Servidor ouvindo na porta 3000
server.listen(3000)