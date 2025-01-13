import tkinter as tk
from tkinter import messagebox
import datetime

# Create the main application window
root = tk.Tk()
root.title("To-Do List Application")
root.geometry("400x500")

# To-Do List Storage
date = datetime.date.today()
todo_list = []
todo_list_display = []

# Function to update the listbox
def update_listbox():
    listbox.delete(0, tk.END)  # Clear the listbox
    for task in todo_list_display:
        listbox.insert(tk.END, task)  # Add tasks to the listbox

# Function to add a new task
def add_task():
    task = task_entry.get().strip()
    if task:
        todo_list.append({"Task": task, "Completed": False})
        todo_list_display.append(task)
        update_listbox()
        task_entry.delete(0, tk.END)
    else:
        messagebox.showwarning("Input Error", "Task cannot be empty!")
    
    char_count = 0
    for task in todo_list:
      char_count += len(task["Task"])

    if (char_count >= 20*3 and len(todo_list) >= 3):
        with open("STOP.txt", "w") as file:
            file.write("Stopping application blocker.\n")

# Function to delete the selected task
def delete_task():
    print(todo_list_display)
    selected_task_index = listbox.curselection()
    if selected_task_index:
        task_to_remove = listbox.get(selected_task_index)
        todo_list_display.remove(task_to_remove)
        for i, task in enumerate(todo_list):
            if (task["Task"] == task_to_remove):
                todo_list.pop(i)
                break
        update_listbox()
    else:
        messagebox.showwarning("Selection Error", "Please select a task to delete.")

# Function to mark a task as complete
def complete_task():
    selected_task_index = listbox.curselection()
    if selected_task_index:
        task_to_complete = listbox.get(selected_task_index)
        for task in todo_list:
            if (task["Task"] == task_to_complete):
                task["Completed"] = True
                break
        todo_list_display.remove(task_to_complete)
        todo_list_display.append(f"{task_to_complete} (Completed)")
        update_listbox()
    else:
        messagebox.showwarning("Selection Error", "Please select a task to mark as complete.")

# Function to send stop signal and exit
def todo_list_termination():
    with open("todo_list_history.txt", "a") as file:  
      file.write(f"Date: {date}\n")
      for task in todo_list:
          file.write(f"Task: {task["Task"]}\n", )
          file.write(f"Completed: {task["Completed"]}\n" )
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

stop_button = tk.Button(root, text="Send Stop Signal", command=todo_list_termination, bg="red", fg="white")
stop_button.pack(pady=20)

# Run the application
root.mainloop()
