import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

const scheduleDefaultNotifications = async (navigation) => {
  const today = new Date();
  const notificationTimes = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0 , 0),
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0 , 0),
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30 , 0),
  ];

  for (const notificationTime of notificationTimes) {
    if (notificationTime ==  today) {
      console.log('Checking notification time:', notificationTime);      
        if (notificationTime > today) {
          console.log('Scheduling notification for:', notificationTime);
        }
      try {
        if (Platform.OS === 'android') {
          await messaging().scheduleNotification({
            fireDate: notificationTime.getTime(),
            title: 'Reminder!',
            body: 'Please log in and complete the daily survey!',
          });
        } else if (Platform.OS === 'ios') {
        } else if (Platform.OS === 'web') {
          console.log('Requesting notification permission...');
          const options = {
            body: 'Please log in and complete the daily survey!',
          };
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              const notification = new Notification('Reminder!', options);
              notification.onclick = () => {
                navigation.navigate('Player_inputs');
                console.log("notified!");
              };  
            }
            else {
              alert("Please Grant notification permissions");
            }
          });
        }
      } catch (error) {
        console.error('Error scheduling notification:', error);
      }
    }
  }
};

export default scheduleDefaultNotifications;

