import mapboxgl from 'mapbox-gl';
import * as d3 from 'd3';

// Define a type for the hospital data, including Suggestive Factor
interface Hospital {
  name: string;
  lat: number;
  lng: number;
  website: string;
  suggestiveFactor: number;
}

// Function to get background color based on Suggestive Factor (1-10 scale)
const getBackgroundColor = (suggestiveFactor: number) => {
  const scale = d3.scaleSequential(d3.interpolateRdYlGn).domain([1, 10]); // Red (1) to Green (10)
  return scale(suggestiveFactor);
};

// Function to get border color based on Suggestive Factor
const getBorderColor = (suggestiveFactor: number) => {
  return suggestiveFactor >= 7 ? '#333' : '#fff'; // Darker border for higher suggestive factor
};

// Function to get text color based on Suggestive Factor
const getTextColor = (suggestiveFactor: number) => {
  return suggestiveFactor >= 7 ? '#003300' : '#660000'; // Dark green for high, red for low
};

export const addMarkers = (map: mapboxgl.Map, hospitals: Hospital[]) => {
  hospitals.forEach((hospital) => {
    console.log('Adding marker for:', hospital.name, hospital.lat, hospital.lng);

    const el = document.createElement('div');
    el.className = 'custom-marker';

    // Set background and border color based on Suggestive Factor
    const backgroundColor = getBackgroundColor(hospital.suggestiveFactor);
    const borderColor = getBorderColor(hospital.suggestiveFactor);
    
    el.style.backgroundColor = backgroundColor;
    el.style.width = '35px';  // Increased size for better visibility
    el.style.height = '35px';  // Increased size for better visibility
    el.style.border = `4px solid ${borderColor}`;  // Thicker border for emphasis
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
    el.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';  // Add shadow for depth

    if (!isNaN(hospital.lng) && !isNaN(hospital.lat)) {
      new mapboxgl.Marker(el)
        .setLngLat([hospital.lng, hospital.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="
              background-color: ${backgroundColor};
              padding: 20px;
              border-radius: 12px;
              box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
              border: 2px solid ${borderColor};
              transition: all 0.3s ease;
              color: ${getTextColor(hospital.suggestiveFactor)};
              font-family: 'Arial', sans-serif;
              max-width: 320px;
              text-align: center;
            ">
              <h3 style="margin-top: 0; font-size: 1.5em; font-weight: 600;">${hospital.name}</h3>
              <p style="font-size: 1.2em; color: ${getTextColor(hospital.suggestiveFactor)};">
                Suggestive Factor: <strong>${hospital.suggestiveFactor.toFixed(2)}</strong>
              </p>
              <a href="${hospital.website}" target="_blank" style="
                display: inline-block;
                padding: 12px 20px;
                background-color: ${borderColor};
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-size: 1em;
                transition: background-color 0.3s ease;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              " onmouseover="this.style.backgroundColor='#000000';" onmouseout="this.style.backgroundColor='${borderColor}';">
                View Details
              </a>
            </div>
          `)
        )
        .addTo(map);
    } else {
      console.warn('Invalid coordinates for:', hospital.name);
    }
  });
};

// Add some custom CSS animations to the popup cards
const style = document.createElement('style');
style.textContent = `
  @keyframes popupFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .custom-marker {
    transition: all 0.3s ease;
  }

  .custom-marker:hover {
    transform: scale(1.2);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
`;
document.head.appendChild(style);
