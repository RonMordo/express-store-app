export const createUserBodySchema = {
  email: {
    in: ["body"],
    isString: {
      errorMessage: "Email must be a string",
    },
    notEmpty: {
      errorMessage: "Email cant be empty",
    },
  },
  username: {
    in: ["body"],
    isString: {
      errorMessage: "Username must be a string",
    },
    notEmpty: {
      errorMessage: "Username cant be empty",
    },
    isLength: {
      options: { min: 5, max: 15 },
      errorMessage: "Username must contain 5-15 characters",
    },
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password must be a string",
    },
    notEmpty: {
      errorMessage: "Password cant be empty",
    },
    isLength: {
      options: { min: 5, max: 15 },
      errorMessage: "Password must contain 5-15 characters",
    },
  },
  displayName: {
    in: ["body"],
    isString: {
      errorMessage: "Display name must be a string",
    },
    notEmpty: {
      errorMessage: "Display name cant be empty",
    },
  },
};

export const loginUserBodySchema = {
  username: {
    in: ["body"],
    isString: {
      errorMessage: "Username must be a string",
    },
    notEmpty: {
      errorMessage: "Username cant be empty",
    },
    isLength: {
      options: { min: 5, max: 15 },
      errorMessage: "Username must contain 5-15 characters",
    },
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password must be a string",
    },
    notEmpty: {
      errorMessage: "Password cant be empty",
    },
    isLength: {
      options: { min: 5, max: 15 },
      errorMessage: "Password must contain 5-15 characters",
    },
  },
};

export const getProductQuerySchema = {
  filter: {
    in: ["query"],
    optional: true,
    isString: {
      errorMessage: "Filter must be a string",
    },
    notEmpty: {
      errorMessage: "Filter cant be empty",
    },
  },
  value: {
    in: ["query"],
    optional: true,
    isString: {
      errorMessage: "Filter value must be a string",
    },
    notEmpty: {
      errorMessage: "Filter value cant be empty",
    },
  },
  sort: {
    in: ["query"],
    optional: true,
    isString: {
      errorMessage: "Sort value must be a string",
    },
    isLength: {
      options: { min: 1, max: 1 },
      errorMessage: "Sort value must be 1 or 2",
    },
    notEmpty: {
      errorMessage: "Sort value cant be empty",
    },
  },
};

export const addCartItemBodySchema = {
  productId: {
    in: ["body"],
    isString: {
      errorMessage: "Product ID must be a string",
    },
    notEmpty: {
      errorMessage: "Product ID cant be empty",
    },
  },
  quantity: {
    in: ["body"],
    isInt: {
      options: { min: 1 },
      errorMessage: "Quantity must be a positive integer",
    },
    toInt: true,
    notEmpty: {
      errorMessage: "Quantity cant be empty",
    },
  },
};
