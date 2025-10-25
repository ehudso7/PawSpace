import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Divider, useTheme, Surface } from 'react-native-paper';
import type { ProfileScreenProps } from '../../types/navigation';

type Props = ProfileScreenProps<'Settings'>;

const SettingsScreen: React.FC<Props> = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface} elevation={1}>
        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          <List.Item
            title="Push Notifications"
            description="Receive push notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Email Notifications"
            description="Receive email updates"
            left={props => <List.Icon {...props} icon="email" />}
            right={() => (
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
              />
            )}
          />
        </List.Section>
      </Surface>

      <Surface style={styles.surface} elevation={1}>
        <List.Section>
          <List.Subheader>Privacy</List.Subheader>
          <List.Item
            title="Location Services"
            description="Share your location"
            left={props => <List.Icon {...props} icon="map-marker" />}
            right={() => (
              <Switch
                value={locationServices}
                onValueChange={setLocationServices}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            description="Read our privacy policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>
      </Surface>

      <Surface style={styles.surface} elevation={1}>
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            description="Use dark theme"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            )}
          />
        </List.Section>
      </Surface>

      <Surface style={styles.surface} elevation={1}>
        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            description="Read our terms"
            left={props => <List.Icon {...props} icon="file-document" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Help & Support"
            description="Get help"
            left={props => <List.Icon {...props} icon="help-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    marginVertical: 8,
    backgroundColor: 'white',
  },
});

export default SettingsScreen;
