const http = require('http');

const request = (options, postData = null) => {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch(e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });
        req.on('error', reject);
        if (postData) {
            req.write(JSON.stringify(postData));
        }
        req.end();
    });
};

(async () => {
    console.log("=== STARTING API TESTS ===");

    // 1. Login with seeded Super Admin
    const loginData = { email: 'admin@finance.com', password: 'admin123' };
    const loginOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    console.log("-> Logging in as Admin...");
    let res = await request(loginOptions, loginData);
    console.log("Login Response Status:", res.status);
    
    if (res.status !== 200) {
        console.error("Login failed:", res.data);
        return;
    }
    const token = res.data.data.token;
    console.log("Logged in successfully! Token received.");

    // 2. Create a Financial Record
    const recordOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/records',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    const recordData = {
        amount: 25000,
        type: 'income',
        category: 'Project Payment',
        date: new Date().toISOString(),
        notes: 'Initial deposit'
    };

    console.log("\n-> Creating a financial record...");
    res = await request(recordOptions, recordData);
    console.log("Create Record Response:", res.data.message);

    // 3. Create an Expense
    const expenseData = {
        amount: 5000,
        type: 'expense',
        category: 'Software License',
        date: new Date().toISOString(),
        notes: 'Monthly subscription'
    };
    console.log("-> Creating an expense record...");
    res = await request(recordOptions, expenseData);
    console.log("Create Expense Response:", res.data.message);

    // 4. Fetch Dashboard Summary
    const dashboardOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/dashboard',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    };
    console.log("\n-> Fetching Dashboard Summary...");
    res = await request(dashboardOptions);
    console.log("\n--- DASHBOARD SUMMARY RESULTS ---");
    console.dir(res.data.data, { depth: null });
    console.log("=================================");

})();
