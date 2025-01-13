import psutil
import time
import os

# List of application names to block (case-sensitive)
BLOCKED_APPS = ["msedge.exe"]  # Add application names here
STOP_FILE = "C:/Users/dhruv/Coding/Productivity/STOP.txt"

os.remove(STOP_FILE)

def block_apps():
    print("Application blocker is running...")
    while (os.path.exists(STOP_FILE) == False):
        for process in psutil.process_iter(['name']):
            try:
                process_name = process.info['name']
                if process_name in BLOCKED_APPS:
                    print(f"Blocking: {process_name}")
                    process.kill()  # Kill the process
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                # Ignore processes that end or are inaccessible
                continue
        time.sleep(1)  # Check every second to minimize CPU usage

if __name__ == "__main__":
    try:
        block_apps()
    except KeyboardInterrupt:
        print("Application blocker stopped.")
