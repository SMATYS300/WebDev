const Datastore = require('nedb');

class Pantry {
  constructor() {
    this.db = new Datastore({ filename: './database/pantry.db', autoload: true });
  }

  async addItem(item) {
    return new Promise((resolve, reject) => {
      this.db.insert(item, (err, addedItem) => {
        if (err) {
          reject(err);
        } else {
          resolve(addedItem);
        }
      });
    });
  }

  getAllItems(callback) {
    this.db.find({}, (err, items) => {
      if (err) {
        console.error('Error fetching items:', err);
        callback(err);
      } else {
        console.log('All items fetched successfully:', items);
        callback(null, items);
      }
    });
  }
  
  getAllItemsByUser(contactEmail, callback) {
    this.db.find({ contactEmail }, (err, items) => {
        if (err) {
            console.error('Error fetching items:', err);
            callback(err);
        } else {
            console.log('Items fetched successfully:', items);
            callback(null, items);
        }
    });
  }
}


module.exports = Pantry;

