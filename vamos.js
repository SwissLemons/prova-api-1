const express = require("express")
const app = express()
app.use(express.json())

const users = []
const products = []
let userIdCounter = 1
let productIdCounter = 1

// Funções auxiliares
const validateUser = (user) => {
  const errors = []
  if (!user.name || user.name.length < 3){
    errors.push("'Nome' deve conter no mínimo 3 caracteres")
  } 
  if (user.name.length > 150) {
    errors.push("'Nome' deve conter no máximo 150 caracteres")
  }
  if (!user.cpf || user.cpf.length !== 11 || isNaN(user.cpf)) {
    errors.push("'Cpf' deve conter 11 caracteres e apenas números")
  }
  if (!user.email || user.email.length < 3) {
    errors.push("'Email' deve conter no mínimo 3 caracteres")
  }
  if (user.email.length > 100) {
    errors.push("'Email' deve conter no máximo 100 caracteres")
  }
  if (!user.email.includes('@') || !user.email.split('@')[1].includes('.')) {
    errors.push("'Email' deve conter '@' e '.' após o '@'")
  }
  
  return errors
}
  
const validateProduct = (product) => {
  const errors = []
  if (!product.name || product.name.length < 3){
    errors.push("'Nome' deve conter no mínimo 3 caracteres")
  }
  if (product.name.length > 100) {
    errors.push("'Nome' deve conter no máximo 100 caracteres")
  } 
  if (product.price <= 0){
    errors.push("'Preço deve ser maior que 0'")
  } 

  return errors
}
  
//===---------------------------------------- Usuarios

app.get('/users', (req, res) => { //Busca todos os usuários cadastrados. 
  res.json(users)
})

app.post('/users', (req, res) => { //Cria um usuário.
  const errors = validateUser(req.body)
  console.log(errors)
  if (errors.length > 0) {
      return res.status(400).json({ errors })
  }
  const newUser = { id: userIdCounter++, ...req.body }
  
  users.push(newUser)
  res.status(201).json({ message: 'Usuário cadastrado com sucesso' })
})

app.get('/users/:id', (req, res) => { //Busca o usuário por ID. 
  const user = users.find(u => u.id === parseInt(req.params.id))
  if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  res.json(user)
})

app.put('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id))
  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }
  const errors = validateUser(req.body)
  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }
  users[userIndex] = { id: parseInt(req.params.id), ...req.body }
  res.json({ message: 'Usuário atualizado com sucesso' })
})
  
app.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id))
  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }
  users.splice(userIndex, 1)
  res.json({ message: 'Usuário removido com sucesso' })
})
  
  // Endpoints para produtos
app.get('/products', (req, res) => {
  res.json(products)
})
  
app.post('/products', (req, res) => {
  const errors = validateProduct(req.body)
  if (errors.length > 0) {
      return res.status(400).json({ errors })
  }
  const newProduct = { id: productIdCounter++, ...req.body }
  
  products.push(newProduct)
  res.status(201).json({ message: 'Produto cadastrado com sucesso' })
})
  
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id))
  if (!product) {
    return res.status(404).json({ message: 'Produto não encontrado' })
  }
  res.json(product)
})
  
app.put('/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id))
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Produto não encontrado' })
  }
  const errors = validateProduct(req.body)
  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }
  products[productIndex] = { id: parseInt(req.params.id), ...req.body }
  res.json({ message: 'Produto atualizado com sucesso' })
})
  
app.delete('/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id))
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Produto não encontrado' })
  }
  products.splice(productIndex, 1)
  res.json({ message: 'Produto removido com sucesso' })
})

app.listen(3000, () => { 
  console.log("Servidor rodando na porta 3000")
})
