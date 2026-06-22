import React, { useEffect, useState } from "react";

type Todo = { id: number; title: string; isComplete: boolean };
const api = `${process.env.REACT_APP_API_URL}/api/todo`;

export default function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState("");

    // Load all todos
    useEffect(() => {
        fetch(api)
            .then(res => res.json())
            .then(setTodos);
    }, []);

    // Add new todo
    const addTodo = async () => {
        const res = await fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, isComplete: false })
        });
        const newTodo = await res.json();
        setTodos([...todos, newTodo]);
        setTitle("");
    };

    // Update todo
    const toggleTodo = async (todo: Todo) => {
        const res = await fetch(`${api}/${todo.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...todo, isComplete: !todo.isComplete })
        });
        const updated = await res.json();
        setTodos(todos.map(t => (t.id === updated.id ? updated : t)));
    };

    // Delete todo
    const deleteTodo = async (id: number) => {
        await fetch(`${api}/${id}`, { method: "DELETE" });
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Todo List</h1>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="New todo..."
            />
            <button onClick={addTodo}>Add</button>
            <ul>
                {todos.map(t => (
                    <li key={t.id}>
                        {t.title} {t.isComplete ? "✅" : "❌"}
                        <button onClick={() => toggleTodo(t)}>Toggle</button>
                        <button onClick={() => deleteTodo(t.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
