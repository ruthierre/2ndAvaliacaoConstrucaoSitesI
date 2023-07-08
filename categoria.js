'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_categoria')) ?? []
const setLocalStorage = (dbcategoria) => localStorage.setItem("db_categoria", JSON.stringify(dbcategoria))

const createProduto = () => {
    window.location.href = 'index.html'
}

/// CRUD da Categoria /////

const creatCategoria = (categoria) => {
    const dbcategoria = getLocalStorage()
    dbcategoria.push(categoria)
    setLocalStorage(dbcategoria)
}

const readCategoria = () => getLocalStorage()

const updateCategoria = (index, categoria ) => {
    const dbcategoria = readCategoria()
    dbcategoria[index] = categoria
    setLocalStorage(dbcategoria)
}

const deleteCategoria = (index) => {
    const dbcategoria = readCategoria()
    dbcategoria.splice(index, 1)
    setLocalStorage(dbcategoria)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

/// Interação do Layout ////

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('category').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Nova categoria'
}

const savecategoria = () => {
    if (isValidFields()) {
        const categoria = {
            categoria: document.getElementById('category').value,
            description: document.getElementById('description').value
        }
        const index = document.getElementById('category').dataset.index
        if (index == 'new') {
            creatCategoria(categoria)
            updateTable()
            closeModal()
        } else {
            updateCategoria(index, categoria)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (categoria, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${categoria.category}</td>
        <td>${categoria.description}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tablecategoria>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tablecategoria>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbcategoria = readCategoria()
    clearTable()
    dbcategoria.forEach(createRow)
}

const fillFields = (categoria) => {
    document.getElementById('category').value = categoria.category
    document.getElementById('description').value = categoria.description
}

const editcategoria = (index) => {
    const categoria = readCategoria()[index]
    categoria.index = index
    fillFields(categoria)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${categoria.category}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editcategoria(index)
        } else {
            const categoria = readCategoria()[index]
            const response = confirm(`Deseja realmente excluir o categoria ${categoria.category}`)
            if (response) {
                deleteCategoria(index)
                updateTable()
            }
        }
    }

}

updateTable()

/// Eventos 

document.getElementById('cadastrarcategoria')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', savecategoria)

document.querySelector('#tablecategoria>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

document.getElementById('cadastrarproduto')
    .addEventListener('click', createProduto)