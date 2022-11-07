import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  Alert,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Card } from "../components/DashboardCard";

export const DashboardFeed = ({dataSource, refresh, onRefresh, user }) => {

  const renderItem = ({ item }) => <Card item={item} user={user} />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dataSource}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onRefresh={onRefresh}
        refreshing={refresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1.2,
    backgroundColor: "steelblue",
  },
  item: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    height: 130,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
  },
  title: {
    fontSize: 15,
  },
});
