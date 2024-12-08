document.addEventListener('DOMContentLoaded', () => {
    const modalContainer = document.getElementById('modal-container');
    const modalTitle = document.getElementById('modal-title');
    const modalFields = document.getElementById('modal-fields');
    const closeModal = document.getElementById('close-modal');
    const modalForm = document.getElementById('modal-form');
    const mainTable = document.getElementById('main-table').querySelector('tbody');

    const users = [];
    const roles = [];
    let currentAction = null;
    let editingId = null;

    // Show modal
    const showModal = (action, title, fields) => {
        currentAction = action;
        modalTitle.textContent = title;
        modalFields.innerHTML = fields;
        modalContainer.classList.remove('hidden');
    };

    // Hide modal
    const hideModal = () => {
        modalContainer.classList.add('hidden');
        modalTitle.textContent = '';
        modalFields.innerHTML = '';
        currentAction = null;
        editingId = null;
    };

    // Close modal on Cancel button click
    closeModal.addEventListener('click', hideModal);

    // Close modal when clicking outside the modal
    modalContainer.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
            hideModal();
        }
    });

    // Form submission handler
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (currentAction === 'addUser') {
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const role = document.getElementById('user-role').value;

            if (editingId) {
                const user = users.find(u => u.id === editingId);
                user.name = name;
                user.email = email;
                user.role = role;
            } else {
                users.push({ id: users.length + 1, name, email, role, status: 'Active' });
            }
        } else if (currentAction === 'addRole') {
            const roleName = document.getElementById('role-name').value;
            const permissions = document.getElementById('role-permissions').value.split(',');

            if (editingId) {
                const role = roles.find(r => r.id === editingId);
                role.name = roleName;
                role.permissions = permissions;
            } else {
                roles.push({ id: roles.length + 1, name: roleName, permissions });
            }
        }

        renderTable();
        hideModal();
    });

    // Add user
    document.getElementById('add-user-btn').addEventListener('click', () => {
        showModal('addUser', 'Add User', ` 
            <label>Name: <input type="text" id="user-name" required></label>
            <label>Email: <input type="email" id="user-email" required></label>
            <label>Role: <select id="user-role">
                ${roles.map(role => `<option value="${role.id}">${role.name}</option>`).join('')}
            </select></label>
        `);
    });

    // Add role
    document.getElementById('add-role-btn').addEventListener('click', () => {
        showModal('addRole', 'Add Role', `
            <label>Role Name: <input type="text" id="role-name" required></label>
            <label>Permissions: <input type="text" id="role-permissions" required></label>
        `);
    });

    // Render table (combines users and roles)
    const renderTable = () => {
        mainTable.innerHTML = `
            ${users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name} (${user.email})</td>
                    <td>${roles.find(role => role.id == user.role)?.name || 'N/A'}</td>
                    <td>${user.status}</td>
                    <td>
                        <button onclick="editItem('user', ${user.id})">Edit</button>
                        <button onclick="deleteItem('user', ${user.id})">Delete</button>
                    </td>
                </tr>
            `).join('')}
            ${roles.map(role => `
                <tr>
                    <td>${role.id}</td>
                    <td>${role.name}</td>
                    <td>${role.permissions.join(', ')}</td>
                    <td>-</td>
                    <td>
                        <button onclick="editItem('role', ${role.id})">Edit</button>
                        <button onclick="deleteItem('role', ${role.id})">Delete</button>
                    </td>
                </tr>
            `).join('')}
        `;
    };

    // Edit and delete item handlers (global scope)
    window.editItem = (type, id) => {
        editingId = id;

        if (type === 'user') {
            const user = users.find(u => u.id === id);
            showModal('addUser', 'Edit User', `
                <label>Name: <input type="text" id="user-name" value="${user.name}" required></label>
                <label>Email: <input type="email" id="user-email" value="${user.email}" required></label>
                <label>Role: <select id="user-role">
                    ${roles.map(role => `<option value="${role.id}" ${role.id == user.role ? 'selected' : ''}>${role.name}</option>`).join('')}
                </select></label>
            `);
        } else if (type === 'role') {
            const role = roles.find(r => r.id === id);
            showModal('addRole', 'Edit Role', `
                <label>Role Name: <input type="text" id="role-name" value="${role.name}" required></label>
                <label>Permissions: <input type="text" id="role-permissions" value="${role.permissions.join(', ')}" required></label>
            `);
        }
    };

    window.deleteItem = (type, id) => {
        if (type === 'user') {
            const index = users.findIndex(u => u.id === id);
            if (index !== -1) users.splice(index, 1);
        } else if (type === 'role') {
            const index = roles.findIndex(r => r.id === id);
            if (index !== -1) roles.splice(index, 1);
        }
        renderTable();
    };

    renderTable();
});
