const input = document.querySelector('.todoList__main-input');
const todoList = document.querySelector('.todoList');
const template = document.querySelector('#task').content;
const result = document.querySelector('.result');
const counter = document.querySelector('#counter');
const buttonDelete = document.querySelector('.result__clear');
const buttonSelectAll = todoList.querySelector('.todoList__select-all');
const resultButtons = todoList.querySelectorAll('.result__button');
const buttonAllTasks = todoList.querySelector('.result__button_type_all');
const buttonActiveTasks = todoList.querySelector('.result__button_type_active');
const buttonComplitedTasks = todoList.querySelector('.result__button_type_complited');
const wrapper = document.querySelector('.wrapper');

input.addEventListener('keydown', createTask);
buttonDelete.addEventListener('click', deleteAllDoneTasks);
buttonSelectAll.addEventListener('click', selectAll);
resultButtons.forEach(function (resultButton) {
	resultButton.addEventListener('click', addClassActiveButton);
})
buttonAllTasks.addEventListener('click', addStyleAllTasks);
buttonActiveTasks.addEventListener('click', addStyleActiveTasks);
buttonComplitedTasks.addEventListener('click', addStyleComplitedTasks);


function init() {
	let fromstorage = localStorage.getItem('save');
	if (fromstorage) {
		const wrapper = document.querySelector('.wrapper');
		wrapper.innerHTML = fromstorage;
	}
	createNewTasks().forEach(function (task) {
		task.querySelector('.todoList__circle').addEventListener('click', clickCircle);
		task.querySelector('.todoList__cross').addEventListener('click', deleteTask);
		task.querySelector('.todoList__task-text').addEventListener('dblclick', editTask);
	})
	addClassSelectAll();
	checkItem();
	addCounterItems();
	checkButtonDelete();
	addStyleAllTasks();
}

// Создаем массив имеющихся тасков
function createNewTasks() {
	const newTasks = todoList.querySelectorAll('.todoList__task');
	return newTasks;
}

// Сохранение в локал сторедж
function save() {
	let save = document.querySelector('.wrapper');
	localStorage.setItem('save', save.innerHTML);
}

// Общая проверка для включения\выключения тасков
function mainTasksDisplay() {
	if (buttonAllTasks.classList.contains('result__button_active')) {
		addStyleAllTasks();
	}
	else if (buttonActiveTasks.classList.contains('result__button_active')) {
		addStyleActiveTasks();
	}
	else if (buttonComplitedTasks.classList.contains('result__button_active')) {
		addStyleComplitedTasks();
	}
}

// Добавить всем таскам Дисплей Блок
function addStyleAllTasks() {
	const allTasks = todoList.querySelectorAll('.todoList__task');
	allTasks.forEach(function (task) {
		task.style.display = 'flex';
	})
}

// Добавить выполненным таскам НОН и наоборот
function addStyleActiveTasks() {
	createArrWithActiveTasks().forEach(function (task) {
		task.style.display = 'none';
	})
	createArrWithNoActiveTasks().forEach(function (task) {
		task.style.display = 'flex';
	})
}

// Добавить выполненным таскам БЛОК и наоборот
function addStyleComplitedTasks() {
	createArrWithActiveTasks().forEach(function (task) {
		task.style.display = 'flex';
	})
	createArrWithNoActiveTasks().forEach(function (task) {
		task.style.display = 'none';
	})
}

// Получаем Массив с выполнеными тасками
function createArrWithActiveTasks() {
	const allTasks = todoList.querySelectorAll('.todoList__task');
	const arrTaskActive = [];
	allTasks.forEach(function (task) {
		if (task.querySelector('.todoList__check_active')) {
			arrTaskActive.push(task);
		}
	})
	return arrTaskActive;
}

// Получаем Массив с Невыполнеными тасками
function createArrWithNoActiveTasks() {
	const allTasks = todoList.querySelectorAll('.todoList__task');
	const arrTaskNoActive = [];
	allTasks.forEach(function (task) {
		if (task.querySelector('.todoList__check:not(.todoList__check_active)')) {
			arrTaskNoActive.push(task);
		}
	})
	return arrTaskNoActive;
}

// Функция переключения кнопки
function addClassActiveButton(evt) {
	resultButtons.forEach(function (btn) {
		btn.classList.remove('result__button_active');
	})
	evt.target.classList.add('result__button_active');
}

// Кнопка выделения всех тасков
function selectAll() {
	this.classList.toggle('todoList__select-all_active');
	const tasks = todoList.querySelectorAll('.todoList__task');
	if (this.classList.contains('todoList__select-all_active')) {
		tasks.forEach(function (task) {
			task.querySelector('.todoList__task-text').classList.add('todoList__task-text_disabled');
			task.querySelector('.todoList__check').classList.add('todoList__check_active');
		})
	}
	else {
		tasks.forEach(function (task) {
			task.querySelector('.todoList__task-text').classList.remove('todoList__task-text_disabled');
			task.querySelector('.todoList__check').classList.remove('todoList__check_active');
		})
	}
	addCounterItems();
	checkButtonDelete();
	mainTasksDisplay();
}

// Проверка что все таски выполнены для кнопки выделить все
function checkTaskForSelectAll() {
	const allTasks = Array.from(todoList.querySelectorAll('.todoList__check'));
	return allTasks.some(function (task) {
		return !task.classList.contains('todoList__check_active');
	})
}

// Проверяем есть ли хотя бы 1 таск
function checkItem() {
	const task = todoList.querySelector('.todoList__task');
	if (task) {
		addClassResult();
	}
	else {
		removeClassResult();
	}
}

