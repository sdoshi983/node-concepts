const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    addToCart(product) {
        const updatedCart = { items: [{ productId: new ObjectId(product._id), quantity: 1 }] };
        const db = getDb();
        return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart }, });
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new ObjectId(userId) });
    }
}

module.exports = User;