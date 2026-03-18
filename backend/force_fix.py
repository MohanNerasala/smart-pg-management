import subprocess

# 1. Kill any process named 'java.exe'
print("--- ⚔️ CLEANING UP OLD BACKEND INSTANCES ---")
try:
    print("Forcing full shutdown of all java.exe memory nodes...")
    subprocess.call("taskkill /F /IM java.exe", shell=True)
    print("Process sweep complete.")
except Exception as e:
    print(f"Exception during taskkill: {e}")

print("\n🚀 Ready for fresh boot!")
