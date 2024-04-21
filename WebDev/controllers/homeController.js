const User = require('../models/user');
const Pantry = require('../models/pantry');


exports.getDatabasePage = (req, res) => {
  res.render('admin/database');
};

exports.getViewDatabasePage = async (req, res) => {
  try {
    const users = await User.find({});
    res.render('admin/viewDatabase', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.render('admin/viewDatabase', { error: 'Error fetching users' });
  }
};

exports.getProfilePage = async (req, res) => {
  try {
    const userEmail = req.session.userEmail;
    if (!userEmail) {
      return res.redirect('/');
    }

    const user = await User.findByEmail(userEmail);

    if (!user) {
      return res.status(404).send('User not found');
    }

    let profilePageTemplate;
    switch (user.role) {
      case 'admin':
        profilePageTemplate = 'admin/profile';
        break;
      case 'pantry':
        profilePageTemplate = 'pantry/profile';
        break;
      case 'NormalUser':
        profilePageTemplate = 'user/profile';
        break;
      default:
        return res.status(500).send('Invalid user role');
    }

    res.render(profilePageTemplate, { 
      name: user.name,
      organisation: user.organisation,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getAdminProfile = (req, res) => {
  res.render('admin/profile')
};

exports.getPantryProfile = (req, res) => {
  res.render('pantry/profile');
};

exports.getUserProfile = (req, res) => {
  res.render('user/profile');
};

exports.getPantryPage = (req, res) => {
  const pantry = new Pantry();
  pantry.getAllItems((err, items) => {
    if (err) {
      console.error('Error fetching pantry items:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('pantry/pantry', { items });
    }
  });
};


exports.getEditUserPage = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).render('admin/editUser', { error: 'User not found' });
    }

    res.render('admin/editUser', { user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).render('admin/editUser', { error: 'Error fetching user' });
  }
};

exports.postEditUser = async (req, res) => {
  const userId = req.params.id;
  const updatedData = {
    name: req.body.name,
    email: req.body.email,
    organisation: req.body.organisation,
    role: req.body.role
  };
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).render('admin/editUser', { error: 'User not found' });
    }
    await user.edit(updatedData);
    res.redirect('/admin/allUsers');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).render('admin/editUser', { error: 'Error updating user' });
  }
};

exports.postDeleteUser = async (req, res) => {
  const userEmail = req.body.email;
  try {
    const numRemoved = await User.deleteByEmail(userEmail);
    if (numRemoved === 0) {
      return res.status(404).send('User not found');
    }
    res.redirect('/admin/viewDatabase');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).redirect('/admin/viewDatabase');
  }
};

exports.getProducePage = (req, res) => {
  res.render('user/produce');
};

exports.getAddItemPage = (req, res) => {
  res.render('user/addItem');
};

exports.postAddItem = async (req, res) => {
  const { produceType, quantity, useByDate, description } = req.body;
  try {
      const userEmail = req.session.userEmail;
      if (!userEmail) {
          return res.redirect('/');
      }

      const pantry = new Pantry();
      await pantry.addItem({ 
          produceType, 
          quantity, 
          useByDate, 
          description, 
          contactEmail: userEmail 
      });

      res.render('user/addItem', { success: 'Item added successfully.' });
  } catch (error) {
      console.error('Error adding item:', error);
      res.render('user/addItem', { error: 'Failed to add item. Please try again.' });
  }
};


exports.getAddedItemsPage = async (req, res) => {
  try {
    const userEmail = req.session.userEmail;
    if (!userEmail) {
      return res.redirect('/');
    }

    const pantry = new Pantry();
    pantry.getAllItemsByUser(userEmail, (err, items) => {
      if (err) {
        console.error('Error fetching items:', err);
        res.status(500).send('Error fetching items');
      } else {
        console.log('Items retrieved successfully:', items);
        res.render('user/addedItems', { items });
      }
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
  }
};