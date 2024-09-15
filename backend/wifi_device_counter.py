import os
import re
import subprocess

def get_connected_devices(interface='wlan0'):
    """
    This function uses the arp-scan tool to detect devices connected to the same WiFi network.
    It returns a list of connected devices with their IP addresses, MAC addresses, and possibly device names.
    """
    try:
        # Run arp-scan command to list connected devices on the local network
        # Replace wlan0 with your WiFi interface name if needed
        result = subprocess.run(['sudo', 'arp-scan', '-l', '-I', interface], capture_output=True, text=True)

        # Parse output for IP, MAC addresses and device names
        # Typical arp-scan output looks like: "192.168.1.100    aa:bb:cc:dd:ee:ff   [Device Name]"
        devices = []
        for line in result.stdout.splitlines():
            match = re.search(r'(\d+\.\d+\.\d+\.\d+)\s+([0-9a-f]{2}(:[0-9a-f]{2}){5})', line, re.IGNORECASE)
            if match:
                ip_address = match.group(1)
                mac_address = match.group(2)
                # Some lines might have a device name at the end
                device_name = line.split(mac_address)[-1].strip() if len(line.split(mac_address)) > 1 else "Unknown"
                devices.append({'IP': ip_address, 'MAC': mac_address, 'Name': device_name})

        # Return the list of devices with IP, MAC, and possibly device names
        return devices
    except Exception as e:
        print(f"Error occurred: {e}")
        return []

if __name__ == '__main__':
    # wlan0 is the default WiFi interface, change it to match your system's interface (e.g., en0 for macOS)
    interface = 'en0'
    connected_devices = get_connected_devices(interface)

    # Print connected devices with IP, MAC, and Name (if available)
    print(f"Number of connected devices: {len(connected_devices)}")
    for device in connected_devices:
        print(f"IP Address: {device['IP']}, MAC Address: {device['MAC']}, Device Name: {device['Name']}")
