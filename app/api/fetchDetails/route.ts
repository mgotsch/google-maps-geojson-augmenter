import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const getPlaceId = async (placeName: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName)}&inputtype=textquery&fields=place_id&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (res.ok && data.candidates && data.candidates.length > 0) {
    return data.candidates[0].place_id;
  }

  console.error(`Failed to find Place ID for ${placeName}`);
  return null;
};

const getPlaceDetails = async (placeId: string, fields: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (res.ok && data.result) {
    return data.result;
  }

  console.error(`Failed to fetch Place Details for Place ID: ${placeId}`);
  return null;
};

export async function POST(req: NextRequest) {
  try {
    const { places, selectedFields } = await req.json();

    if (!places || places.length === 0) {
      return NextResponse.json([], { status: 400 });
    }

    const augmentedPlaces = [];

    for (const place of places) {
      const placeId = await getPlaceId(place.properties.name);

      if (!placeId) {
        console.warn(`No Place ID found for ${place.properties.name}`);
        continue; // skip if Place ID isn't found
      }

      const fields = selectedFields.join(',');
      const placeDetails = await getPlaceDetails(placeId, fields);

      if (placeDetails) {
        augmentedPlaces.push({
          ...place,
          properties: {
            ...place.properties,
            ...placeDetails,
          },
        });
      }
    }

    return NextResponse.json(augmentedPlaces);
  } catch (err) {
    console.error('Error fetching place details:', err);
    return NextResponse.json({ error: 'Failed to augment data' }, { status: 500 });
  }
}
