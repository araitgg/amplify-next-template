"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { 
  ThemeStyle,
  createTheme,
  defineComponentTheme,
  Authenticator } from "@aws-amplify/ui-react";
import { StorageBrowser } from '../components/StorageBrowser';


const storageBrowserTheme = defineComponentTheme({
  name: 'storage-browser'
  theme: (tokens) => {
    return {
      _element: {
        controls: {
          flexDirection: 'ron-reverse',
          backgroundColor: tokens.colors.background.primary,
          padding: tokens.space.small,
          borderRadius: tokens.radii.small
        },
        title: {
          fontWeight: tokens.fontWeights.thin,
        }
      }
    }
  }
})

const theme = createTheme({
  name: 'may-theme',
  primaryColor: 'green',
  components: [storageBrowserTheme],
})

export default function Example() {
  return (
    <View backgroundColor="background.tertiary" {...theme.containerProps()} >
      <StorageBrowser />
      <ThemeStyle theme={theme}/>
    </View>
  )
}

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
        <main>

          {/* StorageBrowser Component */}
          <h2>Your Files</h2>
          <StorageBrowser />

        </main>
  );
}
