// Tüm Elementleri Seçmek
const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const clearButton = document.querySelector("#clearButton");
const filterInput = document.querySelector("#todoSearch");
let todos = [];

runEvents();

function runEvents() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", pageLoaded);
    secondCardBody.addEventListener("click", handleButtonClicks);
    clearButton.addEventListener("click", allTodosEverywhere);
    filterInput.addEventListener("keyup", filter);
}

function pageLoaded() {
    checkTodosFromStorage();
    todos.forEach(function (todo) {
        addTodoToUI(todo.text, todo.checked);
    });
}

function handleButtonClicks(e) {
    if (e.target.classList.contains("delete-button")) {
        // Eğer tıklanan element delete-button sınıfına sahipse, bu todo'yu sil
        const todo = e.target.parentElement;
        todo.remove();

        // Storage'dan Silme
        removeTodoToStorage(todo.textContent.replace("DeleteEdit", "").trim());
        showAlert("success", "Todo başarıyla silindi..");
    } else if (e.target.classList.contains("edit-button")) {
        // Eğer tıklanan element edit-button sınıfına sahipse, todo'yu düzenleme işlevini çağır
        editTodo(e.target.parentElement);
    } else if (e.target.classList.contains("checkbox")) {
        // Eğer tıklanan element checkbox sınıfına sahipse, todo'nun durumunu güncelle
        const todoText = e.target.parentElement.querySelector("label").textContent.trim();
        toggleTodoStatus(todoText);
    }
}

function editTodo(todoElement) {

    const todoText = todoElement.querySelector("label").textContent.trim();
    const editedText = prompt("Todo'yu düzenle:", todoText);

    if (editedText !== null) {
        // Kullanıcı bir şey girdiyse ve "İptal" düğmesine basmadıysa, todo'yu güncelle
        todoElement.querySelector("label").textContent = editedText;

        // Storage'da güncelleme
        updateTodoInStorage(todoText, editedText);
        showAlert("success", "Todo başarıyla güncellendi.");
    }
}

function updateTodoInStorage(oldTodoText, newTodoText) {
    checkTodosFromStorage();
    todos = todos.map(function (todo) {
        if (todo.text === oldTodoText) {
            return { text: newTodoText, checked: todo.checked };
        } else {
            return todo;
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function toggleTodoStatus(todoText) {
    checkTodosFromStorage();
    todos = todos.map(function (todo) {
        if (todo.text === todoText) {
            return { text: todoText, checked: !todo.checked };
        } else {
            return todo;
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function filter(e) {
    const filterValue = e.target.value.toLowerCase().trim();
    const todoListesi = document.querySelectorAll(".list-group-item");

    if (todoListesi.length > 0) {
        todoListesi.forEach(function (todo) {
            const todoText = todo.querySelector("label").textContent.toLowerCase().trim();
            if (todoText.includes(filterValue)) {
                todo.style.display = "block";
            } else {
                todo.style.display = "none";
            }
        });
    } else {
        showAlert("warning", "Filtreleme yapmak için en az bir todo olmalıdır!");
    }
}

function allTodosEverywhere() {
    const todoListesi = document.querySelectorAll(".list-group-item");
    if (todoListesi.length > 0) {
        // Ekrandan Silme
        todoListesi.forEach(function (todo) {
            todo.remove();
        });

        // Storage'dan Silme
        todos = [];
        localStorage.setItem("todos", JSON.stringify(todos));
        showAlert("success", "Başarılı bir şekilde silindi..");
    } else {
        showAlert("warning", "Silmek için en az bir todo olmalıdır!");
    }
}

function removeTodoToStorage(removeTodo) {
    checkTodosFromStorage();
    todos = todos.filter(function (todo) {
        return todo.text !== removeTodo;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo(e) {
    const inputText = addInput.value.replace("DeleteEdit", "").trim().replace("[object Object]", "");
    if (inputText === "") {
        showAlert("warning", "Lütfen boş bırakmayınız!");
    } else {
        // Arayüze ekleme
        addTodoToUI(inputText, false); 
        addTodoToStorage(inputText, false);
        showAlert("success", "Todo Eklendi!");
    }

    // Inputu temizleme
    addInput.value = "";

    // Sayfa yenilemesini engelleme
    e.preventDefault();
}

function addTodoToUI(newTodo, isChecked) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = isChecked;

    li.appendChild(checkbox);

    const label = document.createElement("label");
    label.textContent = newTodo;
    label.style.fontStyle = "italic"; 

    li.appendChild(label);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.textContent = "Edit";

    li.appendChild(deleteButton);
    li.appendChild(editButton);
    todoList.appendChild(li);
}

function addTodoToStorage(newTodo, isChecked) {
    checkTodosFromStorage();
    todos.push({ text: newTodo, checked: isChecked });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function checkTodosFromStorage() {
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
}

function showAlert(type, message) {
    const div = document.createElement("div");
    div.className = `alert alert-${type}`;
    div.textContent = message;

    firstCardBody.appendChild(div);

    setTimeout(function () {
        div.remove();
    }, 2500);
}
