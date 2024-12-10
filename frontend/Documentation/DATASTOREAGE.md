# Best Practices for Storing Frontend Inputs
## Store All Inputs But Validate:

   Accept all inputs from the frontend, but validate them in the backend.
   
   Example: If the frontend provides totalDays, the backend should recalculate it and store only the correct value.

## Use Optional Fields for Derived Data:

  Leave space for derived values (e.g., totalDays), even if they can be calculated dynamically. This allows you to store them if needed for optimization or completeness.

## Distinguish Between Input and Calculated Data:

  If storing derived values, make it clear in the schema or documentation which fields are calculated (e.g., a comment or prefix).

## Normalize Data:

  Ensure the backend normalizes input data (e.g., dates in ISO 8601, consistent casing for strings).

# Recommended Approach
## For a scalable and production-ready application:

  1-Use MongoDB for storage, with a schema similar to the one above.
  2-Accept all frontend input, including totalDays.
  3-Recalculate totalDays in the backend for consistency but store the submitted value if it's useful for auditing.
  4-Provide clear documentation on which fields are user-provided versus derived.

# Decision Framework
  Prototyping: Use a JSON file.
  Production: Use MongoDB or another database.
  Frontend Inputs: Always validate in the backend but leave space in the schema for derived data like totalDays and totalAmount.