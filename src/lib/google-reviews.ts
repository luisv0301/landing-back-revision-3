import { unstable_cache } from 'next/cache';

export interface GoogleReview {
    author_name: string;
    author_url: string;
    language: string;
    original_language: string;
    profile_photo_url: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
    translated: boolean;
}

export interface GooglePlaceResult {
    name: string;
    rating: number;
    user_ratings_total: number;
    reviews: GoogleReview[];
}

interface GooglePlacesLegacyResponse {
    result: GooglePlaceResult;
    status: string;
    html_attributions: string[];
}

export const getGoogleReviews = unstable_cache(
    async (): Promise<GooglePlaceResult | null> => {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        const placeId = process.env.GOOGLE_PLACE_ID;

        if (!apiKey || !placeId) {
            console.error('Faltan variables de entorno GOOGLE_PLACES_API_KEY o GOOGLE_PLACE_ID');
            return null;
        }

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&language=es&key=${apiKey}`;

        try {
            const res = await fetch(url);

            if (!res.ok) {
                console.error(`Google Places HTTP error: ${res.status}`);
                return null;
            }

            const data: GooglePlacesLegacyResponse = await res.json();

            if (data.status !== 'OK') {
                console.error(`Google Places API error status: ${data.status}`);
                return null;
            }

            return data.result;
        } catch (error) {
            console.error('Error al consultar Google Places API:', error);
            return null;
        }
    },
    ['google-places-reviews-legacy'],
    {
        revalidate: 86400, // Caché de 24 horas (en segundos)
        tags: ['google-reviews'],
    }
);