// script.js

const tasks = [
    "Visitar as Igrejas Jubilares",
    "Conectar-se mais com Deus",
    "Estudar sobre Teologia",
    "Fazer o cursinho de Logística",
    "Prestar vestibulares",
    "Sair todos os meses para contemplar a natureza",
    "Descobrir um esporte novo",
    "Descobrir um hobby",
    "Aprender a cozinhar",
    "Comprar uma moto",
    "Fazer 52 caminhadas",
    "Escrever uma carta para o “eu” do futuro e guardá-la",
    "Ler 20 livros",
    "Desenhar em 30 folhas",
    "Aprender (ou aprofundar) em algum idioma",
    "Visitar o Sacrário 52 vezes",
    "Montar uma playlist especial",
    "Realizar 3 projetos grandes (trabalho ou pessoal)",
    "Ir à academia 3 vezes por semana, totalizando 52 semanas",
    "Comer de forma razoavelmente saudável",
    "Ficar pelo menos 10 dias sem celular ou computador (pode usar apenas para um breve registro)",
    "Fazer uma retrospectiva em vídeo de 365 segundos",
    "Começar a investir",
    "Escrever ao menos um parágrafo em um caderno, diariamente ou semanalmente",
    "Cuidar de si mesmo(a) (bem-estar físico, mental e emocional)"
];

// Variáveis para rastrear linhas completadas
let completedRows = new Set();
let completedCols = new Set();
let completedDiags = new Set();

// Variável para rastrear se todo o bingo foi completado
let isFullBingo = false;

// Inicializar o bingo
document.addEventListener('DOMContentLoaded', () => {
    const bingoGrid = document.querySelector('.bingo-grid');
    const savedTasks = JSON.parse(localStorage.getItem('bingoTasks')) || [];
    const savedLog = JSON.parse(localStorage.getItem('taskLog')) || [];

    if (savedTasks.length === 0) {
        shuffle(tasks);
        const selectedTasks = tasks.slice(0, 25);
        selectedTasks.forEach((task, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = task;
            cell.dataset.task = task;
            cell.dataset.index = index;
            cell.addEventListener('click', () => toggleCell(cell, task));
            bingoGrid.appendChild(cell);
        });
        saveTasks(); // Salva as tarefas iniciais
        console.log("Bingo inicializado com tarefas aleatórias.");
    } else {
        // Carregar tarefas salvas
        savedTasks.forEach(taskObj => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = taskObj.task;
            cell.dataset.task = taskObj.task;
            cell.dataset.index = taskObj.index;
            if (taskObj.checked) {
                cell.classList.add('checked');
            }
            cell.addEventListener('click', () => toggleCell(cell, taskObj.task));
            bingoGrid.appendChild(cell);
        });
        // Atualizar conjuntos de linhas completadas com base no estado salvo
        checkAllBingos();
        console.log("Bingo carregado com tarefas salvas.");
    }

    // Carregar logs salvos
    const taskLog = document.getElementById('task-log');
    savedLog.forEach(log => {
        const li = document.createElement('li');
        li.textContent = log;
        taskLog.prepend(li);
    });

    // Evento para o botão de reset
    document.getElementById('reset-button').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja resetar o bingo? Todas as marcações e logs serão perdidos.')) {
            localStorage.removeItem('bingoTasks');
            localStorage.removeItem('taskLog');
            // Resetar variáveis de rastreamento
            completedRows.clear();
            completedCols.clear();
            completedDiags.clear();
            isFullBingo = false;
            location.reload();
            console.log("Bingo resetado pelo usuário.");
        }
    });

    // Evento para fechar a área de mensagens
    document.getElementById('close-message').addEventListener('click', () => {
        hideMessage();
    });
});

// Função para alternar o estado da célula
function toggleCell(cell, task) {
    cell.classList.toggle('checked');
    saveTasks();

    if (cell.classList.contains('checked')) {
        console.log(`Task "${task}" marcada como concluída.`);
        addTaskLog(task);
        showCelebration();
        checkBingo();
    } else {
        console.log(`Task "${task}" desmarcada.`);
        removeTaskLog(task);
        checkBingo();
    }
}

// Função para adicionar uma tarefa ao log
function addTaskLog(task) {
    const taskLog = document.getElementById('task-log');
    const timestamp = new Date().toLocaleString();
    const log = `${task} - Concluído em ${timestamp}`;
    const li = document.createElement('li');
    li.textContent = log;
    taskLog.prepend(li);
    saveLog(log);
}

