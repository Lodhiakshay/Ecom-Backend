const User = require("./src/User/models/user.model")

/**========================================================================
 *                           Comparison Operators
 *========================================================================**/

let users
//! $eq: Matches documents where the value of a field equals the specified value.
// Find users with age 30
 users = await User.find({ age: { $eq: 30 } });

//! $ne: Matches documents where the value of a field is not equal to the specified value.
// Find users not aged 30
 users = await User.find({ age: { $ne: 30 } });

//! $gt: Matches documents where the value of a field is greater than the specified value.
// Find users older than 30
 users = await User.find({ age: { $gt: 30 } });

//! $gte: Matches documents where the value of a field is greater than or equal to the specified value.
// Find users aged 30 or older
 users = await User.find({ age: { $gte: 30 } });

//! $lt: Matches documents where the value of a field is less than the specified value.
// Find users younger than 30
 users = await User.find({ age: { $lt: 30 } });

//! $lte: Matches documents where the value of a field is less than or equal to the specified value.
// Find users aged 30 or younger 
 users = await User.find({ age: { $lte: 30} });

//! $in: Matches any of the values specified in an array.
// Find users with age 20, 25, or 30
 users = await User.find({ age: { $in: [20, 25, 30] } });

//! $nin: Matches none of the values specified in an array.
// Find users not aged 20, 25, or 30
 users = await User.find({ age: { $nin: [20, 25, 30] } });

/**========================================================================
 *                           Logical Operators
 *========================================================================**/

//! $and: Joins query clauses with a logical AND and returns all documents that match the conditions of both clauses.
// Find users aged 30 and name "John"
 users = await User.find({ $and: [{ age: 30 }, { name: "John" }] });

//! $or: Joins query clauses with a logical OR and returns all documents that match the conditions of either clause.
// Find users either aged 30 or named "John"
 users = await User.find({ $or: [{ age: 30 }, { name: "John" }] });

//! $not: Inverts the effect of a query expression and returns documents that do not match the condition.
// Find users not aged 30
 users = await User.find({ age: { $not: { $eq: 30 } } });

//! $nor: Joins query clauses with a logical NOR and returns all documents that fail to match both clauses.
// Find users neither aged 30 nor named "John"
 users = await User.find({ $nor: [{ age: 30 }, { name: "John" }] });


/**========================================================================
 *                        Element Operators
 *========================================================================**/

//! $exists: Matches documents that have the specified field.
// Find users with the 'email' field
 users = await User.find({ email: { $exists: true } });

//! $type: Selects documents if a field is of the specified type.
// Find users where 'age' is a number
 users = await User.find({ age: { $type: "number" } });


/**========================================================================
 *                           Array Operators
 *========================================================================**/
 
//! $all: Matches arrays that contain all elements specified in the query.
// Find users with tags ['tag1', 'tag2']
 users = await User.find({ tags: { $all: ['tag1', 'tag2'] } });

//! $elemMatch: Matches documents that contain an array field with at least one element that matches all the specified criteria.
// Find users where the 'scores' array has an element greater than 80
 users = await User.find({ scores: { $elemMatch: { $gt: 80 } } });

//! $size: Selects documents if the array field is a specified size.
// Find users with exactly 3 tags
 users = await User.find({ tags: { $size: 3 } });



/**========================================================================
 *                           Update Operators
 *========================================================================**/

//! $set: Sets the value of a field in a document.
// Update user's name to "John Doe"
await User.updateOne({ _id: userId }, { $set: { name: "John Doe" } });

//! $unset: Removes the specified field from a document.
// Remove the 'address' field from the user
await User.updateOne({ _id: userId }, { $unset: { address: "" } });

//! $inc: Increments the value of a field by a specified amount.
// Increment user's age by 1
await User.updateOne({ _id: userId }, { $inc: { age: 1 } });

//! $push: Adds an element to an array.
// Add a new tag to the user's tags array
await User.updateOne({ _id: userId }, { $push: { tags: "newTag" } });

//! $pull: Removes an element from an array.
// Remove a tag from the user's tags array
await User.updateOne({ _id: userId }, { $pull: { tags: "oldTag" } });

//! $addToSet: Adds an element to an array if it does not already exist.
// Add a tag to the user's tags array only if it doesn't exist
await User.updateOne({ _id: userId }, { $addToSet: { tags: "uniqueTag" } });

/* These examples demonstrate how you can use MongoDB operators with Mongoose to perform a variety of queries and updates in your application. */
