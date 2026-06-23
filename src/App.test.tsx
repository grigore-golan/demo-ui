import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import App from './App';
import userEvent from "@testing-library/user-event";

global.fetch = jest.fn();

describe("Todo App", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test("loads and displays todos", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        { id: 1, title: "First todo", isComplete: false },
        { id: 2, title: "Second todo", isComplete: true }
      ]
    });

    render(<App />);

    expect(await screen.findByText("First todo ❌")).toBeInTheDocument();
    expect(await screen.findByText("Second todo ✅")).toBeInTheDocument();
  });

  test("adds a new todo", async () => {
    (fetch as jest.Mock)
        // initial load
        .mockResolvedValueOnce({ json: async () => [] })
        // add todo
        .mockResolvedValueOnce({
          json: async () => ({ id: 1, title: "New todo", isComplete: false })
        });

    render(<App />);

    const input = screen.getByPlaceholderText("New todo...");
    await userEvent.type(input, "New todo");
    fireEvent.click(screen.getByText("Add"));

    expect(await screen.findByText("New todo ❌")).toBeInTheDocument();
  });

  test("toggles a todo", async () => {
    (fetch as jest.Mock)
        // initial load
        .mockResolvedValueOnce({
          json: async () => [{ id: 1, title: "Toggle me", isComplete: false }]
        })
        // toggle response
        .mockResolvedValueOnce({
          json: async () => ({ id: 1, title: "Toggle me", isComplete: true })
        });

    render(<App />);

    fireEvent.click(await screen.findByText("Toggle"));

    expect(await screen.findByText("Toggle me ✅")).toBeInTheDocument();
  });

  test("deletes a todo", async () => {
    (fetch as jest.Mock)
        // initial load
        .mockResolvedValueOnce({
          json: async () => [{ id: 1, title: "Delete me", isComplete: false }]
        })
        // delete response
        .mockResolvedValueOnce({});

    render(<App />);

    fireEvent.click(await screen.findByText("Delete"));

    await waitFor(() => {
      expect(screen.queryByText("Delete me ❌")).not.toBeInTheDocument();
    });
  });
});