// Função para remover uma tarefa do log (opcional)
function removeTaskLog(task) {
    const taskLog = document.getElementById('task-log');
    const logs = taskLog.getElementsByTagName('li');
    for (let i = 0; i < logs.length; i++) {
        if (logs[i].textContent.startsWith(task)) {
            taskLog.removeChild(logs[i]);
            break;
        }
    }
    // Atualizar o log no localStorage
    const updatedLogs = Array.from(logs).map(li => li.textContent);
    localStorage.setItem('taskLog', JSON.stringify(updatedLogs));
    console.log(`Log de tarefa removido: "${task}"`);
}

// Função para embaralhar o array
function shuffle(array) {
    for (let i = array.length -1; i >0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Função para exibir a celebração de confete
function showCelebration() {
    const celebration = document.querySelector('.confetti-container');
    // Remover quaisquer confetes existentes
    celebration.innerHTML = '';

    // Criar confetes
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');
        confetti.style.backgroundColor = getRandomConfettiColor();
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${Math.random() * 100}%`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        celebration.appendChild(confetti);
    }

    // Exibir a celebração removendo a classe 'hidden'
    const celebrationContainer = document.getElementById('celebration');
    celebrationContainer.classList.remove('hidden');

    // Ocultar a celebração após 3 segundos
    setTimeout(() => {
        celebrationContainer.classList.add('hidden');
        celebration.innerHTML = '';
        console.log("Celebração de confete ocultada.");
    }, 3000);
}

// Função para obter uma cor aleatória para o confete
function getRandomConfettiColor() {
    const colors = ['#33c7ff', '#a2dfff', '#1e90ff', '#00bfff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Função para verificar se houve bingo
function checkBingo() {
    console.log("Verificando status do bingo...");
    const cells = document.querySelectorAll('.cell');
    const size = 5;
    let bingo = false;
    let completedLinesThisCheck = [];

    // Verificar linhas (horizontais)
    for (let row = 0; row < size; row++) {
        let count = 0;
        for (let col = 0; col < size; col++) {
            if (cells[row * size + col].classList.contains('checked')) {
                count++;
            }
        }
        if (count === size && !completedRows.has(row)) {
            bingo = true;
            completedRows.add(row);
            completedLinesThisCheck.push(`Linha ${row + 1}`);
            console.log(`Linha ${row + 1} completada.`);
        }
    }

    // Verificar colunas (verticais)
    for (let col = 0; col < size; col++) {
        let count = 0;
        for (let row = 0; row < size; row++) {
            if (cells[row * size + col].classList.contains('checked')) {
                count++;
            }
        }
        if (count === size && !completedCols.has(col)) {
            bingo = true;
            completedCols.add(col);
            completedLinesThisCheck.push(`Coluna ${col + 1}`);
            console.log(`Coluna ${col + 1} completada.`);
        }
    }

    // Verificar diagonais
    let countDiag1 = 0;
    let countDiag2 = 0;
    for (let i = 0; i < size; i++) {
        if (cells[i * size + i].classList.contains('checked')) {
            countDiag1++;
        }
        if (cells[i * size + (size - i -1)].classList.contains('checked')) {
            countDiag2++;
        }
    }
    if (countDiag1 === size && !completedDiags.has('diag1')) {
        bingo = true;
        completedDiags.add('diag1');
        completedLinesThisCheck.push(`Diagonal Principal`);
        console.log(`Diagonal Principal completada.`);
    }
    if (countDiag2 === size && !completedDiags.has('diag2')) {
        bingo = true;
        completedDiags.add('diag2');
        completedLinesThisCheck.push(`Diagonal Secundária`);
        console.log(`Diagonal Secundária completada.`);
    }

    // Exibir mensagens para linhas completadas
    if (completedLinesThisCheck.length > 0) {
        showMessage(`🎉 Você completou: ${completedLinesThisCheck.join(', ')} 🎉`);
    }

    // Verificar se todo o bingo foi completado (todas as células marcadas)
    const allChecked = (cells.length === 25) && Array.from(cells).every(cell => cell.classList.contains('checked'));
    console.log(`Total de células marcadas: ${Array.from(cells).filter(cell => cell.classList.contains('checked')).length}`);
    console.log(`Bingo completo: ${allChecked}`);

    if (allChecked && !isFullBingo) {
        isFullBingo = true;
        console.log("Bingo completo! Exibindo mensagem de conclusão.");
        showMessage('🌟 Parabéns! Você completou todo o bingo! 🌟');
        showFinalCelebration();
    }
}

// Função para exibir uma mensagem na área de mensagens
function showMessage(text) {
    const messageDiv = document.getElementById('message');
    const messageText = document.getElementById('message-text');
    messageText.textContent = text;
    messageDiv.classList.remove('hidden');
    console.log(`Mensagem exibida: "${text}"`);
}

// Função para ocultar a área de mensagens
function hideMessage() {
    const messageDiv = document.getElementById('message');
    messageDiv.classList.add('hidden');
    console.log("Mensagem ocultada pelo usuário.");
}

// Função para exibir a celebração final de bingo completo
function showFinalCelebration() {
    console.log("Exibindo celebração final de bingo completo.");
    const celebration = document.querySelector('.confetti-container');
    // Remover quaisquer confetes existentes
    celebration.innerHTML = '';

    // Criar confetes maiores
    for (let i = 0; i < 200; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece-final');
        confetti.style.backgroundColor = getRandomConfettiColor();
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${Math.random() * 100}%`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        celebration.appendChild(confetti);
    }

    // Exibir a celebração removendo a classe 'hidden'
    const celebrationContainer = document.getElementById('celebration');
    celebrationContainer.classList.remove('hidden');

    // Ocultar a celebração após 4 segundos
    setTimeout(() => {
        celebrationContainer.classList.add('hidden');
        celebration.innerHTML = '';
        console.log("Celebração final de bingo completo ocultada.");
    }, 4000);
}

// Função para salvar o estado das tarefas no localStorage
function saveTasks() {
    const cells = document.querySelectorAll('.cell');
    const tasksToSave = Array.from(cells).map(cell => ({
        task: cell.dataset.task,
        checked: cell.classList.contains('checked'),
        index: cell.dataset.index
    }));
    localStorage.setItem('bingoTasks', JSON.stringify(tasksToSave));
    console.log("Estado das tarefas salvo no localStorage.");
}

// Função para salvar o log de tarefas concluídas no localStorage
function saveLog(log) {
    const savedLog = JSON.parse(localStorage.getItem('taskLog')) || [];
    savedLog.push(log);
    localStorage.setItem('taskLog', JSON.stringify(savedLog));
    console.log(`Log de tarefa salvo: "${log}"`);
}

// Função para verificar bingos completados ao carregar tarefas salvas
function checkAllBingos() {
    console.log("Verificando bingos completados a partir dos dados salvos.");
    const cells = document.querySelectorAll('.cell');
    const size = 5;

    // Verificar linhas
    for (let row = 0; row < size; row++) {
        let count = 0;
        for (let col = 0; col < size; col++) {
            if (cells[row * size + col].classList.contains('checked')) {
                count++;
            }
        }
        if (count === size) {
            completedRows.add(row);
            console.log(`Linha ${row + 1} já estava completada.`);
        }
    }

    // Verificar colunas
    for (let col = 0; col < size; col++) {
        let count = 0;
        for (let row = 0; row < size; row++) {
            if (cells[row * size + col].classList.contains('checked')) {
                count++;
            }
        }
        if (count === size) {
            completedCols.add(col);
            console.log(`Coluna ${col + 1} já estava completada.`);
        }
    }

    // Verificar diagonais
    let countDiag1 = 0;
    let countDiag2 = 0;
    for (let i = 0; i < size; i++) {
        if (cells[i * size + i].classList.contains('checked')) {
            countDiag1++;
        }
        if (cells[i * size + (size - i -1)].classList.contains('checked')) {
            countDiag2++;
        }
    }
    if (countDiag1 === size) {
        completedDiags.add('diag1');
        console.log(`Diagonal Principal já estava completada.`);
    }
    if (countDiag2 === size) {
        completedDiags.add('diag2');
        console.log(`Diagonal Secundária já estava completada.`);
    }

    // Verificar se todo o bingo foi completado
    const allChecked = (cells.length === 25) && Array.from(cells).every(cell => cell.classList.contains('checked'));
    if (allChecked) {
        isFullBingo = true;
        console.log("Bingo já estava completo a partir dos dados salvos.");
        showMessage('🌟 Parabéns! Você completou todo o bingo! 🌟');
        showFinalCelebration();
    }
}
