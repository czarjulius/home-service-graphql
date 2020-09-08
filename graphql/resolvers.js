const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Service = require("../models/service");
const Vendor = require("../models/vendor");
const Order = require("../models/order");

module.exports = {
  createUser: async function ({ userInput }, req) {
    // Validation

    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "E-Mail is invalid." });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error(`User with email ${userInput.email} exist already`);
      error.data = errors;
      error.code = 400;
      throw error;

    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      firstname: userInput.firstname,
      lastname: userInput.lastname,
      address: userInput.address,
      phone: userInput.phone,
      email: userInput.email,
      password: hashedPw,
    });

    const createdUser = await user.save();

    const token = jwt.sign(
      {
        userId: createdUser._id.toString(),
        email: createdUser.email,
      },
      "secretkey",
      { expiresIn: "1h" }
    );
    return {
      ...createdUser._doc,
      _id: createdUser._id.toString(),
      token,
      createdAt: createdUser.createdAt.toISOString(),
      updatedAt: createdUser.updatedAt.toISOString(),
    };
  },

  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect.");
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "secretkey",
      { expiresIn: "1h" }
    );
    return { token: token, userId: user._id.toString() };
  },

  services: async function (args, req) {
    // if (!req.isAuth) {
    //   const error = new Error("Not authenticated!");
    //   error.code = 401;
    //   throw error;
    // }
    const services = await Service.find().sort({ createdAt: -1 });
    return {
      services: services.map((service) => {
        return {
          ...service._doc,
          _id: service._id.toString(),
          createdAt: service.createdAt.toISOString(),
          updatedAt: service.updatedAt.toISOString(),
        };
      }),
    };
  },
  createService: async function ({ serviceInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error("Not authenticated!");
    //   error.code = 401;
    //   throw error;
    // }
    const errors = [];
    if (
      validator.isEmpty(serviceInput.title) ||
      !validator.isLength(serviceInput.title, { min: 2 })
    ) {
      errors.push({ message: "Title is Invalid." });
    }
    if (
      validator.isEmpty(serviceInput.description) ||
      !validator.isLength(serviceInput.description, { min: 5 })
    ) {
      errors.push({ message: "Description is Invalid." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const service = new Service({
      title: serviceInput.title,
      description: serviceInput.description,
      imageUrl: serviceInput.imageUrl,
    });
    const createdService = await service.save();
    return {
      ...createdService._doc,
      _id: createdService._id.toString(),
      createdAt: createdService.createdAt.toISOString(),
      updatedAt: createdService.updatedAt.toISOString(),
    };
  },
  service: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error("Not authenticated!");
    //   error.code = 401;
    //   throw error;
    // }
    const user = await User.findById(req.userId);
    console.log(user,'kdkdkdkdddkddddkdkkdkkdkdkdd');
    

    const service = await Service.findById(id).populate("vendors");
    if (!service) {
      const error = new Error("Service Not Found");
      error.code = 404;
      throw error;
    }

    return {
      ...service._doc,
      _id: service._id.toString(),
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    };
  },

  createVendor: async function ({ vendorInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error("Not authenticated!");
    //   error.code = 401;
    //   throw error;
    // }
    const errors = [];
    if (
      validator.isEmpty(vendorInput.name) ||
      !validator.isLength(vendorInput.name, { min: 2 })
    ) {
      errors.push({ message: "Name is Invalid." });
    }
    if (
      validator.isEmpty(vendorInput.description) ||
      !validator.isLength(vendorInput.description, { min: 5 })
    ) {
      errors.push({ message: "Description is Invalid." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const service = await Service.findById("5f452dd3774f006231321f0a");
    if (!service) {
      const error = new Error("Invalid service.");
      error.code = 401;
      throw error;
    }
    const vendor = new Vendor({
      name: vendorInput.name,
      description: vendorInput.description,
      isAvalaible: vendorInput.isAvalaible,
      imageUrl: vendorInput.imageUrl,
      service,
    });
    const createdVendor = await vendor.save();
    service.vendors.push(createdVendor);
    await service.save();
    return {
      ...createdVendor._doc,
      _id: createdVendor._id.toString(),
      createdAt: createdVendor.createdAt.toISOString(),
      updatedAt: createdVendor.updatedAt.toISOString(),
    };
  },

  vendor: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error("Not authenticated!");
    //   error.code = 401;
    //   throw error;
    // }

    const vendor = await Vendor.findById(id).populate("service");
    if (!vendor) {
      const error = new Error("Vendor Not Found");
      error.code = 404;
      throw error;
    }

    return {
      ...vendor._doc,
      _id: vendor._id.toString(),
      createdAt: vendor.createdAt.toISOString(),
      updatedAt: vendor.updatedAt.toISOString(),
    };
  },

  createOrder: async function ({ orderInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error("Not authenticated!");
    //   error.code = 401;
    //   throw error;
    // }
    const errors = [];
    if (
      validator.isEmpty(orderInput.address) ||
      !validator.isLength(orderInput.address, { min: 2 })
    ) {
      errors.push({ message: "Address is Invalid." });
    }
    if (
      validator.isEmpty(orderInput.description) ||
      !validator.isLength(orderInput.description, { min: 5 })
    ) {
      errors.push({ message: "Description is Invalid." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const vendor = await Vendor.findById(orderInput.vendorId);
    if (!vendor) {
      const error = new Error("Invalid Vendor.");
      error.code = 401;
      throw error;
    }
    const user = await User.findById("5f3a3363346d1d60e2b4422e");
    if (!user) {
      const error = new Error("Invalid User.");
      error.code = 401;
      throw error;
    }
    const order = new Order({
      address: orderInput.address,
      description: orderInput.description,
      date: orderInput.date,
      vendor,
      user,
    });
    const createdOrder = await order.save();
    vendor.orders.push(createdOrder);
    user.orders.push(createdOrder);
    await vendor.save();
    await user.save();
    return {
      ...createdOrder._doc,
      _id: createdOrder._id.toString(),
      createdAt: createdOrder.createdAt.toISOString(),
      updatedAt: createdOrder.updatedAt.toISOString(),
    };
  },

 
};
