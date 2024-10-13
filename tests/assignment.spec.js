const { test, expect } = require('@playwright/test');
test('Users from Sparkout should have more than 50% completed tasks', async ({ request }) => {

  // Fetch users data
  const usersResponse = await request.get('http://jsonplaceholder.typicode.com/users');
  const users = await usersResponse.json();

  // Filter users from "Sparkout"
  const sparkoutUsers = users.filter(user => {
    const { lat, lng } = user.address.geo;
    return (lat >= -40 && lat <= 5) && (lng >= 5 && lng <= 100);
  });

  // Loop through each Sparkout user
  for (const user of sparkoutUsers) {
    const userId = user.id;
    const userName = user.name; // Get the user's name

    // Fetch user's todos
    const todosResponse = await request.get(`http://jsonplaceholder.typicode.com/todos?userId=${userId}`);
    const todos = await todosResponse.json();

    // Calculate completion percentage
    const completedTodos = todos.filter(todo => todo.completed);
    const completionPercentage = (completedTodos.length / todos.length) * 100;

    // Verify completion percentage
    console.log(`User ${userName} (ID ${userId}) from Sparkout has ${completionPercentage.toFixed(2)}% completed tasks`);
  }
});