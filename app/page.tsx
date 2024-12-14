"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { StorageBrowser } from "../components/StorageBrowser";
import { Authenticator, components } from '@aws-amplify/ui-react';
import { View } from "@aws-amplify/ui-react";
import { ThemeStyle } from "@aws-amplify/ui-react/server";
import { createTheme } from "@aws-amplify/ui-react";
import { defineComponentTheme } from "@aws-amplify/ui-react/server";

import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcMinus,
  FcNext,
  FcPrevious,
  FcRefresh,
  FcSearch,
} from 'react-icons/fc';
import { IconsProvider } from '@aws-amplify/ui-react';

Amplify.configure(outputs);
const client = generateClient<Schema>();

const storageBrowserTheme = defineComponentTheme({
  name: 'storage-browser',
  theme: (tokens) => {
    return {
      _element: {
        controls: {
          flexDirection: 'row-reverse',
          backgroundColor: tokens.colors.background.primary,
          padding: tokens.space.small,
          borderRadius: tokens.radii.small,
        },
        title: {
          fontWeight: tokens.fontWeights.thin,
        }
      }
    }
  }
})

const theme = createTheme({
  name: 'my-theme',
  primaryColor: 'green',
  components: [storageBrowserTheme],
})

export default function App() {
  return (
    <View backgroundColor="background.tertiary" {...theme.containerProps()}>
      <IconsProvider
      icons={{
        storageBrowser: {
          refresh: <FcRefresh />,
          'sort-indeterminate': <FcMinus />,
          'sort-ascending': <FcAlphabeticalSortingAz />,
          'sort-descending': <FcAlphabeticalSortingZa />,
        },
        searchField: {
          search: <FcSearch />,
        },
        pagination: {
          next: <FcNext />,
          previous: <FcPrevious />,
        },
      }}
      >
        <StorageBrowser />
        </IconsProvider>
      <ThemeStyle theme={theme} />
    </View>
  );
}
