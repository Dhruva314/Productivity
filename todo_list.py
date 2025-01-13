import tkinter as tk
from tkinter import messagebox

# Create the main application window
root = tk.Tk()
root.title("To-Do List Application")
root.geometry("400x500")

# To-Do List Storage
todo_list = []

# Function to update the listbox
def update_listbox():
    listbox.delete(0, tk.END)  # Clear the listbox
    for task in todo_list:
        listbox.insert(tk.END, task)  # Add tasks to the listbox

# Function to add a new task
def add_task():
    task = task_entry.get().strip()
    if task:
        todo_list.append(task)
        update_listbox()
        task_entry.delete(0, tk.END)
    else:
        messagebox.showwarning("Input Error", "Task cannot be empty!")

# Function to delete the selected task
def delete_task():
    selected_task_index = listbox.curselection()
    if selected_task_index:
        task_to_remove = listbox.get(selected_task_index)
        todo_list.remove(task_to_remove)
        update_listbox()
    else:
        messagebox.showwarning("Selection Error", "Please select a task to delete.")

# Function to mark a task as complete
def complete_task():
    selected_task_index = listbox.curselection()
    if selected_task_index:
        task_to_complete = listbox.get(selected_task_index)
        todo_list.remove(task_to_complete)
        todo_list.append(f"{task_to_complete} (Completed)")
        update_listbox()
    else:
        messagebox.showwarning("Selection Error", "Please select a task to mark as complete.")

# Function to send stop signal and exit
def send_stop_signal():
    with open("STOP.txt", "w") as file:
        file.write("Stopping application blocker.\n")
    messagebox.showinfo("Stop Signal", "Stop signal sent. Exiting.")
    root.destroy()

# UI Components
frame = tk.Frame(root)
frame.pack(pady=20)

task_entry = tk.Entry(frame, width=30)
task_entry.pack(side=tk.LEFT, padx=10)

add_button = tk.Button(frame, text="Add Task", command=add_task)
add_button.pack(side=tk.LEFT)

listbox = tk.Listbox(root, width=50, height=20)
listbox.pack(pady=20)

delete_button = tk.Button(root, text="Delete Task", command=delete_task)
delete_button.pack(side=tk.LEFT, padx=10)

complete_button = tk.Button(root, text="Mark as Complete", command=complete_task)
complete_button.pack(side=tk.LEFT, padx=10)

stop_button = tk.Button(root, text="Send Stop Signal", command=send_stop_signal, bg="red", fg="white")
stop_button.pack(pady=20)

# Run the application
root.mainloop()
