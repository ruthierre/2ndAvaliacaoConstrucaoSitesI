'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_produto')) ?? []
const setLocalStorage = (dbProduto) => localStorage.setItem("db_produto", JSON.stringify(dbProduto))

const createCategory = () => {
    window.location.href = 'categoria.html'
}

// CRUD - create read update delete
const deleteproduto = (index) => {
    const dbProduto = readproduto()
    dbProduto.splice(index, 1)
    setLocalStorage(dbProduto)
}

const updateproduto = (index, produto) => {
    const dbProduto = readproduto()
    dbProduto[index] = produto
    setLocalStorage(dbProduto)
}

const readproduto = () => getLocalStorage()

const createproduto = (produto) => {
    const dbProduto = getLocalStorage()
    dbProduto.push (produto)
    setLocalStorage(dbProduto)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('name').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Novo produto'
}

const saveproduto = () => {
    if (isValidFields()) {
        const produto = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            price: document.getElementById('price').value
        }
        const index = document.getElementById('name').dataset.index
        if (index == 'new') {
            createproduto(produto)
            updateTable()
            closeModal()
        } else {
            updateproduto(index, produto)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (produto, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${produto.name}</td>
        <td>${produto.description}</td>
        <td>${produto.category}</td>
        <td>${produto.price}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableproduto>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableproduto>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbProduto = readproduto()
    clearTable()
    dbProduto.forEach(createRow)
}

const fillFields = (produto) => {
    document.getElementById('name').value = produto.name
    document.getElementById('description').value = produto.description
    document.getElementById('category').value = produto.category
    document.getElementById('price').value = produto.price
    document.getElementById('name').dataset.index = produto.index
}

const editproduto = (index) => {
    const produto = readproduto()[index]
    produto.index = index
    fillFields(produto)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${produto.name}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editproduto(index)
        } else {
            const produto = readproduto()[index]
            const response = confirm(`Deseja realmente excluir o produto ${produto.name}`)
            if (response) {
                deleteproduto(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarproduto')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveproduto)

document.querySelector('#tableproduto>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

document.getElementById('cadastrarCategoria')
    .addEventListener('click', createCategory)

 