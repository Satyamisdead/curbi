'use server';

/**
 * @fileOverview A flow to suggest alternative parking locations based on real-time availability and user preferences.
 *
 * - suggestAlternativeParking - A function that handles the alternative parking suggestion process.
 * - SuggestAlternativeParkingInput - The input type for the suggestAlternativeParking function.
 * - SuggestAlternativeParkingOutput - The return type for the suggestAlternativeParking function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativeParkingInputSchema = z.object({
  currentLocation: z
    .string()
    .describe('The current location of the user as a string.'),
  preferences: z
    .string()
    .describe('The user preferences for parking, such as price and distance.'),
  realTimeAvailability: z
    .string()
    .describe('The real-time availability of parking spots.'),
});
export type SuggestAlternativeParkingInput = z.infer<typeof SuggestAlternativeParkingInputSchema>;

const SuggestAlternativeParkingOutputSchema = z.object({
  alternativeLocations: z
    .string()
    .describe('A list of alternative parking locations with details.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested alternative locations.'),
});
export type SuggestAlternativeParkingOutput = z.infer<typeof SuggestAlternativeParkingOutputSchema>;

export async function suggestAlternativeParking(
  input: SuggestAlternativeParkingInput
): Promise<SuggestAlternativeParkingOutput> {
  return suggestAlternativeParkingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativeParkingPrompt',
  input: {schema: SuggestAlternativeParkingInputSchema},
  output: {schema: SuggestAlternativeParkingOutputSchema},
  prompt: `You are an AI assistant helping users find alternative parking locations.\n
  Based on the user's current location, preferences, and real-time availability, suggest alternative parking locations.\n  Explain the reasoning behind your suggestions.\n
Current Location: {{{currentLocation}}}\nPreferences: {{{preferences}}}\nReal-time Availability: {{{realTimeAvailability}}}\n
Suggest alternative parking locations:\n`,
});

const suggestAlternativeParkingFlow = ai.defineFlow(
  {
    name: 'suggestAlternativeParkingFlow',
    inputSchema: SuggestAlternativeParkingInputSchema,
    outputSchema: SuggestAlternativeParkingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
