import pandas as pd
import subprocess
import re

def get_connected_devices(interface='wlan0'):
    """
    This function uses the arp-scan tool to detect devices connected to the same WiFi network.
    It returns a list of connected devices with their IP addresses, MAC addresses, and possibly device names.
    """
    try:
        # Run arp-scan command to list connected devices on the local network
        result = subprocess.run(['sudo', 'arp-scan', '-l', '-I', interface], capture_output=True, text=True)

        # Parse output for IP, MAC addresses and device names
        devices = []
        for line in result.stdout.splitlines():
            match = re.search(r'(\d+\.\d+\.\d+\.\d+)\s+([0-9a-f]{2}(:[0-9a-f]{2}){5})', line, re.IGNORECASE)
            if match:
                ip_address = match.group(1)
                mac_address = match.group(2)
                device_name = line.split(mac_address)[-1].strip() if len(line.split(mac_address)) > 1 else "Unknown"
                devices.append({'IP': ip_address, 'MAC': mac_address, 'Name': device_name})

        return devices
    except Exception as e:
        print(f"Error occurred: {e}")
        return []

def modify_csv(file_path, hospital_name, total_devices):
    """
    Modifies a specific hospital record in the CSV file.
    It updates the 'No of Access Points connected', recalculates 'Patients',
    and updates the 'Suggestive Factor' based on the provided formula.
    """
    # Load the CSV file
    hospital_data = pd.read_csv(file_path)

    # Find the hospital by name
    hospital_index = hospital_data[hospital_data['NAME'].str.contains(hospital_name, case=False, na=False)].index

    if len(hospital_index) == 0:
        print(f"Hospital '{hospital_name}' not found.")
        return

    # Modify the selected hospital record
    for idx in hospital_index:
        # Update the 'No of Access Points connected'
        hospital_data.at[idx, 'No of Access Points connected'] += total_devices

        # Update the 'Patients' (adjust based on total devices or other logic)
        hospital_data.at[idx, 'Patients'] += total_devices * 0.6  # Adjusting Patients slightly

        # Recalculate Suggestive Factor using the formula
        beds = hospital_data.at[idx, 'BEDS']
        patients = hospital_data.at[idx, 'Patients']
        ttl_staff = hospital_data.at[idx, 'TTL_STAFF']
        trauma = hospital_data.at[idx, 'TRAUMA']
        helipad = hospital_data.at[idx, 'HELIPAD']

        new_suggestive_factor = ((beds / patients) * (ttl_staff / patients) + (trauma + helipad)) / 2
        hospital_data.at[idx, 'Suggestive_Factor'] = new_suggestive_factor

    # Save the modified CSV back to the file
    hospital_data.to_csv(file_path, index=False)
    print(f"Updated hospital '{hospital_name}' with total_devices: {total_devices}")

if __name__ == '__main__':
    # Example usage
    file_path = 'us_hospital_locations_modified_v4.csv'  # Path to your CSV file
    hospital_name = "MEDSTAR UNION MEMORIAL HOSPITAL"  # The hospital to update
    interface = 'en0'  # Change to match your system (e.g., wlan0 on Linux)

    # Get the list of connected devices
    connected_devices = get_connected_devices(interface)
    total_devices = len(connected_devices)

    print(f"Number of connected devices: {total_devices}")

    # Modify the CSV for the given hospital
    modify_csv(file_path, hospital_name, total_devices)

    print("Made changes in the CSV file")