// Добавляем резулт снизу
function addClassResult() {
	result.classList.add('result_active');
}

// Удаляем резулт снизу
function removeClassResult() {
	result.classList.remove('result_active');
}

// Функция создания количества тасков в рузельтате
function addCounterItems() {
	const tasksCounter = todoList.querySelectorAll('.todoList__check:not(.todoList__check_active)').length;
	counter.textContent = `${tasksCounter} `;
}

// Создаем таск и добавляем его
function createTask(evt) {
	if (evt.key === 'Enter' && evt.target.value) {
		const taskLabel = template.querySelector('.todoList__task').cloneNode(true);
		const task = taskLabel.querySelector('.todoList__task-text'); // Ищем текст таска
		const circle = taskLabel.querySelector('.todoList__circle'); // Ищем круг таска
		const cross = taskLabel.querySelector('.todoList__cross'); // Ищем крестик таска
		cross.addEventListener('click', deleteTask); // Обработчик удаления всего таска
		circle.addEventListener('click', clickCircle); // Обработчик добавления выполненой задачи
		task.textContent = evt.target.value; // Вставлем текст таска
		task.addEventListener('dblclick', editTask); // Обработчик редактирования текста
		wrapper.append(taskLabel); // Вставляем таск
		evt.target.value = '';
		checkItem();
		addCounterItems();
		addClassSelectAll();
		mainTasksDisplay();
		save();
	}
}

// Редактируем таск
function editTask(evt) {
	const inputTask = document.createElement('input');
	inputTask.classList.add('task-input');
	inputTask.setAttribute('autofocus', true);
	inputTask.value = evt.target.textContent;
	evt.target.closest('.todoList__content').classList.add('todoList__content_disabled');
	evt.target.textContent = '';
	evt.target.closest('.todoList__task').append(inputTask);
	inputTask.addEventListener('blur', saveTextTask);
	inputTask.addEventListener('keydown', enterTextTask);
}

// Сохраняем таск при потери фокуса
function saveTextTask() {
	this.parentElement.querySelector('.todoList__content').classList.remove('todoList__content_disabled');
	this.parentElement.querySelector('.todoList__task-text').textContent = this.value;
	this.parentElement.removeChild(this);
}

// Сохраняем таск при Энтер
function enterTextTask(evt) {
	if (evt.key === 'Enter') {
		this.parentElement.querySelector('.todoList__content').classList.remove('todoList__content_disabled');
		this.parentElement.querySelector('.todoList__task-text').textContent = this.value;
		this.parentElement.removeChild(this);
	}
}

// Функция нажатия на галочку
function clickCircle(evt) {
	this.querySelector('.todoList__check').classList.toggle('todoList__check_active');
	checkDoneTask(this.querySelector('.todoList__check'));
	checkButtonDelete();
	if (this.querySelector('.todoList__check_active')) {
		counter.textContent = `${Number(counter.textContent) - 1} `;
	}
	else {
		counter.textContent = `${Number(counter.textContent) + 1} `;
	}
	mainTasksDisplay();
	if (!checkTaskForSelectAll()) {
		buttonSelectAll.classList.add('todoList__select-all_active');
	}
	else {
		buttonSelectAll.classList.remove('todoList__select-all_active');
	}
}

// Проверки на наличие активной галки
function checkDoneTask(check) {
	if (check.classList.contains('todoList__check_active')) {
		addClassTask(check.closest('.todoList__task').querySelector('.todoList__task-text'));
	}
	else {
		removeClassTask(check.closest('.todoList__task').querySelector('.todoList__task-text'));
	}
}

// Добавляем выполненое задание
function addClassTask(task) {
	task.classList.add('todoList__task-text_disabled');
	save();
}

// Удаляем выполненое задание
function removeClassTask(task) {
	task.classList.remove('todoList__task-text_disabled');
	save();
}

// Удаляем задачу
function deleteTask() {
	wrapper.removeChild(this.closest('.todoList__task'));
	checkItem();
	checkButtonDelete();
	addCounterItems();
	addClassSelectAll()
	save();
}

// Проверяем кнопку удаления всех выполененых тасков
function checkButtonDelete() {
	const activeTask = todoList.querySelectorAll('.todoList__check_active');
	let counter = activeTask.length;
	if (counter > 0) {
		addButtonClassDelete()
		buttonDelete.textContent = `Clear completed [${counter}]`
	}
	else {
		removeButtonClassDelete();
	}
}

// Добавляем кнопку удаления выполененых тасков
function addButtonClassDelete() {
	buttonDelete.classList.add('result__clear_active');
}

// Удаляем кнопку удаления выполененых тасков
function removeButtonClassDelete() {
	buttonDelete.classList.remove('result__clear_active');
}

// Удаляем выполенные таски
function deleteAllDoneTasks(evt) {
	evt.preventDefault();
	const activeTasks = todoList.querySelectorAll('.todoList__check_active');
	activeTasks.forEach(function (activeTask) {
		wrapper.removeChild(activeTask.closest('.todoList__task'));
	})
	checkButtonDelete();
	checkItem();
	addCounterItems();
	buttonSelectAll.classList.remove('todoList__select-all_active');
	addClassSelectAll();
	save();
}

// Добавляем\убираем видимость кнопки показать все
function addClassSelectAll() {
	const task = todoList.querySelector('.todoList__task');
	if (task) {
		buttonSelectAll.classList.add('todoList__select-all_visible');
	}
	else {
		buttonSelectAll.classList.remove('todoList__select-all_visible');
	}
}


init();
