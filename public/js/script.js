document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const logoutButton = document.getElementById('logoutButton');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                document.getElementById('message').textContent = 'Passwords do not match!';
                return;
            }

            const response = await fetch('/userSignup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const result = await response.json();
            document.getElementById('message').textContent = result.message;

            if (response.ok) {
                window.location.href = 'login.html';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/userLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            document.getElementById('message').textContent = result.message;

            if (response.ok) {
                localStorage.setItem('token', result.token);
                window.location.href = 'dashboard.html';
            }
        });
    }

    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;

            if (newPassword !== confirmNewPassword) {
                document.getElementById('message').textContent = 'Passwords do not match!';
                return;
            }

            const token = localStorage.getItem('token');

            const response = await fetch('/changePassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword })
            });

            const result = await response.json();
            document.getElementById('message').textContent = result.message;
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            }
        });
    }

    if (window.location.pathname.endsWith('dashboard.html')) {
        const token = localStorage.getItem('token');

        fetch('/AlluserDetails', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const userDetailsDiv = document.getElementById('userDetails');
            userDetailsDiv.textContent = JSON.stringify(data.data);
        });
    }
});
