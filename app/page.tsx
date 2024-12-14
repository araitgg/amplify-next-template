"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { 
  createTheme,
  defineComponentTheme,
  Authenticator,
  AmplifyProvider
} from "@aws-amplify/ui-react";
import { View } from "@aws-amplify/ui-react";
import { StorageBrowser } from "../components/StorageBrowser";

const storageBrowserTheme = defineComponentTheme({
  name: "storage-browser",
  theme: (tokens) => ({
    wrapper: {
      backgroundColor: tokens.colors.background.primary,
      padding: tokens.space.small,
      borderRadius: tokens.radii.small,
    },
    title: {
      fontWeight: tokens.fontWeights.thin,
    },
  }),
});

const theme = createTheme({
  name: "may-theme",
  primaryColor: "green",
  components: [storageBrowserTheme],
});

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos(data.items || []),
      error: (err) => console.error("Error fetching todos:", err),
    });
    return () => subscription.unsubscribe();
  }

  function createTodo() {
    const content = window.prompt("Enter Todo content:");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  useEffect(() => {
    const unsubscribe = listTodos();
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <AmplifyProvider theme={theme}>
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user?.username}</h1>
            <button onClick={signOut}>Sign out</button>

            <h2>Your Todos</h2>
            <button onClick={createTodo}>Add Todo</button>
            <ul>
              {todos.map((todo, index) => (
                <li key={index}>{todo.content}</li>
              ))}
            </ul>

            {/* StorageBrowser Component */}
            <h2>Your Files</h2>
            <StorageBrowser />
          </main>
        )}
      </Authenticator>
    </AmplifyProvider>
  );
}
