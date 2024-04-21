const bcrypt = require('bcrypt');
const User = require('../models/user');
const Datastore = require('nedb');
const db = new Datastore({ filename: './database/users.db', autoload: true });


exports.getLoginPage = (req, res) => {
  res.render('login');
};

exports.loggedIn = (req, res, next) => {
  if (req.session && req.session.userEmail) {
    next();
  } else {
    res.redirect('/');
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    req.session.userEmail = email;

    if (user.role === 'admin') {
      return res.redirect('/admin/profile');
    } else if (user.role === 'pantry') {
      return res.redirect('/pantry/profile');
    } else {
      return res.redirect('/user/profile');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).send('Internal Server Error');
  }
};


exports.getRegisterPage = (req, res) => {
  res.render('register');
};

exports.postRegister = async (req, res) => {
  try {
    const { name, organisation, email, password } = req.body;
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{"':;?/>,<.]).{8,}$/;
    if (!strongPasswordPattern.test(password)) {
      return res.render('register', { error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, organisation, email, password: hashedPassword });
    await User.create(newUser);
    res.render('login', { success: 'Registration successful. Please log in.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
};



exports.getAddUserPage = (req, res) => {
  res.render('admin/addUser');
};



exports.postAddUser = async (req, res) => {
  try {
    const { name, organisation, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      organisation,
      email,
      password: hashedPassword,
      role
    };
    db.insert(newUser, (err, insertedUser) => {
      if (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('admin/addUser', { success: 'User added successfully' });
      }
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Internal Server Error');
  }
};