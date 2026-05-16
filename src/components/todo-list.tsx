import * as React from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "todo-list:v1";

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is Todo =>
        t &&
        typeof t.id === "string" &&
        typeof t.text === "string" &&
        typeof t.done === "boolean" &&
        typeof t.createdAt === "number"
    );
  } catch {
    return [];
  }
}

function createId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function TodoList() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [draft, setDraft] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setTodos(loadTodos());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, hydrated]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: createId(), text, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    setDraft("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.done));
  };

  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done
  );

  const remaining = todos.filter((t) => !t.done).length;
  const completed = todos.length - remaining;

  return (
    <section className="w-full max-w-xl mx-auto px-4 py-10">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Todos</h1>
        <p className="text-sm opacity-70 mt-1">
          {hydrated
            ? `${remaining} remaining · ${completed} completed`
            : "Loading…"}
        </p>
      </header>

      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo"
          className="flex-1 px-3 py-2 rounded border border-gray-300 bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      <div className="flex items-center gap-2 mb-4 text-sm">
        {(["all", "active", "completed"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={
              "px-3 py-1 rounded-full border " +
              (filter === f
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800")
            }
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button
          type="button"
          onClick={clearCompleted}
          disabled={completed === 0}
          className="ml-auto px-3 py-1 text-sm underline disabled:no-underline disabled:opacity-40"
        >
          Clear completed
        </button>
      </div>

      <ul className="divide-y divide-gray-200 border border-gray-200 rounded">
        {visible.length === 0 && (
          <li className="px-4 py-8 text-center opacity-60">
            {todos.length === 0
              ? "No todos yet. Add one above."
              : "Nothing here."}
          </li>
        )}
        {visible.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 px-4 py-3 group"
          >
            <input
              id={`todo-${todo.id}`}
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className="w-5 h-5 cursor-pointer"
            />
            <label
              htmlFor={`todo-${todo.id}`}
              className={
                "flex-1 cursor-pointer break-words " +
                (todo.done ? "line-through opacity-50" : "")
              }
            >
              {todo.text}
            </label>
            <button
              type="button"
              onClick={() => removeTodo(todo.id)}
              aria-label={`Delete ${todo.text}`}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-red-600 hover:text-red-800 transition-opacity"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
