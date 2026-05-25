import * as React from "react";
import Head from "next/head";
import { TodoList } from "components/todo-list";

export default function TodoPage() {
  return (
    <>
      <Head>
        <title>Todo List</title>
        <meta
          name="description"
          content="A simple todo list with localStorage persistence."
        />
      </Head>
      <TodoList />
    </>
  );
}
