// ? от первого до 30 строки это чась crud - create

// ! url для отправки запроса
const API = "http://localhost:8000/todos";

let searchValue = "";

// ! вытаскиваем html-элементы (инпут, кнпока добавления
// ! и список,в который будем добавлять новые тудушки)
const inpAdd = document.querySelector(".add-todo");
const addBtn = document.querySelector(".add-btn");
const list = document.querySelector(".list-group");

//! объект, в котором хранятся данные нового туду,
//! который хотим добавить
let newTodo = { todo: "" };

// ! навешиваем слушатель событий на инпут для получения
// ! введенных данных и помещения их в newTodo
inpAdd.addEventListener("input", (e) => {
  newTodo = { todo: e.target.value };
});

// !асинхронная функция для добавления нового таска в db.json
async function addTodo() {
  if (!newTodo.todo.trim()) {
    alert("bruh, fill the gaps!");
    return;
  }
  try {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });
  } catch (error) {
    console.log(error, "ERROR");
  }
  inpAdd.value = "";
  newTodo.todo = "";
  getTodos(); //? для отображения нового добавленного таска без
  //? обновления страницы
}

// !слушатель событий для кнопки добавления
addBtn.addEventListener("click", addTodo);

// ? отсюда и дальше - это read

// ! функция для стягивания и отрисовки данных
async function getTodos() {
  try {
    let res = await fetch(`${API}?q=${searchValue}`); //? здесь будет object response
    let todos = await res.json(); //? массив с объектами (тасками)
    render(todos); // ? функция для отрисовки тасков
  } catch (error) {
    console.log(error);
  }
}

//? функция для отрисовки
function render(todos) {
  //? очищаем list во избежание дубликатов
  list.innerHTML = "";

  //? перебираем массив с тасками и на каждый таск
  //? отрисовываем li c кнопками
  todos.forEach((item) => {
    list.innerHTML += `<li class='list-group-item d-flex justify-content-between'>
    <p>${item.todo}</p>
    <button onclick="deleteTodo(${item.id})" class="btn btn-danger">
    Delete</button>
    <button onclick="editTodo(${item.id})" class="btn btn-warning" data-bs-toggle="modal"
    data-bs-target="#exampleModal">Edit</button>
    

    </li>`;
  });
}
getTodos();

//!DELETE
async function deleteTodo(id) {
  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
  } catch (error) {
    console.log(error);
  }
  getTodos();
}

// ! UPDATE

// ? вытаскиваем html-елементы для редактирования
const saveBtn = document.querySelector(".save-btn");
const inpEdit = document.querySelector(".inp-edit");
let editModal = document.querySelector("#exampleModal");

// ? объект в котором хранится отредактированный таск
let editedObj = {};

// ? переменная для хранения, изменяемого таска
let editTodoId = null;

// ? слушатель событий для обновления editedObj
inpEdit.addEventListener("input", (e) => {
  editedObj = { todo: e.target.value };
});
// ? функция, которая срабатывает принажатии на кнопку edit
async function editTodo(id) {
  try {
    //? стягиваем редактируемый таск с сервера
    let res = await fetch(`${API}/${id}`); // object response
    let objToEdit = await res.json();

    // ? помещяем стянутые данные в инпут
    inpEdit.value = objToEdit.todo;

    // ? перезаписываем id редактируемого таска
    editTodoId = id;
  } catch (error) {
    console.log(error);
  }
}
// ? слушатель событий для кнопки сохранения
saveBtn.addEventListener("click", async () => {
  try {
    // ? запрос для изменения данных в базе данных
    await fetch(`${API}/${editTodoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedObj),
    });
  } catch (error) {
    console.log(error);
  }

  //? для отображения измененного таска без перезагрузки
  getTodos();

  //   ? закрываем модальное окно
  let modal = bootstrap.Modal.getInstance(editModal);

  modal.hide();
});

// ! search

const searchInp = document.querySelector(".search-input");
searchInp.addEventListener("input", (e) => {
  searchValue = e.target.value;
  getTodos();
});
