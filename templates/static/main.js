document.addEventListener('DOMContentLoaded', () => {
    fetchIssues();
  
    document.getElementById('issue-form').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const priority = document.getElementById('priority').value;
  
      if (!title || !description || !priority || priority === "Select Priority") {
        alert("Please fill in all fields.");
        return;
      }
  
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, priority })
      });
  
      if (response.ok) {
        document.getElementById('issue-form').reset();
        fetchIssues();
      } else {
        alert("Failed to submit issue.");
      }
    });
  });
  
  async function fetchIssues() {
    const res = await fetch('/api/issues');
    const issues = await res.json();
  
    const container = document.getElementById('issue-list');
    container.innerHTML = '';
  
    issues.forEach(issue => {
      const issueDiv = document.createElement('div');
      issueDiv.className = 'issue-card';
  
      const priorityClass = getPriorityClass(issue.priority);
  
      issueDiv.innerHTML = `
        <h3>${issue.title} <span class="priority-label ${priorityClass}">${issue.priority}</span></h3>
        <p>${issue.description}</p>
        <div class="issue-actions">
          <button class="edit-btn" onclick="editIssue(${issue.id})">Edit</button>
          <button class="delete-btn" onclick="deleteIssue(${issue.id})">Delete</button>
        </div>
      `;
  
      container.appendChild(issueDiv);
    });
  }
  
  function getPriorityClass(priority) {
    switch (priority.toLowerCase()) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      default: return '';
    }
  }
  
  function deleteIssue(id) {
    fetch(`/api/issues/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => fetchIssues());
  }
  
  function editIssue(id) {
    const newTitle = prompt("Enter new title:");
    const newDescription = prompt("Enter new description:");
    const newPriority = prompt("Enter new priority (Low, Medium, High):");
  
    if (newTitle && newDescription && newPriority) {
      fetch(`/api/issues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          priority: newPriority
        })
      })
        .then(res => res.json())
        .then(() => fetchIssues());
    }
  }
  