import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack>
      {/* On dit au Stack Navigator de ne pas afficher l'en-tête de base */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}