import keyboard
from collections import Counter
import os

# File path for logging
log_file_path = r"C:\key_log.txt"

# Initialize key stats
key_stats = Counter()
key_log = []

def log_key(event):
    global key_log

    # Record the key pressed
    key = event.name
    key_log.append(key)
    key_stats[key] += 1

    # Append the key to the file (temporary logging)
    with open(log_file_path, "a") as log_file:
        log_file.write(f"{key}\n")

def calculate_and_save_stats():
    # Calculate total key presses
    total_keystrokes = sum(key_stats.values())

    # Generate the statistics summary
    stats_lines = [
        "Key Statistics:\n",
        f"{'Key':<15} {'Count':<10} {'Percentage':<10}\n",
        "-" * 40 + "\n"
    ]

    for key, count in key_stats.items():
        percentage = (count / total_keystrokes) * 100 if total_keystrokes else 0
        stats_lines.append(f"{key:<15} {count:<10} {percentage:.2f}%\n")

    stats_lines.append("-" * 40 + "\n")
    stats_lines.append(f"Total Keystrokes: {total_keystrokes}\n")

    # Replace the log file content with the stats
    with open(log_file_path, "w") as log_file:
        log_file.writelines(stats_lines)

def main():
    # Ensure the log file exists
    if not os.path.exists(log_file_path):
        with open(log_file_path, "w") as log_file:
            log_file.write("Key Log:\n")

    print("Press ESC to stop logging and save stats.\n")

    # Register the event for key presses
    keyboard.on_press(log_key)

    # Wait until ESC is pressed to stop the program
    keyboard.wait('esc+e')

    # Calculate and save stats
    calculate_and_save_stats()
    print("Stats saved to the file. Exiting...")

if __name__ == "__main__":
    main()
