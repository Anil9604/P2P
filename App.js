
import useRouteStore from './src/store/routeStore';
import useWalletStore from './src/store/walletStore';
import useRideStore from './src/store/rideStore';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationPopup from './src/components/NotificationPopup';
import useNotificationStore from './src/store/notificationStore';
import useParcelStore from './src/store/parcelStore';
import useUserStore from './src/store/userStore';
import { initializeDatabase } from './src/services/DatabaseInit';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import PermissionsFlowScreen from './src/screens/PermissionsFlowScreen';
import { MainTabs } from './src/navigation/AppNavigator';
import PostRouteScreen from './src/screens/PostRouteScreen';
import ChatScreen from './src/screens/ChatScreen';
import MapScreen from './src/screens/MapScreen';
import LiveTrackingScreen from './src/screens/LiveTrackingScreen';
import ChatService from './src/services/ChatService';
import ParcelDetailScreen from './src/screens/ParcelDetailScreen';
import TravelerDetailScreen from './src/screens/TravelerDetailScreen';
import TripDetailsScreen from './src/screens/TripDetailsScreen';
import TripRequestsScreen from './src/screens/TripRequestsScreen';
// TripManagementScreen replaced by TripDetailsScreen
import BookRideScreen from './src/screens/BookRideScreen';
import RideShareBookingScreen from './src/screens/RideShareBookingScreen';
import RideDetailsScreen from './src/screens/RideDetailsScreen';
import RideReviewScreen from './src/screens/RideReviewScreen';
import AvailableParcelsScreen from './src/screens/AvailableParcelsScreen';
import DeliveryManagementScreen from './src/screens/DeliveryManagementScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import PublicTrackingScreen from './src/screens/PublicTrackingScreen';

if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    #root, body, html {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
    }
  `;
  document.head.appendChild(style);
}

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  console.log('[App] Mounting...');
  const navigationRef = useRef(null);
  const { user } = useUserStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        console.log('[App] Initializing core services...');
        await initializeDatabase();
        await useUserStore.getState().loadUser();
        const u = useUserStore.getState().user;
        console.log('[App] Loaded user:', u?.user_id);

        if (u?.user_id) {
          // Update Presence immediately
          ChatService.updateUserPresence(u.user_id, true);

          await Promise.all([
            useNotificationStore.getState().loadNotifications(u.user_id),
            useParcelStore.getState().loadParcels(u.user_id),
            useParcelStore.getState().loadAllAvailableParcels(u.user_id),
            useRouteStore.getState().loadRoutes(u.user_id),
            useRouteStore.getState().loadAllActiveTrips(),
            useWalletStore.getState().listenToWallet(u.user_id),
            useRideStore.getState().loadRideRequestsByTraveler(u.user_id),
            useRideStore.getState().loadRideRequestsByPassenger(u.user_id),
          ]);

          // Background Delivery Tracker (Returns unsub function)
          window.unsubDelivery = ChatService.listenAndMarkDelivered(u.user_id);
        }
        console.log('[App] Core services initialized');
      } catch (err) {
        console.error('[App] Init Error:', err);
      } finally {
        setIsReady(true);
        console.log('[App] Ready to render');
      }
    };
    setup();

    // App State Listener for Online Presence
    const subscription = AppState.addEventListener('change', nextAppState => {
      const currentUserId = useUserStore.getState().user?.user_id;
      if (currentUserId) {
        if (nextAppState === 'active') {
          ChatService.updateUserPresence(currentUserId, true);
        } else if (nextAppState.match(/inactive|background/)) {
          ChatService.updateUserPresence(currentUserId, false);
        }
      }
    });

    return () => {
      useNotificationStore.getState().stopListening();
      useParcelStore.getState().stopListening();
      useRouteStore.getState().stopListening();
      useRideStore.getState().stopListening();
      if (window.unsubDelivery) window.unsubDelivery();
      subscription.remove();
    };
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>Initializing P2P Express...</Text>
      </View>
    );
  }

  return (
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Auth" component={AuthStack} />
            <Stack.Screen name="PermissionsFlow" component={PermissionsFlowScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            {/* Global Full-Screen Routes */}
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="TrackingScreen" component={LiveTrackingScreen} />
            <Stack.Screen name="Tracking" component={LiveTrackingScreen} />
            <Stack.Screen name="ParcelTracking" component={LiveTrackingScreen} />
            <Stack.Screen name="ParcelDetail" component={ParcelDetailScreen} />
            <Stack.Screen name="TravelerDetail" component={TravelerDetailScreen} />
            <Stack.Screen name="TripManagement" component={TripDetailsScreen} />
            <Stack.Screen name="ManageTrip" component={TripDetailsScreen} />
            <Stack.Screen name="TripRequests" component={TripRequestsScreen} />
            {/* ManageTrips removed - use Activity + ManageTrip instead */}
            <Stack.Screen name="BookRide" component={BookRideScreen} />
            <Stack.Screen name="RideShareBooking" component={RideShareBookingScreen} />
            <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
            <Stack.Screen name="RideReview" component={RideReviewScreen} />
            <Stack.Screen name="AvailableParcels" component={AvailableParcelsScreen} />
            <Stack.Screen name="DeliveryManagement" component={DeliveryManagementScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="PostRoute" component={PostRouteScreen} />
            <Stack.Screen name="PublicTracking" component={PublicTrackingScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <NotificationPopup navigation={navigationRef.current} />
      </SafeAreaProvider>
  );
}
