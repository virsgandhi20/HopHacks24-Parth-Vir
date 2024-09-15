Project Summary: Hospital Crowding Estimation Using Wi-Fi Data

Objective: The goal of our project is to develop a system that estimates the crowding levels at hospitals by utilizing Wi-Fi access point data. The primary use case is to help emergency services, such as ambulances, quickly identify the least crowded hospital in real-time, thus reducing wait times and improving patient outcomes. This project aims to create a visualization dashboard that displays hospital crowd levels and provides useful insights to help optimize hospital capacity and resource management.

Project Components:
Data Collection & Processing:

CSV Data: The project will ingest hospital information, including latitude, longitude, name, website, and capacity, from a CSV file. This data will then be processed to create visual markers on a map.
Wi-Fi Connection Data (Simulation): Simulated Wi-Fi connection data will represent the number of devices connected to the hospital’s Wi-Fi network, serving as a proxy for the number of people in the hospital at a given time.
Backend (FastAPI with Python):

FastAPI is used as the backend framework to serve hospital data to the client-side application.
The backend reads the CSV file, processes the hospital data (including latitude, longitude, and website information), and serves it via an API endpoint (/api/hospitals).
CORS Middleware is added to allow the frontend React app to fetch data from the backend.
Frontend (React + Mapbox):

The frontend is built using React and Mapbox for data visualization. Mapbox will display hospitals on an interactive map, with markers representing each hospital’s location.
Each marker includes a popup displaying the hospital’s name and a link to its website. The size and color of markers are customizable, and Wi-Fi connection data can be used to adjust the appearance of the markers to reflect crowding levels.
Visualization and Real-Time Data Updates:

The frontend will visualize real-time crowding data, allowing emergency services or other stakeholders to make quick decisions based on the current crowding levels at nearby hospitals.
The Wi-Fi connection data (simulated or real) will dynamically update to provide insights into crowd levels, helping to optimize ambulance routing and hospital management.
How the Project is Being Built:
Data Fetching: The backend uses FastAPI to serve hospital data from a CSV file, which is fetched by the React frontend.
Map Integration: The React frontend uses Mapbox to display an interactive map with hospital markers based on the fetched data.
Marker Customization: Each hospital is represented by a customized marker (red circles), with popups showing detailed information (hospital name, link to the website).
Dynamic Data Handling: As more real-time data (such as Wi-Fi connections) becomes available, the system can adjust markers dynamically to reflect hospital crowding.
Usefulness of the Project:
For Emergency Services:

The system allows ambulance drivers or emergency services to quickly identify the least crowded hospital, reducing patient wait times in emergency situations and improving resource allocation.
Hospital Management:

Hospital administrators can monitor real-time crowd levels and adjust operations accordingly, such as deploying additional staff or resources to areas with higher congestion.
General Public Use:

Patients and their families can use the system to determine the current crowding at hospitals, helping them decide where to go for non-emergency care, avoiding long waits in overcrowded hospitals.
Optimization of Healthcare Resources:

By providing real-time insights into hospital crowding, the system helps optimize healthcare resource utilization, improve patient care, and reduce strain on heavily crowded hospitals.
Conclusion:
This project aims to develop a scalable and efficient solution for visualizing hospital crowding in real-time using Wi-Fi data. By combining a FastAPI backend with a React frontend, and leveraging Mapbox for visualization, we provide an easy-to-use tool that helps emergency services, hospital administrators, and patients make better-informed decisions.








# WiFi Device Counter Setup Instructions

This guide will help you set up and run the script that detects devices connected to your Mac or WiFi network. Follow the steps based on your operating system (macOS or Windows).

---

## Section 1: macOS Instructions

### 1.1 Install Dependencies
To use the script on macOS, you need to install the necessary network scanning tools and Python.

1. **Install `arp-scan` via Homebrew**:
   - If you don’t have **Homebrew** installed, first install it:
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```

2. **Install `arp-scan`**:
   ```bash
   brew install arp-scan


3. **Install Python**:
   - If you don’t have Python installed, download and install it from the [official website](https://www.python.org/downloads/).

   python3 --version
   
   If you don not have python, run this terminal command:
   brew install python3

4. Check Wifi Interface
    ifconfig

5. Run the script
    sudo python3 wifi_device_counter.py

Section for Windows Instructions

wsl --install

sudo apt-get update

sudo apt-get install arp-scan

python3 --version

sudo apt-get install python3

cd /path/to/your/script/

sudo python3 wifi_device_counter.py
