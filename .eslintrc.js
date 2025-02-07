module.exports = {
  env: {
    node: true,        // Enables Node.js global variables and scoping
    commonjs: true,    // Enables CommonJS module system (require, module.exports)
    es2021: true,      // Enables ES2021 features (like optional chaining, nullish coalescing)
  },
  extends: [
    'eslint:recommended', // Uses recommended ESLint rules
    'prettier'            // Disables conflicting ESLint rules with Prettier
  ],
};