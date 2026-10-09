
let assignments = [];
let currentFilter = "All";

const form = document.getElementById("assignmentForm");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  assignments.push({
    id: Date.now(),
    subject: document.getElementById("subject").value.trim(),
    deadline: document.getElementById("deadline").value,
    priority: document.getElementById("priority").value,
    completed: false
  });

  form.reset();
  renderAssignments();
});

function showAssignments(filter) {
  currentFilter = filter;
  renderAssignments();
}

function toggleStatus(id) {
  assignments = assignments.map(a =>
    a.id === id ? {...a, completed: !a.completed} : a
  );
  renderAssignments();
}

function deleteAssignment(id) {
  assignments = assignments.filter(a => a.id !== id);
  renderAssignments();
}

function editAssignment(id) {
  const a = assignments.find(item => item.id === id);
  const subject = prompt("Edit assignment name:", a.subject);
  if (subject === null || !subject.trim()) return;

  a.subject = subject.trim();
  renderAssignments();
}

function renderAssignments() {
  const pending = assignments.filter(a => !a.completed).length;
  const completed = assignments.length - pending;

  document.getElementById("stats").textContent =
    `Total: ${assignments.length} | Pending: ${pending} | Completed: ${completed}`;

  const list = document.getElementById("assignmentList");
  list.replaceChildren();

  const filtered = assignments.filter(a =>
    currentFilter === "All" ||
    (currentFilter === "Pending" && !a.completed) ||
    (currentFilter === "Completed" && a.completed)
  );

  if (filtered.length === 0) {
    list.textContent = "No assignments found. Add your first assignment!";
    return;
  }

  filtered.forEach(a => {
    const card = document.createElement("div");
    card.className = "assignment" + (a.completed ? " completed" : "");

    const info = document.createElement("div");
    info.className = "info";

    const title = document.createElement("h3");
    title.textContent = a.subject;

    const details = document.createElement("p");
    details.textContent = `Deadline: ${a.deadline} | Priority: ${a.priority}`;
    details.className = a.priority;

    info.append(title, details);

    const actions = document.createElement("div");
    actions.className = "actions";

    function makeButton(label, action) {
      const button = document.createElement("button");
      button.textContent = label;
      button.addEventListener("click", action);
      return button;
    }

    actions.append(
      makeButton(a.completed ? "Reopen" : "Complete",
        () => toggleStatus(a.id)),
      makeButton("Edit", () => editAssignment(a.id)),
      makeButton("Delete", () => deleteAssignment(a.id))
    );

    card.append(info, actions);
    list.append(card);
  });
}

renderAssignments();
