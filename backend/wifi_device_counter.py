import os
import re
import subprocess

def get_connected_devices(interface='wlan0'):
    """
    This function uses the arp-scan tool to detect devices connected to the same WiFi network.
    """
    try:
        # Run arp-scan command to list connected devices on the local network
        # Replace wlan0 with your WiFi interface name if needed
        result = subprocess.run(['sudo', 'arp-scan', '-l', '-I', interface], capture_output=True, text=True)

        # Parse output for device count
        # arp-scan lists devices with MAC and IP addresses, so we search for matching lines
        devices = re.findall(r'([0-9a-f]{2}(:[0-9a-f]{2}){5})', result.stdout, re.IGNORECASE)

        # Return the number of unique MAC addresses (connected devices)
        return len(set(devices))
    except Exception as e:
        print(f"Error occurred: {e}")
        return 0

if __name__ == '__main__':
    # wlan0 is the default WiFi interface, change it to match your system's interface (e.g., en0 for macOS)
    interface = 'wlan0'
    connected_devices = get_connected_devices(interface)
    print(f"Number of connected devices: {connected_devices}")
