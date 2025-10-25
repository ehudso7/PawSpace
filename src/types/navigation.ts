import type { NavigatorScreenParams } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { AuthStackParamList } from '@/navigation/AuthNavigator';
import type { TabParamList } from '@/navigation/TabNavigator';

export type { RootStackParamList, AuthStackParamList, TabParamList };

export type AppNavigatorParams = NavigatorScreenParams<RootStackParamList>;
