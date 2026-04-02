const db = require('../models/db');

class DashboardService {
    async getSummary() {
        const records = await db.getAllRecords();

        let totalIncome = 0;
        let totalExpense = 0;
        const categoryWiseTotals = {};

        // Aggregate statistics
        records.forEach(record => {
            const amt = Number(record.amount) || 0;
            
            // Income vs Expense
            if (record.type === 'income') {
                totalIncome += amt;
            } else if (record.type === 'expense') {
                totalExpense += amt;
            }

            // Category Wise
            if (!categoryWiseTotals[record.category]) {
                categoryWiseTotals[record.category] = 0;
            }
            categoryWiseTotals[record.category] += amt;
        });

        const netBalance = totalIncome - totalExpense;

        // Recent Activity (Top 5 most recent records)
        // Records are already sorted descending by date from the DB mock
        const recentActivity = records.slice(0, 5);

        return {
            totalIncome,
            totalExpense,
            netBalance,
            categoryWiseTotals,
            recentActivity
        };
    }
}

module.exports = new DashboardService();
