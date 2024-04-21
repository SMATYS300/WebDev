const Datastore = require('nedb');
const db = new Datastore({ filename: './database/users.db', autoload: true });

class User {
  constructor({ name, organization, email, password, role }) {
    this.name = name;
    this.organization = organization;
    this.email = email;
    this.password = password;
    this.role = role || 'NormalUser';
  }


  static find() {
    return new Promise((resolve, reject) => {
      db.find({}, (err, users) => {
        if (err) {
          reject(err);
        } else {
          resolve(users.map(user => new User(user)));
        }
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.findOne({ email }, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.findOne({ _id: id }, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user ? new User(user) : null);
        }
      });
    });
  }

  edit(updatedData) {
    return new Promise((resolve, reject) => {
      const newData = { ...this, ...updatedData };
      db.update({ _id: this._id }, newData, { returnUpdatedDocs: true }, (err, numAffected, affectedDocuments) => {
        if (err) {
          reject(err);
        } else {
          resolve(affectedDocuments);
        }
      });
    });
  }

  static async create(user) {
    return new Promise((resolve, reject) => {
      db.insert(user, (err, insertedUser) => {
        if (err) {
          reject(err);
        } else {
          resolve(insertedUser);
        }
      });
    });
  }

  static async deleteByEmail(email) {
    return new Promise((resolve, reject) => {
        db.remove({ email: email }, {}, (err, numRemoved) => {
            if (err) {
                reject(err);
            } else {
                resolve(numRemoved);
            }
        });
    });
}
}

User.findByRole = (role) => {
  return new Promise((resolve, reject) => {
    db.findOne({ role }, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};


module.exports = User;