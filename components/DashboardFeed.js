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
  const navigation = useNavigation();

  const pushCommentScreen = () => {
    navigation.navigate('CommentScreen', {user: user})
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dataSource}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onRefresh={onRefresh}
        refreshing={refresh}
        ListHeaderComponent={
        <Text style={{color: 'white', fontSize: 17, marginLeft: 10, }}>User Activity</Text>}
      />
      <TouchableOpacity onPress={() => pushCommentScreen()} style={styles.fab}>
        <Icon name='add' style={{color: 'white', fontSize: 30}}></Icon>
      </TouchableOpacity>
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
  fab: { 
    position: 'absolute', 
    width: 50, 
    height: 50, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 20, 
    bottom: 20, 
    backgroundColor: 'orange', 
    borderRadius: 30, 
    elevation: 8 
    }, 
});
