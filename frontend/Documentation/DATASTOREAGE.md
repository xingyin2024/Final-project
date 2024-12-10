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