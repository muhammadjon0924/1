// Elementlarni tanlab olish
const taskInput = document.getElementById('taskInput');
const searchInput = document.getElementById('searchInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const emptyMessage = document.getElementById('emptyMessage');

// Vazifalar massivi
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let searchQuery = '';

// Vazifalarni ekranga chiqarish funksiyasi
function renderTasks() {
    taskList.innerHTML = '';

    // Filter va Qidiruvni birgalikda qo'llash
    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (currentFilter === 'active') {
            return matchesSearch && !task.completed;
        } else if (currentFilter === 'done') {
            return matchesSearch && task.completed;
        }
        return matchesSearch; // 'all' uchun
    });

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }

    filteredTasks.forEach((task) => {
        // Asl massivdagi indeksini topish (o'chirish va belgilash uchun muhim)
        const originalIndex = tasks.indexOf(task);

        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <div class="task-info">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${originalIndex})">
                <span>${escapeHtml(task.text)}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${originalIndex})">O'chirish</button>
        `;

        taskList.appendChild(li);
    });
}

// Xavfsizlik uchun HTML belgilarini qochirish
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Yangi vazifa qo'shish
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Iltimos, vazifa matnini kiriting!');
        return;
    }

    tasks.push({ text: text, completed: false });
    taskInput.value = '';
    saveAndRender();
}

// Vazifa holatini o'zgartirish (Bajarilgan / Bajarilmagan)
window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
}

// Vazifani o'chirish
window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveAndRender();
}

// Saqlash va yangilash
function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Hodisalarni tinglash (Event Listeners)
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Qidiruv inputi o'zgarganda
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTasks();
});

// Filter tugmalari bosilganda
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

// Sahifa yuklanganda ishga tushirish
renderTasks();