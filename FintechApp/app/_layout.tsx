import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index"
        options={{ 
          title: 'Welcome'
        }} 
      />
      <Stack.Screen 
        name="screens/auth/SignUp" 
        options={{ 
          title: 'Sign Up'
        }} 
      />
      <Stack.Screen 
        name="screens/auth/SignIn" 
        options={{ 
          title: 'Sign In'
        }} 
      />
      <Stack.Screen 
        name="screens/credit/Estimator" 
        options={{ 
          title: 'Credit Estimator',
          headerBackVisible: false
        }} 
      />
    </Stack>
  );
}
