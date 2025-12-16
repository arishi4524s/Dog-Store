
// Live login/register using backend + JSONBin
// Backend endpoints:
//   POST /api/login {username,password}
//   POST /api/register {username,password}

async function apiPost(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = data.message || 'Something went wrong';
        throw new Error(msg);
    }
    return data;
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            (async () => {
                try {
                    const username = document.getElementById('username').value.trim();
                    const password = document.getElementById('password').value;

                    const user = await apiPost('/api/login', { username, password });

                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('username', user.username);
                    localStorage.setItem('userRole', user.role);

                    if (user.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                } catch (err) {
                    alert(err.message || 'Invalid username or password');
                }
            })();
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            (async () => {
                try {
                    const username = document.getElementById('regUsername').value.trim();
                    const password = document.getElementById('regPassword').value;
                    const confirm = document.getElementById('regConfirm').value;

                    if (!username || !password || !confirm) {
                        alert('Please fill in all fields');
                        return;
                    }

                    if (password !== confirm) {
                        alert('Passwords do not match');
                        return;
                    }

                    await apiPost('/api/register', { username, password });

                    alert('Account created successfully! You can now login.');
                    window.location.href = 'login.html';
                } catch (err) {
                    alert(err.message || 'Could not register');
                }
            })();
        });
    }
});
