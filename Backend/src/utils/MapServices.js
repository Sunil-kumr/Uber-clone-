
import axios from 'axios'


export const getLatLng=async (address) => {
    const key=process.env.GOMAPS_API_KEY

    const url='https://www.gomaps.pro/maps/api/geocode/json'
   try {
    const response = await axios.get(url, {
        params: {
          address:address,
          key: key,  // Ensure you send your API key
        },
      });
      // console.log(response.data.results[0].geometry.location)
      if (response.status === 200 && response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        return {
            latitude: location.lat,
            longitude: location.lng,
        }
      }
     else{
         console.log('Address not found');
         return null
     }
   } catch (error) {
    console.log(error);
   }
}


export async function getSuggestion(input) {
    const key=process.env.GOMAPS_API_KEY
    try {
        const response = await axios.get('https://maps.gomaps.pro/maps/api/place/queryautocomplete/json', {
            params: {
              input:input,
              key: key,  // Ensure you send your API key
            },
          });
        
          const suggestions=response.data.predictions.map(item=>item.description)
        // console.log('Suggestions:', suggestions);  // Output formatted suggestions
        return suggestions;  // Return the formatted list of suggestions
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        return [];
      }
}

export async function getDistanceandTime(startAddress, endAddress) {
    const key=process.env.GOMAPS_API_KEY
    try {
        const response = await axios.get(
            "https://maps.gomaps.pro/maps/api/distancematrix/json",
            {
              params: {
                origins:startAddress,
                destinations:endAddress,
                key: key, // API key
              },
            }
          );
          // console.log(response.data);
        const data=response.data
        return data
    
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
};
  