const SQLite = require('expo-sqlite');



async function createInventoryTable() {


    await db.runAsync(
        `
        CREATE TABLE IF NOT EXISTS Inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            quantity INTEGER,
            scan_date DATE,
        )
        `
    )
}

const addProductInventory = (name) => {
    db.run(
        `
        INSERT INTO Inventory (name, quantity, scan_date)
        VALUES (${name}, 1, date('now'))
        `
    )
}

const updateProductInventory = (name) => {
    db.run(
        `
        UPDATE Inventory
        SET quantity = quantity + 1
        WHERE name = ${name}
        `
    )
}

const getProductInventory = () => {

    db.get(
        `
        SELECT * FROM Inventory
        `
    )

}

module.exports = {
    createInventoryTable,
    addProductInventory,
    updateProductInventory,
    getProductInventory
}