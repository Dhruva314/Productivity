import psutil
import time

# List of application names to block (case-sensitive)
BLOCKED_APPS = ["chrome.exe", "msedge.exe"]  # Add application names here

def block_apps():
    print("Application blocker is running...")
    while True:
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
