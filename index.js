let lista = [];

const scrollToBottom = (id) => {
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
}

const mostrar = () => {
    let lista_local = JSON.parse(localStorage.getItem('lista'));
    if(!lista_local) {
        lista_local = [];
    }
    lista = lista_local;
    let txt = '';
    for(let {titulo, descripcion, index, completed, important} of lista) {
        txt += `<div index="${index}">
            <div class="d-flex justify-content-between">
                <div>
                    <h3>${titulo}</h3>
                    <p>${descripcion}</p>
                </div>
                <div class="d-flex flex-column">
                    <button ${completed ? 'disabled' : ''} onclick=editar(${index}) data-bs-toggle="modal" data-bs-target="#editModal" class="btn bg-transparent">
                        <i class="bi bi-pencil-square h4"></i>
                    </button>
                    <button onclick=completed(${index}) class="btn ${completed ? 'btn-success' : 'bg-transparent'}">
                        <i class="bi bi-check-square h4"></i>
                    </button>
                    <button ${completed ? 'disabled' : ''} onclick=important(${index})  class="btn ${important ? 'btn-warning' : 'bg-transparent'}">
                        <i class="bi bi-exclamation-square h4"></i>
                    </button>
                    <button  onclick=eliminar(${index}) class="btn bg-transparent">
                        <i class="bi bi-x-square h4"></i>
                    </button>
                </div>
            </div>
            <hr>
        </div>`
    }
    document.getElementById('lista').innerHTML = txt;
}

const add = (item) => {
    lista.push(item);
    localStorage.setItem('lista', JSON.stringify(lista));
    mostrar();
    scrollToBottom('lista');
}


const refresh = () => {
    localStorage.setItem('lista', JSON.stringify(lista));
    mostrar();
}

const update = (item) => {
    lista = lista.map(el=> el.index === item.index ? item : el);
    console.log("Update", lista);
    refresh();
}


function eliminar(index) {
    lista = lista.filter(el=> el.index !== index);
    refresh();
}

function completed(index) {
    const item = lista.find(el=> el.index === index);
    item.completed = !item.completed;
    refresh();
}

function important(index) {
    const item = lista.find(el=> el.index === index);
    item.important = !item.important;
    refresh();
}

function editar(index) {
    const item = lista.find(el=> el.index === index);
    const form = document.getElementById('edit_form');
    for(let key in item) {
        form.querySelector(`[name=${key}]`).value = item[key];
    }    
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded");
    mostrar();
    document.getElementById('new_form').addEventListener('submit', function(e) {
        e.preventDefault();
        const f = new FormData(this);
        const titulo = f.get('titulo');
        const descripcion = f.get('descripcion');
        const item = {
            titulo,
            descripcion,
            index: lista.length ? lista[lista.length -1].index + 1 : 0
        }
        add(item);
        this.reset();
    });  
    
    document.getElementById('edit_form').addEventListener('submit', function(e) {
        e.preventDefault();
        const f = new FormData(this);
        const titulo = f.get('titulo');
        const descripcion = f.get('descripcion');
        const index = parseInt(f.get('index'));
        const item = {
            titulo,
            descripcion,
            index
        }
        update(item);
        this.reset();
        const closebtn = document.querySelector('.close_edit');
        closebtn.click();
    });  
});