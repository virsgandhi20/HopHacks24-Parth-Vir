import Papa from 'papaparse';

// Define a type for the hospital data
interface Hospital {
  name: string;
  lat: number;
  lng: number;
  link: string;
}

// Function to parse the CSV file and return a promise of parsed Hospital data
export const parseCsv = (csvData: string): Promise<Hospital[]> => {
  return new Promise<Hospital[]>((resolve: (hospitals: Hospital[]) => void, reject: (error: Error) => void) => {
    Papa.parse(csvData, {
      header: true, // The CSV has headers (column names)
      skipEmptyLines: true, // Ignore empty lines
      complete: (results) => {
        // Map the parsed data into the Hospital format
        const hospitals: Hospital[] = results.data
          .map((hospital: any) => {
            const lat = parseFloat(hospital.Y); // Parse latitude
            const lng = parseFloat(hospital.X); // Parse longitude

            // Validate that lat/lng are valid numbers
            if (isNaN(lat) || isNaN(lng)) {
              console.warn(`Invalid latitude or longitude for hospital: ${hospital.NAME}`);
              return null; // Skip this entry if the lat/lng are invalid
            }

            return {
              name: hospital.NAME,
              lat, // Validated latitude
              lng, // Validated longitude
              link: hospital.WEBSITE || '', // Use empty string if the website is missing
            };
          })
          .filter(Boolean) as Hospital[]; // Filter out any invalid (null) entries

        resolve(hospitals); // Resolve with the valid hospital data
      },
      error: (error : any) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`)); // Reject with an error message
      },
    });
  });
};
