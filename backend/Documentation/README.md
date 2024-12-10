/* server.js */

# Summary of Key Features
This approach consolidates role-based access control, dynamic filtering, 
and a unified endpoint design, making the API flexible, secure, and easy to maintain.

## Unified Endpoint:

  - A single /trips endpoint serves both regular users and admins.
  - Query parameters enable dynamic filtering for fields like status, createdBy, and approvedBy.

## Role-Based Access Control:

  ### Admins:
    - Can access all trips.
    - Can filter trips by any user using the /userID/ query parameter.

  ### Regular Users:
    - Restricted to their own trips (trip.userID === authenticatedUserID).
    - Cannot use the userID query parameter to access other users' trips.

## Dynamic Query Filtering:
  - Query parameters (status, createdBy, approvedBy) allow for flexible filtering of trips.
  - Easily extensible to add more filtering options (e.g., location, date).

## Validation:
  - Normalizes and validates /status/ values against predefined groups (e.g., "submitted" maps to ["approved", "awaiting approval"]).
  - Returns meaningful error messages for invalid queries or unauthorized access.

## Reusability:
  - /authenticate/ middleware ensures only logged-in users can access the API.
  - /authorizeAdmin/ middleware explicitly restricts certain endpoints to admins.

## Scalability:
  - Designed to easily accommodate additional roles or features without changing the core structure.


# Examples for Testing the Endpoint

## Regular User: General Access
  - Get All Trips for Authenticated Regular User:

      GET /trips
      Headers:
        userid: 123
        role: co-worker

      Expected Response:
      Returns all trips where trip.userID === "123".

  - Filter Trips by status=submitted:


      GET /trips?status=submitted
      Headers:
        userid: 123
        role: co-worker

      Expected Response:
      Returns trips for userID=123 with status=approved or status=awaiting approval.

  - Attempt to Access Trips for Another User:

      GET /trips?userID=456
      Headers:
        userid: 123
        role: co-worker

      Expected Response:
      {
        "message": "Access denied. You can only view your own trips."
      }

## Admin: General and Advanced Access
  - Get All Trips (No Filters):

      GET /trips
      Headers:
        userid: 1
        role: admin

      Expected Response:
      Returns all trips in the system.

  - Filter Trips for a Specific User (userID=123):

      GET /trips?userID=123
      Headers:
        userid: 1
        role: admin

      Expected Response:
      Returns all trips where trip.userID === "123".

  - Filter by status=approved and createdBy=John:

      GET /trips?status=approved&createdBy=John
      Headers:
        userid: 1
        role: admin

      Expected Response:
      Returns all trips where status=approved and trip.creation.createdBy === "John".
      
  - Invalid Status Query (status=invalidStatus):

      GET /trips?status=invalidStatus
      Headers:
        userid: 1
        role: admin

      Expected Response:
      {
        "message": "Invalid status: \"invalidStatus\". Please use one of the following: \"not submitted\", \"submitted\", \"approved\", \"awaiting approval\""
      }

## Admin-Only Endpoint
  - Access Admin-Only Endpoint:

        GET /admin/secure-data
        Headers:
          userid: 1
          role: admin

        Expected Response:
        {
          "message": "This is secure data for admins only."
        }
        
  - Unauthorized Access to Admin Endpoint:

        GET /admin/secure-data
        Headers:
          userid: 123
          role: co-worker

        Expected Response:
        {
          "message": "Access denied. Admin only."
        }

## Checklist for Testing
### Authentication:
  - Ensure users without userid or role headers receive a 401 Unauthorized response.
  - Validate that only admin or co-worker roles are accepted.

### Role-Based Access:
  - Regular users can only access their own trips.
  - Admins can access all trips and use advanced filtering options.

### Filtering:
  - Test query parameters (status, createdBy, approvedBy) for valid and invalid inputs.
  - Validate case-insensitive matching for all filters.

### Error Handling:
  - Test for meaningful error messages for invalid queries or unauthorized access.

### Edge Cases:
  - Ensure empty results return a 404 response with a clear message.
  - Verify behavior when no query parameters are provided (e.g., return all accessible trips).