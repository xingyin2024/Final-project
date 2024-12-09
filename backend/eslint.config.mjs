import eslintPluginReact from "eslint-plugin-react";
import eslintPluginNode from "eslint-plugin-node";
import globals from "globals";

export default [
  {
    // Specify language options and globals
    languageOptions: {
      ecmaVersion: 2021, // Enable modern JavaScript syntax
      sourceType: "module", // Allow ES Modules (import/export)
      globals: {
        ...globals.node, // Add Node.js global variables (e.g., process, __dirname)
        ...globals.es2021, // Add ES2021 globals
      },
    },

    // Add plugins
    plugins: {
      react: eslintPluginReact, // React linting rules
      node: eslintPluginNode, // Node.js-specific rules
    },

    // Settings for plugins
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },

    // Define linting rules
    rules: {
      // General JavaScript rules
      "no-unused-vars": "warn", // Warn about unused variables
      "no-undef": "error", // Error on undefined variables
      "semi": ["error", "always"], // Require semicolons
      "comma-dangle": ["error", "always-multiline"], // Enforce trailing commas for multiline objects/arrays
      "quotes": ["error", "double"], // Enforce double quotes
      "indent": ["error", 2], // Enforce 2-space indentation

      // React-specific rules
      "react/prop-types": "off", // Turn off prop-types validation (if using TypeScript or prefer not to use prop-types)
      "react/display-name": "off", // Turn off display name requirement for components

      // Node.js-specific rules
      "node/no-unsupported-features/es-syntax": "off", // Allow ES Modules (import/export)
      "node/no-missing-import": "error", // Error on missing imports
      "node/no-unpublished-import": "off", // Allow unpublished imports (useful for monorepos or local modules)
    },
  },
];

// common command to debug
// npm run lint
// npx eslint server.js --debug

// to fix bug auto
//npx eslint server.js --fix

